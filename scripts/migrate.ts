import { verifyLocationsTable } from '../src/lib/migrations';

async function runMigrations() {
  console.log('Running migrations...');

  // Verify and create locations table if needed
  await verifyLocationsTable();

  console.log('Migrations completed!');
}

runMigrations().catch(console.error); 