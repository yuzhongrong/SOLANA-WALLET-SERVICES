export class DexScreenTokenInfo {
    schemaVersion: string;
    pairs: PairsDTO[];
  
    constructor() {
      this.schemaVersion = '';
      this.pairs = [];
    }
  }
  
  export class PairsDTO {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: BaseTokenDTO;
    quoteToken: QuoteTokenDTO;
    priceNative: string;
    priceUsd: string;
    txns: TxnsDTO;
    volume: VolumeDTO;
    priceChange: PriceChangeDTO;
    liquidity: LiquidityDTO;
    fdv: number;
    pairCreatedAt: number;
    info: InfoDTO;
  
    constructor() {
      this.chainId = '';
      this.dexId = '';
      this.url = '';
      this.pairAddress = '';
      this.baseToken = new BaseTokenDTO();
      this.quoteToken = new QuoteTokenDTO();
      this.priceNative = '';
      this.priceUsd = '';
      this.txns = new TxnsDTO();
      this.volume = new VolumeDTO();
      this.priceChange = new PriceChangeDTO();
      this.liquidity = new LiquidityDTO();
      this.fdv = 0;
      this.pairCreatedAt = 0;
      this.info = new InfoDTO();
    }
  }
  
  export class BaseTokenDTO {
    address: string;
    name: string;
    symbol: string;
  
    constructor() {
      this.address = '';
      this.name = '';
      this.symbol = '';
    }
  }
  
  export class QuoteTokenDTO {
    address: string;
    name: string;
    symbol: string;
  
    constructor() {
      this.address = '';
      this.name = '';
      this.symbol = '';
    }
  }
  
  export class TxnsDTO {
    m5: M5DTO;
    h1: H1DTO;
    h6: H6DTO;
    h24: H24DTO;
  
    constructor() {
      this.m5 = new M5DTO();
      this.h1 = new H1DTO();
      this.h6 = new H6DTO();
      this.h24 = new H24DTO();
    }
  }
  
  export class M5DTO {
    buys: number;
    sells: number;
  
    constructor() {
      this.buys = 0;
      this.sells = 0;
    }
  }
  
  export class H1DTO {
    buys: number;
    sells: number;
  
    constructor() {
      this.buys = 0;
      this.sells = 0;
    }
  }
  
  export class H6DTO {
    buys: number;
    sells: number;
  
    constructor() {
      this.buys = 0;
      this.sells = 0;
    }
  }
  
  export class H24DTO {
    buys: number;
    sells: number;
  
    constructor() {
      this.buys = 0;
      this.sells = 0;
    }
  }
  
  export class VolumeDTO {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  
    constructor() {
      this.h24 = 0;
      this.h6 = 0;
      this.h1 = 0;
      this.m5 = 0;
    }
  }
  
  export class PriceChangeDTO {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  
    constructor() {
      this.m5 = 0;
      this.h1 = 0;
      this.h6 = 0;
      this.h24 = 0;
    }
  }
  
  export class LiquidityDTO {
    usd: number;
    base: number;
    quote: number;
  
    constructor() {
      this.usd = 0;
      this.base = 0;
      this.quote = 0;
    }
  }
  
  export class InfoDTO {
    imageUrl: string;
    websites: WebsitesDTO[];
    socials: SocialsDTO[];
  
    constructor() {
      this.imageUrl = '';
      this.websites = [];
      this.socials = [];
    }
  }
  
  export class WebsitesDTO {
    label: string;
    url: string;
  
    constructor() {
      this.label = '';
      this.url = '';
    }
  }
  
  export class SocialsDTO {
    type: string;
    url: string;
  
    constructor() {
      this.type = '';
      this.url = '';
    }
  }
  