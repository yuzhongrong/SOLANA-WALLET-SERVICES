export class NewWalletToken {
    private mint: string;
    private balance: string;
    private decimal: string;
    private price: string;
    private symbol: string;
    private imageUrl: string;

    constructor(mint: string, balance: string, decimal: string, price: string, symbol: string, imageUrl: string) {
        this.mint = mint;
        this.balance = balance;
        this.decimal = decimal;
        this.price = price;
        this.symbol = symbol;
        this.imageUrl = imageUrl;
    }

    getMint(): string {
        return this.mint;
    }

    setMint(mint: string): void {
        this.mint = mint;
    }

    getBalance(): string {
        return this.balance;
    }

    setBalance(balance: string): void {
        this.balance = balance;
    }

    getDecimal(): string {
        return this.decimal;
    }

    setDecimal(decimal: string): void {
        this.decimal = decimal;
    }

    getPrice(): string {
        return this.price;
    }

    setPrice(price: string): void {
        this.price = price;
    }

    getSymbol(): string {
        return this.symbol;
    }

    setSymbol(symbol: string): void {
        this.symbol = symbol;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }
}
