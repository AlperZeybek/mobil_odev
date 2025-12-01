import * as SQLite from 'expo-sqlite';

// Database instance
let db = null;

/**
 * Initialize database and create tables
 */
export const initDatabase = async () => {
  try {
    // Open database connection using new async API
    db = await SQLite.openDatabaseAsync('focus_tracker.db');
    
    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');
    
    // Create table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        duration_minutes INTEGER NOT NULL,
        distraction_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Save a focus session to database
 */
export const saveSession = async (session) => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }

  try {
    const result = await db.runAsync(
      `INSERT INTO focus_sessions 
       (category, start_time, end_time, duration_minutes, distraction_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        session.category,
        session.startTime,
        session.endTime,
        session.durationMinutes,
        session.distractionCount || 0,
        session.createdAt,
      ]
    );
    
    console.log('Session saved:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

/**
 * Get all sessions from database
 */
export const getAllSessions = async () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }

  try {
    const result = await db.getAllAsync(
      `SELECT * FROM focus_sessions 
       ORDER BY created_at DESC;`
    );
    
    return result;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

/**
 * Get sessions from last 7 days
 */
export const getSessionsFromLast7Days = async () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString();

    const result = await db.getAllAsync(
      `SELECT * FROM focus_sessions 
       WHERE created_at >= ?
       ORDER BY created_at DESC;`,
      [dateString]
    );
    
    return result;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

/**
 * Get summary statistics
 */
export const getSummaryStats = async () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString();

    // Get today's total
    const todayResult = await db.getFirstAsync(
      `SELECT SUM(duration_minutes) as today_total
       FROM focus_sessions
       WHERE created_at >= ?;`,
      [todayString]
    );

    // Get all time total
    const allTimeResult = await db.getFirstAsync(
      `SELECT SUM(duration_minutes) as all_time_total
       FROM focus_sessions;`
    );

    // Get total distractions
    const distractionsResult = await db.getFirstAsync(
      `SELECT SUM(distraction_count) as total_distractions
       FROM focus_sessions;`
    );

    return {
      todayTotal: todayResult?.today_total || 0,
      allTimeTotal: allTimeResult?.all_time_total || 0,
      totalDistractions: distractionsResult?.total_distractions || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};
