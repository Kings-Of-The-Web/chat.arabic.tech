import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import dotenv from 'dotenv';
import db from '../lib/helpers/Database';

// Load environment variables
dotenv.config();

const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);

const MIGRATIONS_DIR = path.join(process.cwd(), '.scripts', 'migrations');

// Ensure migrations directory exists
async function ensureMigrationsDir() {
  try {
    await mkdir(MIGRATIONS_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists, ignore
  }
}

// Create migrations table if it doesn't exist
async function ensureMigrationsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Migrations table created or already exists');
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
}

// Get all applied migrations
async function getAppliedMigrations(): Promise<string[]> {
  try {
    const rows = await db.query<{ name: string }[]>('SELECT name FROM migrations ORDER BY id ASC');
    return rows.map(row => row.name);
  } catch (error) {
    console.error('Error getting applied migrations:', error);
    throw error;
  }
}

// Get all migration files
async function getMigrationFiles(): Promise<string[]> {
  try {
    const files = await readdir(MIGRATIONS_DIR);
    return files
      .filter(file => file.endsWith('.ts'))
      .sort(); // Sort to ensure migrations run in order
  } catch (error) {
    console.error('Error getting migration files:', error);
    throw error;
  }
}

// Create a new migration file
async function createMigration(name: string): Promise<void> {
  await ensureMigrationsDir();
  
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  const fileName = `${timestamp}_${name.replace(/\s+/g, '_')}.ts`;
  const filePath = path.join(MIGRATIONS_DIR, fileName);
  
  const template = `import db from '../../lib/helpers/Database';

export async function up(): Promise<void> {
  // Write your migration code here
  await db.query(\`
    -- Your SQL here
  \`);
}

export async function down(): Promise<void> {
  // Write code to revert the migration here
  await db.query(\`
    -- Your SQL here
  \`);
}
`;

  await writeFile(filePath, template, 'utf8');
  console.log(`Created migration: ${fileName}`);
}

// Run pending migrations
async function runMigrations(): Promise<void> {
  await ensureMigrationsDir();
  await ensureMigrationsTable();
  
  const appliedMigrations = await getAppliedMigrations();
  const migrationFiles = await getMigrationFiles();
  
  const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));
  
  if (pendingMigrations.length === 0) {
    console.log('No pending migrations to apply');
    return;
  }
  
  console.log(`Found ${pendingMigrations.length} pending migrations`);
  
  for (const migrationFile of pendingMigrations) {
    console.log(`Applying migration: ${migrationFile}`);
    
    try {
      // Import the migration file
      const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
      const migration = await import(migrationPath);
      
      // Run the up function
      await migration.up();
      
      // Record the migration
      await db.query('INSERT INTO migrations (name) VALUES (?)', [migrationFile]);
      
      console.log(`Successfully applied migration: ${migrationFile}`);
    } catch (error) {
      console.error(`Error applying migration ${migrationFile}:`, error);
      throw error;
    }
  }
  
  console.log('All migrations applied successfully');
}

// Rollback the last migration
async function rollbackLastMigration(): Promise<void> {
  await ensureMigrationsTable();
  
  // Get the last applied migration
  const lastMigration = await db.query<{ id: number, name: string }[]>(
    'SELECT id, name FROM migrations ORDER BY id DESC LIMIT 1'
  );
  
  if (!lastMigration || lastMigration.length === 0) {
    console.log('No migrations to rollback');
    return;
  }
  
  const { id, name } = lastMigration[0];
  console.log(`Rolling back migration: ${name}`);
  
  try {
    // Import the migration file
    const migrationPath = path.join(MIGRATIONS_DIR, name);
    const migration = await import(migrationPath);
    
    // Run the down function
    await migration.down();
    
    // Remove the migration record
    await db.query('DELETE FROM migrations WHERE id = ?', [id]);
    
    console.log(`Successfully rolled back migration: ${name}`);
  } catch (error) {
    console.error(`Error rolling back migration ${name}:`, error);
    throw error;
  }
}

// Main function to handle command line arguments
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'create':
        if (!args[1]) {
          console.error('Migration name is required');
          process.exit(1);
        }
        await createMigration(args[1]);
        break;
        
      case 'run':
        await runMigrations();
        break;
        
      case 'rollback':
        await rollbackLastMigration();
        break;
        
      case 'status':
        await ensureMigrationsTable();
        const appliedMigrations = await getAppliedMigrations();
        const migrationFiles = await getMigrationFiles();
        
        console.log('Applied migrations:');
        appliedMigrations.forEach(m => console.log(`- ${m}`));
        
        const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));
        console.log('\nPending migrations:');
        if (pendingMigrations.length === 0) {
          console.log('- None');
        } else {
          pendingMigrations.forEach(m => console.log(`- ${m}`));
        }
        break;
        
      default:
        console.log(`
Migration Manager

Usage:
  ts-node --project tsconfig.scripts.json .scripts/migration-manager.ts <command>

Commands:
  create <name>  Create a new migration
  run            Run all pending migrations
  rollback       Rollback the last applied migration
  status         Show migration status
        `);
        break;
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

export { createMigration, runMigrations, rollbackLastMigration }; 