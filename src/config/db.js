import mysql from 'mysql2/promise';

const pool = mysql.createPool({ //2
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true, //3
    connectionLimit: 10, //4
    queueLimit: 0 //5
});
export default pool;