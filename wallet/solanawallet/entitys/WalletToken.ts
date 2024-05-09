/**
 * 这里存放着所有solana钱包需要的entitys类
 */

export class WalletToken {
     mint: string;
     balance: string;
     decimal:string;
     price:number;



    constructor(mint: string, balance: string,decimal: string,price:number) {
        this.mint = mint;
        this.balance = balance;
        this.decimal = decimal;
        this.price=price
    
    }


}


