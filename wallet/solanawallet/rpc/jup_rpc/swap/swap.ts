
import { Wallet } from "@project-serum/anchor";
import {
    QuoteGetRequest,
    QuoteResponse,
    SwapResponse,
    createJupiterApiClient,
    
    
  } from '@jup-ag/api';

  import bs58 from "bs58";

  import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

import {mAlchemySolanaConnection} from "../../alchemy_rpc/AlchemySolanaConnection"
import { getSignature } from "./utils/getSignature";
import { transactionSenderAndConfirmationWaiter } from "./utils/transactionSender";
import e from "express";
import { err } from "pino-std-serializers";
import base58 from "bs58";
import { subscribeTx } from "../../websockets/TransationSubscribe";
import { RedisManager } from "../../../../../redis/RedisManager";

// Define the referral account public key (obtained from the referral dashboard)
const referralAccountPublicKey = new PublicKey("6rCVS7MqKDiVqEz2PTYbaRtSWRwJ9ikf4d8JqjK23bjW");



const jupiterQuoteApi = createJupiterApiClient();


async function getSwapObj(pubkey58: string, quote: QuoteResponse) {
    // Get serialized transaction
    // const swapObj = await jupiterQuoteApi.swapPost({
    //   swapRequest: {
    //     quoteResponse: quote,
    //     userPublicKey: wallet.publicKey.toBase58(),
    //     dynamicComputeUnitLimit: true,
    //     prioritizationFeeLamports: "auto",
    //   },
    // });


    /**
     *            "userPublicKey": "526zG2jaj8UeRXgsAxEuz3hxAcR47ovA1i87CssAivfR",
           "quoteResponse":{"inputMint":"So11111111111111111111111111111111111111112","inAmount":"10000000000","outputMint":"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm","outAmount":"756688408","otherAmountThreshold":"755931720","swapMode":"ExactIn","slippageBps":10,"computedAutoSlippage":3,"platformFee":{"amount":"3038909","feeBps":40},"priceImpactPct":"0.0003571553682361746771202933","routePlan":[{"swapInfo":{"ammKey":"4E6q7eJE6vBNdquqzYYi5gvzd5MNpwiQKhjbRTRQGuQd","label":"Whirlpool","inputMint":"So11111111111111111111111111111111111111112","outputMint":"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm","inAmount":"3000000000","outAmount":"227906608","feeAmount":"150","feeMint":"So11111111111111111111111111111111111111112"},"percent":30},{"swapInfo":{"ammKey":"D6NdKrKNQPmRZCCnG1GqXtF7MMoHB7qR6GU5TkG59Qz1","label":"Whirlpool","inputMint":"So11111111111111111111111111111111111111112","outputMint":"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm","inAmount":"7000000000","outAmount":"531820709","feeAmount":"280","feeMint":"So11111111111111111111111111111111111111112"},"percent":70}],"contextSlot":273443356,"timeTaken":0.082420253},
           "wrapAndUnwrapSol": true,
           "useSharedAccounts": true,
           "feeAccount": "C1J8kDdi18WmyNTGrKQkh6Qp4ZYitY9SepwpHmXwhSFr",
           "computeUnitPriceMicroLamports": 100,
           "asLegacyTransaction": false,
           "useTokenLedger": false,
           "destinationTokenAccount": "526zG2jaj8UeRXgsAxEuz3hxAcR47ovA1i87CssAivfR"
     */

    const mfeeAccount=await getJupiterFeeAccount(quote.outputMint)       
    console.log("------mfeeAccount------>",mfeeAccount[0].toBase58())
    const swapObj = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse: quote,
          userPublicKey: pubkey58,
          dynamicComputeUnitLimit: true,
          // prioritizationFeeLamports: "auto",
          prioritizationFeeLamports: {autoMultiplier: 3 },//增加交易手续费为原来自动计算的2倍,更快的打包上链
          feeAccount: mfeeAccount[0].toBase58(),
          asLegacyTransaction:false
        },
      });

    return swapObj;
  }

async function getJupiterFeeAccount(tokenMint:string){

      // Define the fee token account (use the correct mint according to your swap's input or output mint)
  const feeTokenAccount = await PublicKey.findProgramAddressSync(
    [Buffer.from("referral_ata"), referralAccountPublicKey.toBuffer(), new PublicKey(tokenMint).toBuffer()],
    new PublicKey("REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3")
  );

  return feeTokenAccount;


}



export async function flowQuoteAndSwap(quote:QuoteResponse,pubkey58:string) {

  
  // const wallet = new Wallet(Keypair.generate());
    // console.log("Wallet:", wallet.publicKey.toBase58());
    
    const swapObj = await getSwapObj(pubkey58, quote);
    // console.dir(swapObj, { depth: null });
  
    // Serialize the transaction
    const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    var msgserialize=base58.encode(transaction.message.serialize())
    var lastValidBlockHeight=swapObj.lastValidBlockHeight
    var swap64=swapObj.swapTransaction
    return {swap64,msgserialize,lastValidBlockHeight}
    // Sign the transaction
    // transaction.sign([wallet.payer]);  
    // var tx=JSON.stringify(transaction)
    // console.log("------transaction------>",tx)
    // var lastValidBlockHeight=swapObj.lastValidBlockHeight
    // return {tx,lastValidBlockHeight};
   
  }

  export async function sendTx(transation64:string,lastValidBlockHeight:number,pubkey58:string,signature58:string){

  
   try {

            console.log("-------transation64------>",transation64)
            // 反序列化交易
        const transactionBuffer = Buffer.from(transation64, 'base64');

        const transaction = VersionedTransaction.deserialize(transactionBuffer)

            transaction.addSignature(new PublicKey(pubkey58),base58.decode(signature58))

            const mSignature = getSignature(transaction);
            
            if(!mSignature){
              return
            }
            console.log("-------mSignature------>",mSignature)
            RedisManager.getInstance().set(mSignature,'processed')  

            //  console.log("-------swapObj_lastValidBlockHeight------>",lastValidBlockHeight)


            //   console.log("-------sign_vertransation------>",JSON.stringify(transaction))


        // We first simulate whether the transaction would be successful
        const { value: simulatedTransactionResponse } =
        await mAlchemySolanaConnection.simulateTransaction(transaction);
        const { err, logs } = simulatedTransactionResponse;


        if (err) {
        // Simulation error, we can check the logs for more details
        // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
        console.error("Simulation Error:");
        console.error({ err, logs });
        throw err
        }

      
        const serializedTransaction = Buffer.from(transaction.serialize());

        const blockhash = transaction.message.recentBlockhash;
    
        const transactionResponse = await transactionSenderAndConfirmationWaiter({
          serializedTransaction,
          blockhashWithExpiryBlockHeight: {
            blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
          },
        });
      
        // If we are not getting a response back, the transaction has not confirmed.
        if (!transactionResponse) {
          // console.error("Transaction not confirmed: "+mSignature);
          RedisManager.getInstance().set(mSignature,'fail')
          throw new Error("Transaction not confirmed: "+mSignature)
         
        
        }
      
        if (transactionResponse.meta?.err) {
          console.error(transactionResponse.meta?.err);
          throw transactionResponse.meta?.err
        }

   } catch (error) {
    console.error(error);
    RedisManager.getInstance().set(signature58,'fail')
    return
   }

  console.log(`https://solscan.io/tx/${signature58}`);

  RedisManager.getInstance().set(signature58,'confirmed')
    
  }

