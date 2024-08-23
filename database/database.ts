import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Abc5341842...',
  database: 'mego',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

