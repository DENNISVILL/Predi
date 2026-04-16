const { query } = require('./database');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    try {
        console.log('🔄 Migrating Database...');
        await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_access_token TEXT;`);
        await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;`);
        console.log('✅ Columns (google_access_token, google_refresh_token) added successfully');
    } catch (e) {
        console.error('❌ Error migrating:', e);
    }
    process.exit();
}
run();
