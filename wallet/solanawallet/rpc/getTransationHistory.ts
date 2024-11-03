import { solanaConnection } from './SolanaConnection';
import {  ConfirmedSignatureInfo, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import {mAlchemySolanaConnection} from "./alchemy_rpc/AlchemySolanaConnection"
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
        // const now = DateTime.now();
        // const oneMonthAgo = now.minus({ months: 1 });

        // Calculate start and end timestamps
        // const startTime = oneMonthAgo.toMillis();
        // const endTime = now.toMillis();

        // Get transactions for the specified address within the specified time range
        const transactions = await mAlchemySolanaConnection.getConfirmedSignaturesForAddress2(
            new PublicKey(wallet),
            {limit: 15,before:beforeSigner},
        
        );

        console.log('Transactions for address', wallet, 'in the recent:', transactions);
       return transactions

    } catch (error) {
        console.error('Error fetching recent transactions:', error);
    }
    return []
}



// Function to fetch recent transactions for a given wallet address
export async function fetchRecentTransactions1(wallet: string,untilSigner :string|undefined): Promise<ConfirmedSignatureInfo[]> {
    try {
        // const now = DateTime.now();
        // const oneMonthAgo = now.minus({ months: 1 });

        // Calculate start and end timestamps
        // const startTime = oneMonthAgo.toMillis();
        // const endTime = now.toMillis();

        // Get transactions for the specified address within the specified time range
        const transactions = await mAlchemySolanaConnection.getConfirmedSignaturesForAddress2(
            new PublicKey(wallet),
            {limit: 15,until:untilSigner},
        
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
                    console.log("测试solanaConnection.getParsedTransactions 耗时 开始")
                    const transactions = await mAlchemySolanaConnection.getParsedTransactions(
                        transactionSignatures,
                        {commitment:'finalized',maxSupportedTransactionVersion:0}
                        );


                        
                    console.log("测试solanaConnection.getParsedTransactions 耗时 结束")
                    const parsedTransactions = await Promise.all(transactions.map(async transaction => {
                        if (!transaction) {
                            console.log('Transaction is not confirmed yet');
                            return null;
                        }
                        
                        // console.log('---------------------------- Extracting useful information... ----------------------------',JSON.stringify(transaction));
                        const result = await extractTransferInfo(transaction);
                        // console.log('---------------------------- Extraction result: ----------------------------', JSON.stringify(result));
                        return result;
                    }));

                    return parsedTransactions

    } catch (error) {
        console.error("获取交易详情时出错: ", error);
        return [];
    }
}



export async function getTransactionsResults(historys: (TransferInfo | null)[]) {

    const validTransferInfos: TransferInfo[] = historys.filter(isNotNull);
    // console.log("return the result-validTransferInfos "+validTransferInfos.length)
    const allTokens= JupDataAll2Strict.getInstance().getAllData() || []
    // console.log("return the result-allTokens "+allTokens.length)
    const tokenData = enrichTransferInfos(validTransferInfos,allTokens) //从allTokens这里拿symbol,logoURI;
    // console.log("return the result-tokenData  "+tokenData.length)
    return tokenData;
    // return validTransferInfos

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
            // console.log("start find "+info.mint)
            const tokenData = allTokens.find(item => item.address === info.mint);
            if (tokenData) {
                return {
                    ...info,
                    symbol: tokenData.symbol,
                    logoURI: tokenData.logoURI,
                };
            }
        }
        console.log("-----------------构造完善的数据------->"+JSON.stringify(info))
        return info;
    });
}




export async function extractTransferInfo(transaction: ParsedTransactionWithMeta): Promise<TransferInfo | null> {
    const { transaction: { message }, meta, blockTime } = transaction;   
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
    let receiver = isSolTransfer ? info.destination : info.destination;

    // 查找账户的所有者
    if (!isSolTransfer && meta?.innerInstructions) {
        meta.innerInstructions.forEach(inner => {
            inner.instructions.forEach(i => {
                if ('parsed' in i && 
                    (i.parsed.type === 'initializeAccount' ||
                    i.parsed.type === 'initializeAccount2' ||
                    i.parsed.type === 'initializeAccount3') &&
                    i.parsed.info.account === receiver) {
                    receiver = i.parsed.info.owner;
                }
            });
        });
    }

    const amount = isSolTransfer ? info.lamports : info.tokenAmount.uiAmount;
    // const amount = info.tokenAmount.lamports;
    console.log("--info--->",JSON.stringify(info, null, 2));
 
    const mint = 'mint' in info ? info.mint : "";

    let symbol = '';
    let logoURI = '';

    let decimals = 0;
    if (isSolTransfer) {
        decimals = 9;
    } else {
        decimals = 'tokenAmount' in info ? info.tokenAmount.decimals : 0;
    }

    return {
        sender,
        receiver,
        amount,
        signature,
        blockTime: blockTime ?? 0,
        isSolTransfer,
        mint,
        decimals,
        symbol,
        logoURI,
    };
}




// async function test() {
//     try {
//        const signs= await fetchRecentTransactions('5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY',undefined);
//        const results=await getParsedTransactions(signs);

//     } catch (error) {
//         console.error('Error in main function:', error);
//     }
// }

// test();
