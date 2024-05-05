import { PublicKey } from "@solana/web3.js";

// 定义地址
const address = '5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY';

// 创建程序 ID
const programId = PublicKey.createProgramAddress([Buffer.from(address)], new PublicKey('seed'));

// 输出程序 ID
// console.log('Program ID:', programId.toBase58());
