const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbName = 'predix_db';
const dbUser = 'postgres';
const dbPass = 'Makiran98#'; // User provided password
const dbHost = 'localhost';
const dbPort = 5432;

// Connection to 'postgres' default database to check/create target DB
const setupClient = new Client({
    user: dbUser,
    host: dbHost,
    database: 'postgres',
    password: dbPass,
    port: dbPort,
});

async function setupDatabase() {
    try {
        await setupClient.connect();

        // Check if database exists
        const res = await setupClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Creating database ${dbName}...`);
            await setupClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }

        await setupClient.end();

        // Now connect to the new database to apply schema
        const appClient = new Client({
            user: dbUser,
            host: dbHost,
            database: dbName,
            password: dbPass,
            port: dbPort,
        });

        await appClient.connect();

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying schema...');
        await appClient.query(schemaSql);
        console.log('Schema applied successfully.');

        await appClient.end();
        console.log('✅ Setup complete!');

    } catch (err) {
        console.error('❌ Setup failed:', err);
    }
}

setupDatabase();
