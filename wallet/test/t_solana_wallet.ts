
import {getTokenAccounts} from "../solanawallet/rpc/getTokenList"

import { PublicKey } from "@solana/web3.js";
const wallet="5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY"
const result= getTokenAccounts(wallet)

getTokenAccounts(wallet)
  .then(result=>console.log(result))
  .catch(e=>console.log(e))




// 定义地址
const address = '5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY';

const MY_PROGRAM_ID = new PublicKey(
  "5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY"
);


// 输出程序 ID
console.log('Program ID:', MY_PROGRAM_ID);