import { res } from 'pino-std-serializers';
import {PublicKey } from '@solana/web3.js';

// 初始化连接
import {mAlchemySolanaConnection} from "./alchemy_rpc/AlchemySolanaConnection"
import { extractTransferInfo, getTransactionsResults } from './getTransationHistory';



export async function getSolTransactions(walletAddress:string, before:string|undefined) {
    const publicKey = new PublicKey(walletAddress);
    const transactionHistory = [];

    // 获取交易签名
    const confirmedSignatures = await mAlchemySolanaConnection.getSignaturesForAddress(publicKey, {
        limit: 10, // 每次获取15条记录
        before: before,
    });

    const signatures = confirmedSignatures.map(sigInfo => sigInfo.signature);
    // console.log(JSON.stringify(signatures))
    const transactions = await mAlchemySolanaConnection.getParsedTransactions(signatures,{maxSupportedTransactionVersion: 0});
    // 使用filter方法筛选出符合条件的交易记录
    // const solTransactions = transactions.filter(tx => 
    //     tx && tx.transaction.message.instructions.some(instr => instr.programId.toBase58() === "11111111111111111111111111111111")
    // );

    transactionHistory.push(...transactions);
    console.log('---------------------------- signatures: ----------------------------', signatures.length);

    const parsedTransactions = await Promise.all(transactionHistory.map(async transaction => {
        if (!transaction) {
            console.log('Transaction is not confirmed yet');
            return null;
        }
        
        // console.log('---------------------------- Extracting useful information... ----------------------------',JSON.stringify(transaction));
        const result = await extractTransferInfo(transaction);
        // console.log('---------------------------- Extraction result: ----------------------------', JSON.stringify(result));
       
         if(!result?.isSolTransfer){//filter spl

          return null;
         }

        return result;
    }));
    console.log('---------------------------- extractTransferInfo: ----------------------------', parsedTransactions.length);

    const WrapResult= await getTransactionsResults(parsedTransactions)
    console.log('---------------------------- getTransactionsResults: ----------------------------', WrapResult.length);

    return WrapResult;
}

// 示例调用
// getSolTransactions("2uhu96aU75jbiMzLoguvHmADY39rb3q84qBwJqyPhpzh", "").then(transactions => {
//     console.log('所有相关的SOL交易记录:', transactions);
// }).catch(error => {
//     console.error('获取交易记录时出错:', error);
// });
