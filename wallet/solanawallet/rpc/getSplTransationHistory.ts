import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import {mAlchemySolanaConnection} from "./alchemy_rpc/AlchemySolanaConnection"
import { extractTransferInfo, getTransactionsResults } from './getTransationHistory';

// 输入你的SPL代币Mint地址和钱包地址
// const tokenMintAddress = '6NspJqVFceCiU5D1YgVq7waYoC394Vhqxwg7cSJdFtVE';
// const walletAddress = '2uhu96aU75jbiMzLoguvHmADY39rb3q84qBwJqyPhpzh';
// const tokenMintPublicKey = new PublicKey(tokenMintAddress);
// const walletPublicKey = new PublicKey(walletAddress);

async function getTokenAccounts(walletPublicKey: PublicKey, tokenMintPublicKey: PublicKey,beforeSigner :string|undefined) {
    const tokenAccounts = await mAlchemySolanaConnection.getParsedTokenAccountsByOwner(walletPublicKey, {
        programId: TOKEN_PROGRAM_ID,
    });

    return tokenAccounts.value.filter(tokenAccount => 
        tokenAccount.account.data.parsed.info.mint === tokenMintPublicKey.toString()
    );
}

async function getTokenTransactions(tokenAccountPublicKey: PublicKey,beforeSigner :string|undefined) {
    const transactionSignatures = await mAlchemySolanaConnection.getConfirmedSignaturesForAddress2(
        tokenAccountPublicKey, 
        { limit: 15 ,before:beforeSigner} // 可以根据需要调整获取的交易记录数
    );

    const transactions: (ParsedTransactionWithMeta | null)[] = await Promise.all(transactionSignatures.map(async (signatureInfo) => {
        const transaction = await mAlchemySolanaConnection.getParsedTransaction(signatureInfo.signature);
        return transaction;
    }));

    return transactions;
}

export async function getWalletSplTokenTransactions(wallet: string, mint: string,before:string|undefined) {
    
    const mTokenMintPublicKey = new PublicKey(mint);
    const mWalletPublicKey = new PublicKey(wallet);
    const tokenAccounts = await getTokenAccounts(mWalletPublicKey, mTokenMintPublicKey,before);
    const allTokenTransactions: ParsedTransactionWithMeta[] = [];

    //get transations
    for (let tokenAccountInfo of tokenAccounts) {
        const tokenAccountPublicKey = tokenAccountInfo.pubkey;
        const transactions = await getTokenTransactions(tokenAccountPublicKey,before);
        allTokenTransactions.push(...transactions.filter(tx => tx !== null) as ParsedTransactionWithMeta[]);
    }

     allTokenTransactions.filter(transaction => {
        if (transaction && transaction.meta && transaction.meta.postTokenBalances) {
            return transaction.meta.postTokenBalances.some(balance => 
                balance.mint === mTokenMintPublicKey.toString()
            );
        }
        return false;
    });

    const parsedTransactions = await Promise.all(allTokenTransactions.map(async transaction => {
        if (!transaction) {
            console.log('Transaction is not confirmed yet');
            return null;
        }
        
        // console.log('---------------------------- Extracting useful information... ----------------------------',JSON.stringify(transaction));
        const result = await extractTransferInfo(transaction);
        // console.log('---------------------------- Extraction result: ----------------------------', JSON.stringify(result));
       
        return result;
    }));

    const WrapResult= await getTransactionsResults(parsedTransactions)

    return WrapResult


}

// getWalletSplTokenTransactions("2uhu96aU75jbiMzLoguvHmADY39rb3q84qBwJqyPhpzh", "6NspJqVFceCiU5D1YgVq7waYoC394Vhqxwg7cSJdFtVE","522kxczZjY89u1DpDm8A56gqUyVAdwS8KgpoSndMtTwzD9yPJwjFQHuR3GVWkdqCFmpZ2KFNGvULVeRewM7hZ3sd")
//     .then(transactions => {
//         console.log('Specified SPL Token Transactions for Wallet:', transactions);
//     })
//     .catch(error => {
//         console.error('Error fetching token transactions for wallet:', error);
//     });
