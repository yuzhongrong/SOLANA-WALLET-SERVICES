
import { Blockhash, BlockhashWithExpiryBlockHeight } from "@solana/web3.js";
import {solanaConnection} from "./SolanaConnection"

export async function getLatestBlockhash(): Promise<Blockhash> {
    try {
        // 获取最新区块哈希信息
        const latestBlockhashInfo = await solanaConnection.getLatestBlockhash();
        return latestBlockhashInfo.blockhash;
    } catch (error) {
        console.error('Error fetching latest blockhash:', error);
        throw new Error('Failed to fetch latest blockhash');
    }
}

// getLatestBlockhash()
// .then(v=>{console.log(v) })
// .catch(e=>{console.log(e)})