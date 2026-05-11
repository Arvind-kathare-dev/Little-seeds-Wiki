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
    // 1. Ensure Groups 1 and 2 exist
    console.log('Checking Groups...');
    let adminGroup = await knex('groups').where('id', 1).first();
    if (!adminGroup) {
      console.log('Admin Group (ID 1) missing. Creating...');
      await knex('groups').insert({
        id: 1,
        name: 'Administrators',
        isSystem: true,
        permissions: '{"manage:system": true}',
        pageRules: '[]',
        redirectOnLogin: '/',
        createdAt: now,
        updatedAt: now
      });
    }

    let guestGroup = await knex('groups').where('id', 2).first();
    if (!guestGroup) {
      console.log('Guest Group (ID 2) missing. Creating...');
      await knex('groups').insert({
        id: 2,
        name: 'Guests',
        isSystem: true,
        permissions: '{}',
        pageRules: '[]',
        redirectOnLogin: '/',
        createdAt: now,
        updatedAt: now
      });
    }

    // 2. Ensure Root User (ID 1) exists
    console.log('Checking Root User...');
    let rootUser = await knex('users').where('id', 1).first();
    if (!rootUser) {
      console.log('Root User (ID 1) missing. Creating...');
      await knex('users').insert({
        id: 1,
        email: 'admin@wiki.js',
        name: 'Administrator',
        password: 'admin', // Should be changed immediately
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
    }

    // 3. Ensure Guest User (ID 2) exists
    console.log('Checking Guest User...');
    let guestUser = await knex('users').where('id', 2).first();
    if (!guestUser) {
      console.log('Guest User (ID 2) missing. Checking if it exists with another ID...');
      const existingGuest = await knex('users').where('email', 'guest@wiki.js').first();
      if (existingGuest) {
        console.log(`Found guest user with ID ${existingGuest.id}. Deleting it to recreate with ID 2...`);
        await knex('userGroups').where('userId', existingGuest.id).delete();
        await knex('users').where('id', existingGuest.id).delete();
      }

      console.log('Creating Guest User with ID 2...');
      await knex('users').insert({
        id: 2,
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
    }

    // 4. Ensure Guest User is in Guest Group
    console.log('Checking User-Group Relations...');
    const guestRelation = await knex('userGroups').where({ userId: 2, groupId: 2 }).first();
    if (!guestRelation) {
      console.log('Adding Guest User to Guest Group...');
      await knex('userGroups').insert({
        userId: 2,
        groupId: 2
      });
    }

    const adminRelation = await knex('userGroups').where({ userId: 1, groupId: 1 }).first();
    if (!adminRelation) {
      console.log('Adding Root User to Admin Group...');
      await knex('userGroups').insert({
        userId: 1,
        groupId: 1
      });
    }

    console.log('--- DB Fix Completed Successfully ---');
  } catch (err) {
    console.error('Error fixing database:', err);
  } finally {
    await knex.destroy();
  }
}

fix();
