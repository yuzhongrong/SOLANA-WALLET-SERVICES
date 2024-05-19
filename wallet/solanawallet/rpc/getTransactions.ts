
import { ParsedTransactionWithMeta, TransactionSignature } from "@solana/web3.js";
import {solanaConnection} from "./SolanaConnection"

async function getTransactions(signatures: TransactionSignature[]): Promise<(ParsedTransactionWithMeta | null)[]> {
    try {
        // 获取解析交易列表
        const parsedTransactions = await solanaConnection.getParsedTransactions(signatures);

        return parsedTransactions;
    } catch (error) {
        console.error('Failed to get transactions:', error);
        return [];
    }
}


// 示例：获取指定交易签名列表的解析交易信息
const transactionSignatures: TransactionSignature[] = ["5MHRztUUg27cYAj1pRo35M5SvG5FveqVHdynDvG7ZYzityHKxpqn7AhpLT9FJkFefbdc2rmUTKfund7S8hXYC62k"]; // 替换为你要查询的交易签名列表
getTransactions(transactionSignatures)
    .then(parsedTransactions => {
        console.log("Parsed transactions:", JSON.stringify(parsedTransactions));
    })
    .catch(error => {
        console.error("Error:", error);
    });