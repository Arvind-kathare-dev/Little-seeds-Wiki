const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: 'postgresql://neondb_owner:npg_z0d9ClEvZaRx@ep-fragrant-bird-apsm2o2y-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  }
});

async function inspect() {
  try {
    console.log('--- Users ---');
    const users = await knex('users').select('id', 'email', 'name', 'isSystem');
    console.table(users);

    console.log('--- Groups ---');
    const groups = await knex('groups').select('id', 'name', 'isSystem');
    console.table(groups);

    console.log('--- User-Group Relations ---');
    const relations = await knex('userGroups').select('*');
    console.table(relations);
  } catch (err) {
    console.error('Error inspecting database:', err);
  } finally {
    await knex.destroy();
  }
}

inspect();
