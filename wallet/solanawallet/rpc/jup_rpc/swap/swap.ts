
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

    const swapObj = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse: quote,
          userPublicKey: pubkey58,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
          feeAccount: "C1J8kDdi18WmyNTGrKQkh6Qp4ZYitY9SepwpHmXwhSFr",
          asLegacyTransaction:true
        },
      });

    return swapObj;
  }


export async function flowQuoteAndSwap(quote:QuoteResponse,pubkey58:string) {

  
  // const wallet = new Wallet(Keypair.generate());
    // console.log("Wallet:", wallet.publicKey.toBase58());
    
    const swapObj = await getSwapObj(pubkey58, quote);
    // console.dir(swapObj, { depth: null });
  
    // Serialize the transaction
    const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");

    var transaction = Transaction.from(swapTransactionBuf);
    // Sign the transaction
    // transaction.sign([wallet.payer]);  
    var tx=JSON.stringify(transaction)
    console.log("------transaction------>",tx)
    var lastValidBlockHeight=swapObj.lastValidBlockHeight
    return {tx,lastValidBlockHeight};
   
  }

  export async function sendTx(transation64:string,lastValidBlockHeight:number){


        // 反序列化交易
   const transactionBuffer = Buffer.from(transation64, 'base64');
   const transaction = Transaction.from(transactionBuffer);
 

    const signature = getSignature(transaction);
  
    console.log("-------sign------>",signature)
    console.log("-------swapObj_lastValidBlockHeight------>",lastValidBlockHeight)


    console.log("-------vertransation------>",JSON.stringify(transaction))
 
    // We first simulate whether the transaction would be successful
    try {
      // const { value: simulatedTransactionResponse } =
      // await mAlchemySolanaConnection.simulateTransaction(vertransation, {
      //   replaceRecentBlockhash: true,
      //   commitment: "processed",
      // });


      const { value: simulatedTransactionResponse } =
      await mAlchemySolanaConnection.simulateTransaction(transaction);
      const { err, logs } = simulatedTransactionResponse;
  
    if (err) {
      // Simulation error, we can check the logs for more details
      // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
      console.error("Simulation Error:");
      console.error({ err, logs });
      return;
    }
    } catch (error) {
      console.error({ error });
      return
    }
    
  
    const serializedTransaction = Buffer.from(transaction.serialize());
    const blockhash = transaction.recentBlockhash as string;
  
    const transactionResponse = await transactionSenderAndConfirmationWaiter({
      serializedTransaction,
      blockhashWithExpiryBlockHeight: {
        blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      },
    });
  
    // // If we are not getting a response back, the transaction has not confirmed.
    if (!transactionResponse) {
      console.error("Transaction not confirmed");
      return;
    }
  
    if (transactionResponse?.meta?.err) {
      console.error(transactionResponse?.meta?.err);
    }
  
    console.log(`https://solscan.io/tx/${signature}`);

    
  }
