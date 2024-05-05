/**
 * 这里存放着所有solana钱包需要的entitys类
 */

export class WalletToken {
     mint: string;
     balance: string;
     decimal:string;



    constructor(mint: string, balance: string,decimal: string) {
        this.mint = mint;
        this.balance = balance;
        this.decimal = decimal;
    
    }


}


