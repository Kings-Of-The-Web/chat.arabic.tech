import createTables from './create-tables';

async function setupDatabase() {
    try {
        console.log('Starting database setup...');

        // Create tables
        await createTables();

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
}

// Run the setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

export default setupDatabase;
