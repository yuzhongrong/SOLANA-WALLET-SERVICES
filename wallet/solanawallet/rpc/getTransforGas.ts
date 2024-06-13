import {
    Connection,
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    getMinimumBalanceForRentExemptAccount,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import {mAlchemySolanaConnection} from "./alchemy_rpc/AlchemySolanaConnection"

async function getTransactionFee(transaction:Transaction) {
    const { blockhash } = await mAlchemySolanaConnection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    const message = transaction.compileMessage();
    const fee = await mAlchemySolanaConnection.getFeeForMessage(message);
    return fee.value;
}

//获取spl转账gas费用
export async function simulatorSplGas(from:string,to:string,mint:string,amount:number) {

    // 定义钱包地址和 SPL 代币 Mint 地址
    const fromWallet = new PublicKey(from);
    const toWallet = new PublicKey(to);
    const mintAddress = new PublicKey(mint);
     // 获取关联的 Token 账户地址
     const fromTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        fromWallet,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const toTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        toWallet,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

     // 构建 SPL 代币转账指令
     const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromWallet,
        amount,
        [],
        TOKEN_PROGRAM_ID
    );

     // 创建交易
     const transaction = new Transaction().add(transferInstruction);
     transaction.feePayer = fromWallet;

    // 获取交易费用
    const fee = await getTransactionFee( transaction);
    if (fee !== null) {
        // console.log('估算的交易费用 (lamports):', fee);
        // console.log('估算的交易费用 (SOL):', fee / LAMPORTS_PER_SOL);
        return fee / LAMPORTS_PER_SOL
    } else {
        // console.log('无法估算交易费用');
        return 0
    }
    
}

// simulatorSplGas('2uhu96aU75jbiMzLoguvHmADY39rb3q84qBwJqyPhpzh','ERRXG7XeCDUpPKeCvErws6ogiWh1q2Bf8sFJxToAbQuo','CymqTrLSVZ97v87Z4W3dkF4ipZE1kYyeasmN2VckUL4J',10000).catch(err => {
//     console.error(err);
// });