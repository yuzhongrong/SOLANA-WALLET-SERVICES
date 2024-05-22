import {  ConfirmedSignatureInfo, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import {solanaConnection} from "./SolanaConnection"
import { DateTime } from 'luxon';
import { JupDataAll2Strict } from './jup_rpc/entitys/JupDataAll2Strict';
import { TokenData1 } from './jup_rpc/getTokenInfoByJup';

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
    decimals:number,
    symbol:string
    logoURI:string
};

// Solana wallet address
const solContract = 'So11111111111111111111111111111111111111112'; // SOL CONTRACT




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
                    const parsedTransactions = transactions.map(async transaction => {
            
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

                       const result= await extractTransferInfo(transaction)
                       historys.push(result)
                       console.log('----------------------------提取结果: -------------------------'+JSON.stringify(result))


            });

//    const validTransferInfos: TransferInfo[] = historys.filter(isNotNull);
//    const allTokens= JupDataAll2Strict.getInstance().getAllData() || []
//    const tokenData = enrichTransferInfos(validTransferInfos,allTokens) //从allTokens这里拿symbol,logoURI;
//   return tokenData;
return historys;
      
    } catch (error) {
        console.error("获取交易详情时出错: ", error);
        return [];
    }
}



export async function getTransactionsResults(historys: (TransferInfo | null)[]) {

    const validTransferInfos: TransferInfo[] = historys.filter(isNotNull);
    const allTokens= JupDataAll2Strict.getInstance().getAllData() || []
    const tokenData = enrichTransferInfos(validTransferInfos,allTokens) //从allTokens这里拿symbol,logoURI;
   return tokenData;

}

// 类型守卫，过滤掉 null 值
function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}


//在全局集合allTokens中找到对应的transferInfos 
function enrichTransferInfos(
    transferInfos: TransferInfo[],
    allTokens: TokenData1[]
): TransferInfo[] {
    return transferInfos.map(info => {
        if (info.mint) {
            const tokenData = allTokens.find(item => item.address === info.mint);
            if (tokenData) {
                return {
                    ...info,
                    symbol: tokenData.symbol,
                    logoURI: tokenData.logoURI,
                };
            }
        }
        return info;
    });
}


async function extractTransferInfo(transaction: ParsedTransactionWithMeta): Promise<TransferInfo | null> {
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
    const mint = 'mint' in info ? info.mint : "";

    let symbol='';
    let logoURI='';

    //处理精度问题
    let decimals=0  
    if(isSolTransfer){
         decimals =9;
        
    }else{
         decimals = 'tokenAmount' in info ? info.tokenAmount.decimals : undefined;
    }

 

    
    return {
        sender,
        receiver,
        amount,
        signature,
        blockTime: blockTime ?? 0, // 将 blockTime 的可能 undefined 或 null 值设置为 0
        isSolTransfer,
        mint,
        decimals,
        symbol,
        logoURI,
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
