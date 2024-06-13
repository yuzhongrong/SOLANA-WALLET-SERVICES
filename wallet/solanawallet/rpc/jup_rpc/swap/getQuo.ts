import { createJupiterApiClient, QuoteGetRequest } from '@jup-ag/api';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
(global as any).fetch = fetch;

const jupiterQuoteApi = createJupiterApiClient();


export async function getQuote(from:string,to:string,amount:number,fromdecimal:number) {
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
      inputMint: from,
      outputMint: to, // $WIF
      amount: amount * Math.pow(10, fromdecimal), // 0.1 SOL=100000000
      autoSlippage: true,
      autoSlippageCollisionUsdValue: 1_000,
      maxAutoSlippageBps: 1000, // 10%
      minimizeSlippage: true,
      onlyDirectRoutes: false,
      asLegacyTransaction: false,
      platformFeeBps: 10,
      
    };
  
    // get quote
  const quote = await jupiterQuoteApi.quoteGet(params);

  
    if (!quote) {
      throw new Error("unable to quote");
    }
    return quote;
  }


  // getQuote('EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm','So11111111111111111111111111111111111111112',1.5,6)
  // .then(it => console.log(JSON.stringify(it)))
  // .catch(e => console.log(e))