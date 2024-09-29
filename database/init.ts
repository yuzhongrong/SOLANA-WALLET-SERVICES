import pool from './database';
import { FieldPacket, Pool, RowDataPacket } from 'mysql2/promise';

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

    //type:0 (ico)，type:1 (ido)
    const table_presale = `
    CREATE TABLE IF NOT EXISTS presale (
      id INT AUTO_INCREMENT PRIMARY KEY,
      wallet VARCHAR(255) NOT NULL DEFAULT 'v1Fs6G4smFUtX4X1kCj5Z5u8hg1ccoMf35e5GWQAEG2',
      price VARCHAR(255) NOT NULL DEFAULT '0.001',
      soft VARCHAR(255) NOT NULL DEFAULT '500',
      hard VARCHAR(255) NOT NULL DEFAULT '2000',
      endtime VARCHAR(255) NOT NULL DEFAULT '1751212800000',
      pool VARCHAR(255) NOT NULL DEFAULT '0',
      type INT NOT NULL DEFAULT 0,
      amount VARCHAR(255) NOT NULL DEFAULT '200000000'
      
    );
  `;

  await connection.query(table_presale);



  const table_presale_orders = `
  CREATE TABLE IF NOT EXISTS presale_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fromaddress VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    receiver_sol VARCHAR(255) NOT NULL,
    send_mego VARCHAR(255) NOT NULL,
    tx VARCHAR(255) NOT NULL,
    created_at VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL DEFAULT '0'
  );
`;

await connection.query(table_presale_orders);


    console.log('Init Tables success');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    connection.release();
  }
}

//swapstate表的增删改查

// 插入一条记录
 export async function insertSwapState(tx: string, state: string) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO swapstate (tx, state) VALUES (?, ?)';
    const [result] = await connection.query(query, [tx, state]);
    console.log('Record inserted:', result);
  } catch (error) {
    console.error('Error inserting record:', error);
  } finally {
    connection.release();
  }
}

// 删除一条记录
async function deleteSwapState(id: number) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM swapstate WHERE id = ?';
    const [result] = await connection.query(query, [id]);
    console.log('Record deleted:', result);
  } catch (error) {
    console.error('Error deleting record:', error);
  } finally {
    connection.release();
  }
}


// 更新一条记录
export async function updateSwapStateByTx(tx: string, state: string) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE swapstate SET state = ? WHERE tx = ?';
    const [result] = await connection.query(query, [state, tx]);
    console.log('Record updated:', result);
  } catch (error) {
    console.error('Error updating record:', error);
  } finally {
    connection.release();
  }
}

// 查询单条记录
export async function getSwapStateByTxId(txId: string) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM swapstate WHERE tx = ?';
    const [rows] = await connection.query(query, [txId]);
    console.log('Record fetched:', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching record:', error);
  } finally {
    connection.release();
  }
}


//presale 操作

interface PresaleItem extends RowDataPacket {
  id: number;
  wallet: string;
  price: string;
  soft: string;
  hard: string;
  endtime: string;
  pool: string;
  type: number;
  amount: string;
}

// 定义接口
interface PresaleOrderRecord extends RowDataPacket{
  tx: string;
  state: string;
  price?: string; // 可选参数
  fromAddress: string;
  receiverSol: string;
  sendMego: string;
  createdAt: string;
}

// 查询单条记录
export async function getPresaleByWallet(wallet: string): Promise<PresaleItem | null> {
  const connection = await pool.getConnection();
  try {
      const query = 'SELECT * FROM presale WHERE wallet = ?';
      const [rows]: [PresaleItem[], FieldPacket[]] = await connection.query(query, [wallet]);

      console.log('Record fetched:', rows);
      return rows.length > 0 ? rows[0] : null; // 返回第一个 item 或 null
  } catch (error) {
      console.error('Error fetching record:', error);
      return null;
  } finally {
      connection.release();
  }
}

//插入一个预售记录
export async function insertPresaleRecord(tx: string, state: string,price:string|undefined,fromaddress:string,receiver_sol:string,send_mego:string,created_at:string) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO presale_orders (tx, state,price,fromaddress,receiver_sol,send_mego,created_at) VALUES (?,?,?,?,?,?,?)';
    const [result] = await connection.query(query, [tx, state,price,fromaddress,receiver_sol,send_mego,created_at]);
    console.log('Record inserted:', result);
  } catch (error) {
    console.error('Error inserting record:', error);
  } finally {
    connection.release();
  }
}


// 查询最新一条预售订单记录
export async function getLatestPresaleOrder(): Promise<PresaleOrderRecord | null> {
  const connection = await pool.getConnection();
  try {
      const query = 'SELECT * FROM presale_orders ORDER BY id ASC LIMIT 1';
      const [rows]: [PresaleOrderRecord[], FieldPacket[]] = await connection.query(query);

      console.log('Latest record fetched:', rows);
      return rows.length > 0 ? rows[0] : null; // 返回最新的 item 或 null
  } catch (error) {
      console.error('Error fetching latest record:', error);
      return null;
  } finally {
      connection.release();
  }
}













