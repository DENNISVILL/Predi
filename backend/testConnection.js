const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function testDb() {
    try {
        console.log("Testing connection to:", process.env.DATABASE_URL);
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection Successful:', res.rows[0]);

        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('✅ Tables found:', tables.rows.map(r => r.table_name));

        const users = await pool.query('SELECT * FROM users LIMIT 1');
        console.log('✅ Users table readable. Rows:', users.rows.length);

    } catch (err) {
        console.error('❌ Connection Failed:', err);
    } finally {
        await pool.end();
    }
}

testDb();
