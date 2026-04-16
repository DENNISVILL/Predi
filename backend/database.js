const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL Connection Pool
// We use a connection string if provided (e.g. from Hetzner/Supabase)
// or fallback to local credentials.
// Conditional DB Connection
let pool = null;

if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    pool.on('connect', () => console.log('📦 Connected to PostgreSQL database'));
    pool.on('error', (err) => console.error('❌ DB Error:', err));
} else {
    console.warn('⚠️  NO DATABASE_URL FOUND. Running in Memory-Only Mode (Data will not persist).');
}

const mockUsers = [];

module.exports = {
    // If pool exists, use it. If not, return valid-looking empty structure for local dev
    query: (text, params) => {
        if (!pool) {
            console.log('📝 [Mock DB] Query ignored (No DB):', text);
            if (text.startsWith('INSERT INTO users')) {
                 // params depending on where it's called. In local register: [email, hash, name]
                 const newUser = { id: Date.now(), email: params[0], password_hash: params[1], name: params[2] };
                 mockUsers.push(newUser);
                 return Promise.resolve({ rows: [newUser] });
            }
            if (text.startsWith('SELECT * FROM users WHERE email')) {
                 const user = mockUsers.find(u => u.email === params[0]);
                 return Promise.resolve({ rows: user ? [user] : [] });
            }
            if (text.startsWith('SELECT * FROM users WHERE id')) {
                 const user = mockUsers.find(u => u.id === params[0]);
                 return Promise.resolve({ rows: user ? [user] : [] });
            }
            return Promise.resolve({ rows: [] }); // Return empty result to prevent crash
        }
        return pool.query(text, params);
    },
    pool,
};
