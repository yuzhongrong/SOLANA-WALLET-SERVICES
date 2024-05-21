import {  ConfirmedSignatureInfo, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import {solanaConnection} from "./SolanaConnection"
import { DateTime } from 'luxon';

interface TokenAmount {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
}

type TransferInfo = {
    sender: string;
    receiver: string;
    amount: number;
    signature: string;
    blockTime: number;
    isSolTransfer: boolean;
    mint?: string; // 添加币种字段
};

// Solana wallet address
const walletAddress = 'YOUR_SOLANA_WALLET_ADDRESS_HERE'; // Replace with your Solana wallet address




// Function to fetch recent transactions for a given wallet address
export async function fetchRecentTransactions(wallet: string,beforeSigner :string|undefined): Promise<ConfirmedSignatureInfo[]> {
    try {
        const now = DateTime.now();
        const oneMonthAgo = now.minus({ months: 1 });

        // Calculate start and end timestamps
        // const startTime = oneMonthAgo.toMillis();
        // const endTime = now.toMillis();

        // Get transactions for the specified address within the specified time range
        const transactions = await solanaConnection.getConfirmedSignaturesForAddress2(
            new PublicKey(wallet),
            {limit: 30,before:beforeSigner},
            // 'confirmed'
            
        );

        console.log('Transactions for address', wallet, 'in the recent:', transactions);
       return transactions

    } catch (error) {
        console.error('Error fetching recent transactions:', error);
    }
    return []
}


// 一次性获取所有给出txid的交易
export async function getParsedTransactions(signatures: ConfirmedSignatureInfo[]) {
    try {
                    // 获取所有签名
                    const transactionSignatures = signatures.map(signatureInfo => signatureInfo.signature);
                    // 解析所有签名交易
                    const transactions = await solanaConnection.getParsedTransactions(transactionSignatures);

                    // 提取所需信息并返回
                    const historys: (TransferInfo | null)[]=[]
                    const parsedTransactions = transactions.map(transaction => {
            
                        if (!transaction) {
                            console.log('Transaction is not confirmed yet');
                            return;
                        }
                
                        // const transactionsJson = JSON.stringify(transaction);
                        // console.log(transactionsJson)
                        // const result= parseTransaction(transaction)
                        // const resultJson = JSON.stringify(result);
                        // console.log(resultJson)

                        // console.log('-----------------------------------------------------')

                       const result= extractTransferInfo(transaction)
                       historys.push(result)
                       console.log('----------------------------提取结果: -------------------------'+JSON.stringify(result))


            });

            return historys;
      
    } catch (error) {
        console.error("获取交易详情时出错: ", error);
        return [];
    }
}


function extractTransferInfo(transaction: ParsedTransactionWithMeta): TransferInfo | null {
    const { transaction: { message }, meta, blockTime } = transaction;
    
    // 签名
    const signature = transaction.transaction.signatures[0];

    // 找到 transfer 或 transferChecked 指令
    const transferInstruction = message.instructions.find(instruction => {
        if ('parsed' in instruction) {
            return instruction.parsed.type === 'transfer' || instruction.parsed.type === 'transferChecked';
        }
        return false;
    });

    if (!transferInstruction || !('parsed' in transferInstruction)) {
        return null;
    }

    const info = transferInstruction.parsed.info;
    const isSolTransfer = transferInstruction.programId.toBase58() === "11111111111111111111111111111111";

    const sender = isSolTransfer ? info.source : info.authority;
    const receiver = isSolTransfer ? info.destination : info.destination;
    const amount = isSolTransfer ? info.lamports : info.tokenAmount.uiAmount;
    const mint = 'mint' in info ? info.mint : undefined;

    return {
        sender,
        receiver,
        amount,
        signature,
        blockTime: blockTime ?? 0, // 将 blockTime 的可能 undefined 或 null 值设置为 0
        isSolTransfer,
        mint
    };
}





// async function test() {
//     try {
//        const signs= await fetchRecentTransactions('75qj1YKiXGzWaY9YApCWjU9eAcUXV5YgJPGX9LLKKxiE',undefined);
//        const results=await getParsedTransactions(signs);

//     } catch (error) {
//         console.error('Error in main function:', error);
//     }
// }

// test();
