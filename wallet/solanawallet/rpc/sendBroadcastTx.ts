import {
    Connection,
    Transaction,
    clusterApiUrl,
    sendAndConfirmRawTransaction,
    SignatureStatus,
  } from "@solana/web3.js";
  import { Buffer } from 'buffer';
  import {solanaConnection} from "./SolanaConnection"

export async function broadcastTx(signedTransaction:string):Promise<string>{

 // 反序列化交易
 const transactionBuffer = Buffer.from(signedTransaction, 'base64');
 const transaction = Transaction.from(transactionBuffer);


// 广播交易
const txid = await solanaConnection.sendRawTransaction(transaction.serialize());

// 确认交易
const confirmation = await confirmTransaction(txid);

if (confirmation.status.err!=null) {
  throw new Error(`Transaction confirmation failed: ${confirmation.status.err}`);
}

return txid

  }


  export async function confirmTransaction(txid: string): Promise<{ status: SignatureStatus, confirmations: number }> {
    let status = (await solanaConnection.getSignatureStatuses([txid])).value[0];
    let startTime = new Date().getTime();
    const timeout = 30000; // 超时时间，单位为毫秒

    while (!status || !status.confirmations) {
        if (new Date().getTime() - startTime > timeout) {
            throw new Error("Transaction confirmation timed out");
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        status = (await solanaConnection.getSignatureStatuses([txid])).value[0];
    }

    if (status.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
    }

    return { status, confirmations: status.confirmations ?? 0 };
}


//    broadcastTx("AZcgUs2x6S71eJdSGrxbPkqeFdlannC7wSOFs2K8P6mlbt5w1npyRtN/vMjbwDTGtPXPAU3Zo2JDW3U7xDnPfwwBAAED60AiWsGvw18kk7zck4A2WzmerqgSa9KvNyPOVeDkeApQW1H1YrGFZ+lBjoS0siIBmyKIkkhIlgm8Pa8r+Mh6PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvjsnw8tUjCe8uKLmvYGWYheE3+0iDKF550ajMMPcnfwBAgIAAQwCAAAAQKoBAAAAAAA=")
//   .then(v=>{console.log(v)})
//   .catch(e=>{console.log(e)})