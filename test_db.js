const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_z0d9ClEvZaRx@ep-fragrant-bird-apsm2o2y.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to Neon PostgreSQL!');
    
    // Check for tables
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Existing tables in DB:', res.rows.map(r => r.table_name).join(', '));
    
    if (res.rows.length > 0) {
      console.log('Tables already exist. Setup was likely successful.');
    } else {
      console.log('No tables found yet. Setup wizard needs to be completed.');
    }
    
  } catch (err) {
    console.error('Connection error:', err.stack);
  } finally {
    await client.end();
  }
}

testConnection();
