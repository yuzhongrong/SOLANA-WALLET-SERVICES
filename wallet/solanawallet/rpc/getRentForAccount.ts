import { Account, Connection, PublicKey } from '@solana/web3.js';
import {solanaConnection} from "./SolanaConnection"




// 获取账户租金
export async function getRentForAccount(wallet: string): Promise<number> {
    try {
        const publicKey = new PublicKey(wallet);
        // 获取账户信息
        const accountInfo = await solanaConnection.getAccountInfo(publicKey);
        if (!accountInfo) {
            throw new Error('Account not found');
        }
        
        // 计算账户数据大小
        const dataSize = accountInfo.data.length;

        // 获取账户租金
        const rent = await solanaConnection.getMinimumBalanceForRentExemption(dataSize);
        return rent / 10 ** 9; // 将 rent 转换为 SOL 单位并返回
    } catch (error) {
        console.error('Failed to get rent:', error);
        return 0;
    }
}

// 示例：获取指定账户的租金
// const publicKey = new PublicKey('5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY');
// getRentForAccount(publicKey).then(rent => {
//     console.log(`Rent for account ${publicKey}: ${rent} SOL`);
// });
