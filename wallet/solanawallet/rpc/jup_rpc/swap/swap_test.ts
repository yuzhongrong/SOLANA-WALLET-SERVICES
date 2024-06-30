
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

import fetch, { RequestInfo, RequestInit } from 'node-fetch';
(global as any).fetch = fetch;

const jupiterQuoteApi = createJupiterApiClient();

async function getQuote() {
    // basic params
    // const params: QuoteGetRequest = {
    //   inputMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    //   outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    //   amount: 35281,
    //   slippageBps: 50,
    //   onlyDirectRoutes: false,
    //   asLegacyTransaction: false,
    // }
  

    const params: QuoteGetRequest = {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // $WIF
        amount: 100000000, // 0.1 SOL=100000000
        autoSlippage: true,
        autoSlippageCollisionUsdValue: 1_000,
        maxAutoSlippageBps: 1000, // 10%
        minimizeSlippage: true,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
        platformFeeBps: 40,
        
      };
  
    // get quote
    const quote = await jupiterQuoteApi.quoteGet(params);
  
    if (!quote) {
      throw new Error("unable to quote");
    }
    return quote;
  }

async function getSwapObj(wallet: Wallet, quote: QuoteResponse) {
  // Get serialized transaction
  const swapObj = await jupiterQuoteApi.swapPost({
    swapRequest: {
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: "auto",
      feeAccount:"C1J8kDdi18WmyNTGrKQkh6Qp4ZYitY9SepwpHmXwhSFr",
      asLegacyTransaction:true
    },
  });
  return swapObj;
}

async function flowQuote() {
  const quote = await getQuote();
  console.dir(quote, { depth: null });
}

async function flowQuoteAndSwap() {
  const wallet = new Wallet(
    Keypair.generate()
  );
  console.log("Wallet:", wallet.publicKey.toBase58());

  const quote = await getQuote();
  console.dir(quote, { depth: null });
  const swapObj = await getSwapObj(wallet, quote);
  console.dir(swapObj, { depth: null });
 

//   // Serialize the transaction
  const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.log("-------transaction----->",JSON.stringify(transaction))
  
  // Sign the transaction
  transaction.sign([wallet.payer]);
  const signature = getSignature(transaction);


  // We first simulate whether the transaction would be successful
  const { value: simulatedTransactionResponse } =
    await mAlchemySolanaConnection.simulateTransaction(transaction, {
      replaceRecentBlockhash: true,
      commitment: "processed",
    });
  const { err, logs } = simulatedTransactionResponse;

  if (err) {
    // Simulation error, we can check the logs for more details
    // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
    console.error("Simulation Error:");
    console.error({ err, logs });
    return;
  }

  const serializedTransaction = Buffer.from(transaction.serialize());
  const blockhash = transaction.message.recentBlockhash;

  const transactionResponse = await transactionSenderAndConfirmationWaiter({
    serializedTransaction,
    blockhashWithExpiryBlockHeight: {
      blockhash,
      lastValidBlockHeight: swapObj.lastValidBlockHeight,
    },
  });

  // If we are not getting a response back, the transaction has not confirmed.
  if (!transactionResponse) {
    console.error("Transaction not confirmed");
    return;
  }

  if (transactionResponse.meta?.err) {
    console.error(transactionResponse.meta?.err);
  }

  console.log(`https://solscan.io/tx/${signature}`);
}



flowQuoteAndSwap();