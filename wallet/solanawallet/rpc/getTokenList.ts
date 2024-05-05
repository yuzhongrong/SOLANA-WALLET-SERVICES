import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {solanaConnection} from "./SolanaConnection"
import {WalletToken} from "../entitys/WalletToken"

const rpcEndpoint = 'https://sleek-purple-darkness.solana-mainnet.quiknode.pro/39c7e391a14030cdbf8c2bffcafaebed460dd85c/';

// const walletToQuery = '5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY'; //example: vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
 export async function getTokenAccounts(wallet: string) : Promise<WalletToken[]>{
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
        }];
    const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    );
    console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
    const walletTokens: WalletToken[] = [];
    accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["amount"];
        
        if(tokenBalance<=0){
          return;
        }
        const uitokenBalance: string = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

        const decimals:number =parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];
       
      
        const walletToken = new WalletToken(mintAddress, uitokenBalance, decimals+"");
        walletTokens.push(walletToken);
      

        //Log results
        // console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        // console.log(`--Token Mint: ${mintAddress}`);
        // console.log(`--Token Balance: ${tokenBalance}`);
        // console.log(`--Token decimals: ${decimals}`);
    });
    return walletTokens;
}
