import pool from './database';

export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
        const table_state = `
          CREATE TABLE IF NOT EXISTS swapstate (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tx VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL
          );
        `;
        await connection.query(table_state);

        const table_wallet = `
        CREATE TABLE IF NOT EXISTS wallet (
          id INT AUTO_INCREMENT PRIMARY KEY,
          address VARCHAR(255) NOT NULL,
          referrals VARCHAR(255) NOT NULL
        );
      `;
      await connection.query(table_wallet);

      const table_point_miner = `
      CREATE TABLE IF NOT EXISTS point_miner (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet VARCHAR(255) NOT NULL,
        exvolume VARCHAR(255) NOT NULL,
        point VARCHAR(255) NOT NULL,
        referrals_point VARCHAR(255) NOT NULL
        
      );
    `;
    await connection.query(table_point_miner);

    console.log('Init Tables success');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    connection.release();
  }
}





