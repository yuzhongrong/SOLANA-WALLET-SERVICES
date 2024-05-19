import {  PublicKey } from '@solana/web3.js';
import {solanaConnection} from "./SolanaConnection"
import { DateTime } from 'luxon';



// Solana wallet address
const walletAddress = 'YOUR_SOLANA_WALLET_ADDRESS_HERE'; // Replace with your Solana wallet address




// Function to fetch recent transactions for a given wallet address
async function fetchRecentTransactions(wallet: string): Promise<void> {
    try {
        const now = DateTime.now();
        const oneMonthAgo = now.minus({ months: 1 });

        // Calculate start and end timestamps
        const startTime = oneMonthAgo.toMillis();
        const endTime = now.toMillis();

        // Get transactions for the specified address within the specified time range
        const transactions = await solanaConnection.getConfirmedSignaturesForAddress2(
            new PublicKey(wallet),
            {
                before: startTime.toString(),
                until: endTime.toString(),
            }
        );

        console.log('Transactions for address', wallet, 'in the last month:', transactions);
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
    }
}


// Main function
async function test() {
    try {
        await fetchRecentTransactions('GqKXiX2Ta1ypQMvexsq25ifENg6NYHBMaLcYeJndymm3');
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

test();
