const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: 'postgresql://neondb_owner:npg_z0d9ClEvZaRx@ep-fragrant-bird-apsm2o2y-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  }
});

async function fix() {
  console.log('--- Database Fix Started ---');
  const now = new Date().toISOString();
  try {
    // 1. Check if Guest Group exists
    let guestGroup = await knex('groups').where('name', 'Guest').first();
    if (!guestGroup) {
      console.log('Guest Group missing. Creating...');
      const [newGroup] = await knex('groups').insert({
        name: 'Guest',
        isSystem: true,
        permissions: '{}',
        pageRules: '[]',
        redirectOnLogin: '/',
        createdAt: now,
        updatedAt: now
      }).returning('*');
      guestGroup = newGroup;
      console.log('Guest Group created!');
    } else {
      console.log('Guest Group already exists.');
    }

    // 2. Check if Guest User exists
    const guestUser = await knex('users').where('email', 'guest@wiki.js').first();
    if (!guestUser) {
      console.log('Guest User missing. Creating...');
      await knex('users').insert({
        email: 'guest@wiki.js',
        name: 'Guest',
        password: 'NONE',
        providerKey: 'local',
        isSystem: true,
        isActive: true,
        isVerified: true,
        createdAt: now,
        updatedAt: now,
        timezone: 'UTC',
        localeCode: 'en',
        defaultEditor: 'markdown'
      });
      console.log('Guest User created successfully!');
    } else {
      console.log('Guest User already exists.');
    }

    console.log('--- DB Fix Completed Successfully ---');
  } catch (err) {
    console.error('Error fixing database:', err);
  } finally {
    await knex.destroy();
  }
}

fix();
