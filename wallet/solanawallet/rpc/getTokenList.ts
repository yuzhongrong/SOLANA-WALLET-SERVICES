import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {solanaConnection} from "./SolanaConnection"
import {WalletToken} from "../entitys/WalletToken"
import { formatDecimal } from "../utils/DigitUtils";



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
       
      
        const walletToken = new WalletToken(mintAddress, uitokenBalance, decimals+"",0);
        walletTokens.push(walletToken);
      

        //Log results
        // console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        // console.log(`--Token Mint: ${mintAddress}`);
        // console.log(`--Token Balance: ${tokenBalance}`);
        // console.log(`--Token decimals: ${decimals}`);
    });

 //额外构建个sol加进去 因为这里无法获取到sol的余额 很奇怪
    const result=await newsolToken2Join(wallet,walletTokens)
    return result;
}


async function newsolToken2Join(wallet:string,walletTokens:WalletToken[]):Promise<WalletToken[]> {

    const pubkey = new PublicKey(wallet);
    //for sol balance
    const balance=await solanaConnection.getBalance(pubkey)
    const result=formatDecimal((balance / 1e9))
    const walletToken = new WalletToken("So11111111111111111111111111111111111111112",result,"9",0);
    walletTokens.push(walletToken)
    return walletTokens;
  
}
