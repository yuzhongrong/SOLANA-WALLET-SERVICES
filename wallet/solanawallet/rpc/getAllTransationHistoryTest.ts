import { Connection, PublicKey, ParsedTransactionWithMeta, ConfirmedSignatureInfo } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import {mAlchemySolanaConnection} from "./alchemy_rpc/AlchemySolanaConnection"
import { extractTransferInfo, getTransactionsResults } from './getTransationHistory';





 async function getRecentTransactions(wallet: string,beforeSigner :string|undefined): Promise<ConfirmedSignatureInfo[]> {
    try {
        // const now = DateTime.now();
        // const oneMonthAgo = now.minus({ months: 1 });

        // Calculate start and end timestamps
        // const startTime = oneMonthAgo.toMillis();
        // const endTime = now.toMillis();

        // Get transactions for the specified address within the specified time range
        const transactions = await mAlchemySolanaConnection.getSignaturesForAddress(
            new PublicKey(wallet),
            {limit: 15,before:undefined},
        
        );

        console.log('Transactions for address', wallet, 'in the recent:', transactions);
       return transactions

    } catch (error) {
        console.error('Error fetching recent transactions:', error);
    }
    return []
}




getRecentTransactions("2uhu96aU75jbiMzLoguvHmADY39rb3q84qBwJqyPhpzh","")
    .then(transactions => {
        console.log('Specified SPL Token Transactions for Wallet:', transactions);
    })
    .catch(error => {
        console.error('Error fetching token transactions for wallet:', error);
    });
