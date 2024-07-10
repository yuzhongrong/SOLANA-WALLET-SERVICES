import { Connection, PublicKey, SignatureResult } from "@solana/web3.js";
import { solanaConnection } from "../SolanaConnection";

export async function subscribeTx(txId:string) {

  solanaConnection.onSignature(
    txId,
    (updatedTxInfo: SignatureResult, context: any) => {
      console.log("Updated SignatureResult subscribe : ", updatedTxInfo);
    }
  );
  
}
