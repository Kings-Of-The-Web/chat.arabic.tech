import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

class Database {
    private static instance: Database;
    private pool: mysql.Pool;

    private constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query<T>(sql: string, params?: any[]): Promise<T> {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows as T;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    public async getConnection(): Promise<mysql.PoolConnection> {
        try {
            return await this.pool.getConnection();
        } catch (error) {
            console.error('Error getting database connection:', error);
            throw error;
        }
    }

    public async transaction<T>(
        callback: (connection: mysql.PoolConnection) => Promise<T>
    ): Promise<T> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    public async close(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
        }
    }
}

export default Database.getInstance();
