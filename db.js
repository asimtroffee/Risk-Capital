const { Pool } = require('pg');
const format = require('pg-format');

// PostgreSQL Connection Pool configuration
const connectionString = process.env.DATABASE_URL;

const poolConfig = {
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
};

if (connectionString) {
  poolConfig.connectionString = connectionString;
  // Enable SSL for cloud databases (Render, Supabase, Neon, Railway)
  if (process.env.NODE_ENV === 'production' || connectionString.includes('render.com') || connectionString.includes('supabase.co') || connectionString.includes('neon.tech')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  poolConfig.host = process.env.PGHOST || 'localhost';
  poolConfig.port = parseInt(process.env.PGPORT || '5432', 10);
  poolConfig.user = process.env.PGUSER || 'postgres';
  poolConfig.password = process.env.PGPASSWORD || 'postgres';
  poolConfig.database = process.env.PGDATABASE || 'risk_capital';
}

const pool = new Pool(poolConfig);

let isDbConnected = false;

// Initialize Database Schema
async function initDb() {
  let client;
  try {
    client = await pool.connect();
    isDbConnected = true;

    await client.query(`
      -- 1. Sessions Table
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        room_code VARCHAR(4) NOT NULL,
        started_at TIMESTAMP WITH TIME ZONE NOT NULL,
        ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
        total_rounds INTEGER NOT NULL
      );

      -- 2. Players Table (Uses client player_uuid as PRIMARY KEY)
      CREATE TABLE IF NOT EXISTS players (
        player_uuid UUID PRIMARY KEY,
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        nickname VARCHAR(64) NOT NULL,
        final_cash NUMERIC NOT NULL,
        final_net_worth NUMERIC NOT NULL,
        final_risk_score INTEGER NOT NULL,
        final_title VARCHAR(64),
        rank INTEGER NOT NULL
      );

      -- 3. Decisions Table
      CREATE TABLE IF NOT EXISTS decisions (
        id SERIAL PRIMARY KEY,
        player_uuid UUID REFERENCES players(player_uuid) ON DELETE CASCADE,
        round_index INTEGER NOT NULL,
        sector_id VARCHAR(64) NOT NULL,
        amount_invested NUMERIC NOT NULL,
        outcome_amount NUMERIC
      );

      -- 4. Session Snapshots Table (Single row per room for crash recovery)
      CREATE TABLE IF NOT EXISTS session_snapshots (
        room_code VARCHAR(4) PRIMARY KEY,
        state_json JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Indexes for fast reporting and lookups
      CREATE INDEX IF NOT EXISTS idx_players_session_id ON players(session_id);
      CREATE INDEX IF NOT EXISTS idx_decisions_player_uuid ON decisions(player_uuid);
      CREATE INDEX IF NOT EXISTS idx_decisions_round_sector ON decisions(round_index, sector_id);
    `);

    console.log('✓ PostgreSQL connected and database schema initialized.');
  } catch (err) {
    isDbConnected = false;
    console.warn(`⚠️ PostgreSQL connection not available (${err.message}). In-memory gameplay will continue normally.`);
  } finally {
    if (client) client.release();
  }
}

// -------------------------------------------------------------
// SNAPSHOT OPERATIONS (Crash Recovery)
// -------------------------------------------------------------

async function saveSnapshot(roomCode, stateJson) {
  if (!isDbConnected) return false;
  try {
    const query = `
      INSERT INTO session_snapshots (room_code, state_json, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (room_code)
      DO UPDATE SET
        state_json = EXCLUDED.state_json,
        updated_at = NOW();
    `;
    await pool.query(query, [roomCode.toUpperCase().trim(), JSON.stringify(stateJson)]);
    return true;
  } catch (err) {
    console.error(`[DB Snapshot Error] Failed to save snapshot for room ${roomCode}:`, err.message);
    return false;
  }
}

async function getSnapshot(roomCode) {
  if (!isDbConnected) return null;
  try {
    const res = await pool.query(
      'SELECT state_json, updated_at FROM session_snapshots WHERE room_code = $1',
      [roomCode.toUpperCase().trim()]
    );
    if (res.rows.length > 0) {
      return res.rows[0].state_json;
    }
    return null;
  } catch (err) {
    console.error(`[DB Snapshot Error] Failed to fetch snapshot for room ${roomCode}:`, err.message);
    return null;
  }
}

async function deleteSnapshot(roomCode) {
  if (!isDbConnected) return false;
  try {
    await pool.query('DELETE FROM session_snapshots WHERE room_code = $1', [roomCode.toUpperCase().trim()]);
    return true;
  } catch (err) {
    console.error(`[DB Snapshot Error] Failed to delete snapshot for room ${roomCode}:`, err.message);
    return false;
  }
}

// -------------------------------------------------------------
// END-OF-GAME TRANSACTIONAL BATCH PERSISTENCE
// -------------------------------------------------------------

/**
 * Persists the completed session, players, and decision history in a single transaction
 * with batched multi-row INSERT statements.
 */
async function saveCompletedSession({ roomCode, startedAt, endedAt, totalRounds, playersList }) {
  if (!isDbConnected) {
    console.log(`[DB] Database offline. Completed session ${roomCode} recorded in memory.`);
    return null;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert Session Row
    const sessionRes = await client.query(
      `INSERT INTO sessions (room_code, started_at, ended_at, total_rounds)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [roomCode, new Date(startedAt), new Date(endedAt), totalRounds]
    );
    const sessionId = sessionRes.rows[0].id;

    // 2. Prepare Players batch data
    // player_uuid, session_id, nickname, final_cash, final_net_worth, final_risk_score, final_title, rank
    const playersRows = [];
    const decisionsRows = [];

    for (const player of playersList) {
      playersRows.push([
        player.id, // Must be valid UUID
        sessionId,
        player.nickname,
        player.liquidCash,
        player.liquidCash, // final_net_worth
        player.riskScore || 0,
        player.title || 'Investor',
        player.rank || 0
      ]);

      if (Array.isArray(player.decisionHistory)) {
        for (const dec of player.decisionHistory) {
          decisionsRows.push([
            player.id,
            dec.roundIndex,
            dec.sectorId,
            dec.amountInvested,
            dec.outcomeAmount
          ]);
        }
      }
    }

    // 3. Batch Insert Players (pg-format multi-row)
    if (playersRows.length > 0) {
      const playersSql = format(
        `INSERT INTO players (player_uuid, session_id, nickname, final_cash, final_net_worth, final_risk_score, final_title, rank)
         VALUES %L
         ON CONFLICT (player_uuid) DO UPDATE SET
           session_id = EXCLUDED.session_id,
           nickname = EXCLUDED.nickname,
           final_cash = EXCLUDED.final_cash,
           final_net_worth = EXCLUDED.final_net_worth,
           final_risk_score = EXCLUDED.final_risk_score,
           final_title = EXCLUDED.final_title,
           rank = EXCLUDED.rank`,
        playersRows
      );
      await client.query(playersSql);
    }

    // 4. Batch Insert Decisions (pg-format multi-row)
    if (decisionsRows.length > 0) {
      const decisionsSql = format(
        `INSERT INTO decisions (player_uuid, round_index, sector_id, amount_invested, outcome_amount)
         VALUES %L`,
        decisionsRows
      );
      await client.query(decisionsSql);
    }

    // 5. Clean up the crash recovery snapshot for this room
    await client.query('DELETE FROM session_snapshots WHERE room_code = $1', [roomCode]);

    await client.query('COMMIT');
    console.log(`✓ [DB Persisted] Session ${sessionId} (Room ${roomCode}): ${playersRows.length} players, ${decisionsRows.length} decisions written in single transaction.`);
    return sessionId;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ [DB Transaction Failed] Session write aborted for Room ${roomCode}:`, err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initDb,
  saveSnapshot,
  getSnapshot,
  deleteSnapshot,
  saveCompletedSession,
  isDbConnected: () => isDbConnected
};
