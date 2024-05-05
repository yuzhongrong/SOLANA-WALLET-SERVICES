import { WalletToken } from '../../entitys/WalletToken';

import { NewWalletToken } from '../../entitys/NewWalletToken';

import axios, { AxiosInstance } from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';
import { DexScreenTokenInfo,PairsDTO } from './entitys/DexScreenTokenInfo';


/**
 * 
 * @param basetokens :the base token info in cellection
 */
const url="https://api.dexscreener.com/latest/dex/tokens/"


const instance = axios.create({
    baseURL: url,
    proxy: {
      host: '127.0.0.1',
      port: 10808,
    },
  });

async function reqfetchTokenInfo(url: string): Promise<DexScreenTokenInfo> {
    try {
      //  const response = await  instance.get("/6HAgBL4ANWQaxKoJQ4zsL41rJuPZxAvBf82qRMqghYou,BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz,FKKL5uZBn811Dc1hKh8fPnWz8tcSuwPHQuPY5fftaCJA,74KBEdkjBndJWVxGJNav1We3SWVivq3f7zBvQEMMdLLT,FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8,8rHca9ETaTGdd3R8ZgzmfzP3aM51Spawtdfv6K9q6HmU,6NspJqVFceCiU5D1YgVq7waYoC394Vhqxwg7cSJdFtVE,8DBQQaX18ZWVx7LGpNiRKQVzuHKzL98Y3ESQJVkZxwNr,D5HcRu139cfYrJdGJtDtkCS8RgG2R2huzRAthqYw4aDx,CymqTrLSVZ97v87Z4W3dkF4ipZE1kYyeasmN2VckUL4J,945Z76yWgr5oEfYJ4kbdPTh1DmeeQyP147ZxTbLmMqRS,AeVpz5noWE8N6uYw8aW6UEduci1khkhn71RDguVNEadD,FUnCB8F6biKmiiKJj6zhDicyFEszJHRpAXj5DFtcVa1m,88BMXN94NPqFnwvWdQ1vavEkQ6f1UhrCmY73GDJBbVvR");
      
      const jsonData={"schemaVersion":"1.0.0","pairs":[{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/g6onryjp2wavdutyfpzsgbbxxmetyqei2aybmzrne7mc","pairAddress":"G6oNRyjP2WAVDUTYFPZsgBBxxMetyQEi2AYbmzRNe7Mc","baseToken":{"address":"FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8","name":"Smog","symbol":"SMOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.0004663","priceUsd":"0.06147","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":12,"sells":8},"h6":{"buys":44,"sells":54},"h24":{"buys":332,"sells":402}},"volume":{"h24":161150.28,"h6":5622.61,"h1":909.49,"m5":0},"priceChange":{"m5":0,"h1":0.21,"h6":1.15,"h24":12.66},"liquidity":{"usd":1656302.24,"base":13455269,"quote":6291.256},"fdv":86059607,"pairCreatedAt":1707321927000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8.png","websites":[{"label":"Website","url":"https://smogtoken.com/en"},{"label":"Docs","url":"https://smogtoken.com/assets/documents/SMOG%20Litepaper.pdf"},{"label":"Zealy","url":"Https://zealy.io/cw/smogtokenairdrop"}],"socials":[{"type":"twitter","url":"https://twitter.com/SMOGToken"},{"type":"telegram","url":"https://t.me/SMOGToken"},{"type":"discord","url":"https://discord.com/invite/WBRBkk9EpV"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/adwqhgvs41xbmsdehbd9ndignky1y2ctgg4ctvcouv1r","pairAddress":"ADwQhgVS41xbMSDeHbd9nDiGnky1y2CtgG4ctVcoUv1R","baseToken":{"address":"BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz","name":"ansom","symbol":"ANSOM"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.000002612","priceUsd":"0.0003432","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":4,"sells":3},"h6":{"buys":39,"sells":18},"h24":{"buys":206,"sells":152}},"volume":{"h24":68774.82,"h6":10566.66,"h1":655.67,"m5":0},"priceChange":{"m5":0,"h1":1.47,"h6":-2.15,"h24":-0.39},"liquidity":{"usd":98709.87,"base":143836746,"quote":375.4844},"fdv":343266,"pairCreatedAt":1712416601000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz.png","websites":[{"label":"Website","url":"https://bento.me/ansom"}],"socials":[{"type":"twitter","url":"https://twitter.com/tickerisansom"},{"type":"telegram","url":"https://t.me/+Zmxthjym3QYxMDg5"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/8gptfz8bkt2z1gmv38vpxarffcxzpcykfkjgukyjnfcr","pairAddress":"8gptfZ8bkT2Z1gMv38VpxarFfCXZPCykFKjGUkYJnfCR","baseToken":{"address":"CymqTrLSVZ97v87Z4W3dkF4ipZE1kYyeasmN2VckUL4J","name":"i dont know","symbol":"IDK"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.000001143","priceUsd":"0.0001509","txns":{"m5":{"buys":2,"sells":0},"h1":{"buys":4,"sells":1},"h6":{"buys":5,"sells":3},"h24":{"buys":10,"sells":9}},"volume":{"h24":3668.28,"h6":1374.59,"h1":101.84,"m5":57.3},"priceChange":{"m5":0.5,"h1":2.69,"h6":-5.12,"h24":5.73},"liquidity":{"usd":123986.88,"base":411020438,"quote":469.09981},"fdv":150988,"pairCreatedAt":1710706066000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/CymqTrLSVZ97v87Z4W3dkF4ipZE1kYyeasmN2VckUL4J.png","websites":[{"label":"Website","url":"https://idk.sucks/"}],"socials":[{"type":"telegram","url":"https://t.me/idkdontbuy"},{"type":"twitter","url":"https://twitter.com/idkdontbuy"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/fnbrxtzsnsqb3qcpfjeamjmkavfawp2orkwxnk4dktdl","pairAddress":"FnBRxTzSNSqb3QCPfJEaMjMKAVFAwP2oRkwXNK4dKtdL","baseToken":{"address":"6NspJqVFceCiU5D1YgVq7waYoC394Vhqxwg7cSJdFtVE","name":"Frogonsol","symbol":"FROG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.0000001204","priceUsd":"0.00001585","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":1},"h6":{"buys":0,"sells":2},"h24":{"buys":1,"sells":4}},"volume":{"h24":93.73,"h6":2.05,"h1":0.14,"m5":0},"priceChange":{"m5":0,"h1":1.35,"h6":-0.3,"h24":5.31},"liquidity":{"usd":1901853.87,"base":59905420325,"quote":7234.9338},"fdv":1093894,"pairCreatedAt":1710979375000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/6NspJqVFceCiU5D1YgVq7waYoC394Vhqxwg7cSJdFtVE.png","websites":[{"label":"Website","url":"https://frogonsol.com/"},{"label":"CMC","url":"https://coinmarketcap.com/currencies/frogonsol/"},{"label":"Magic Eden","url":"https://magiceden.io/marketplace/frog_card"}],"socials":[{"type":"twitter","url":"https://twitter.com/FrogCardsOnSol"},{"type":"telegram","url":"https://t.me/FrogOnSol"}]}},{"chainId":"solana","dexId":"orca","url":"https://dexscreener.com/solana/bwgkefdt6vz8btlung9zbvkbh3rbruem6gar9xcuhwb9","pairAddress":"BwGkEfDT6VZ8BtLung9zBvKBH3RbRUem6GaR9XcUHWb9","labels":["wp"],"baseToken":{"address":"FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8","name":"Smog","symbol":"SMOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.0004759","priceUsd":"0.06368","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":0,"sells":0},"h24":{"buys":7,"sells":13}},"volume":{"h24":234.56,"h6":0,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":0,"h24":9.25},"liquidity":{"usd":9410.49,"base":136135,"quote":5.5386},"fdv":89154051,"pairCreatedAt":1708008734000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8.png","websites":[{"label":"Website","url":"https://smogtoken.com/en"},{"label":"Docs","url":"https://smogtoken.com/assets/documents/SMOG%20Litepaper.pdf"},{"label":"Zealy","url":"Https://zealy.io/cw/smogtokenairdrop"}],"socials":[{"type":"twitter","url":"https://twitter.com/SMOGToken"},{"type":"telegram","url":"https://t.me/SMOGToken"},{"type":"discord","url":"https://discord.com/invite/WBRBkk9EpV"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/4luwv861ekyqsvgyumvxyz7pdn5p85hy6bx9rukd7tth","pairAddress":"4LuWv861ekYqSVgYumVXyz7PdN5P85HY6bx9RUkD7ttH","baseToken":{"address":"6HAgBL4ANWQaxKoJQ4zsL41rJuPZxAvBf82qRMqghYou","name":"Icy the Seal","symbol":"ICY"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00000004128","priceUsd":"0.000005437","txns":{"m5":{"buys":0,"sells":1},"h1":{"buys":0,"sells":1},"h6":{"buys":0,"sells":1},"h24":{"buys":0,"sells":3}},"volume":{"h24":0.63,"h6":0.09,"h1":0.09,"m5":0.09},"priceChange":{"m5":-0.29,"h1":-0.29,"h6":-0.29,"h24":0.58},"liquidity":{"usd":5057.53,"base":464510539,"quote":19.2261},"fdv":5435,"pairCreatedAt":1711584583000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/6HAgBL4ANWQaxKoJQ4zsL41rJuPZxAvBf82qRMqghYou.png","websites":[{"label":"Website","url":"http://icytheseal.com/"}],"socials":[{"type":"twitter","url":"https://twitter.com/IcyTheSealSol"},{"type":"telegram","url":"https://t.me/icytheseal"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/5e2rpycs88pfswk3pm66s9rwvbohi4xqpvwkcrbe89ug","pairAddress":"5E2rpYCS88pfsWk3PM66s9Rwvbohi4xQPVwkcrbE89ug","baseToken":{"address":"88BMXN94NPqFnwvWdQ1vavEkQ6f1UhrCmY73GDJBbVvR","name":"Solana Loot","symbol":"SOLOOT"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00001023","priceUsd":"0.001330","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":0,"sells":0},"h24":{"buys":0,"sells":1}},"volume":{"h24":0,"h6":0,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":0,"h24":0},"liquidity":{"usd":2342.67,"base":879436,"quote":9.02107},"fdv":1320,"pairCreatedAt":1711649143000},{"chainId":"solana","dexId":"orca","url":"https://dexscreener.com/solana/c9jizbmemomtw13phsud9o3sr81hrteemwzqqn6jigec","pairAddress":"C9JizBmeMoMtw13PHsud9o3sR81hRTEeMWZqQn6JigeC","labels":["wp"],"baseToken":{"address":"BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz","name":"ansom","symbol":"ANSOM"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.000002613","priceUsd":"0.0003434","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":1,"sells":0},"h6":{"buys":2,"sells":3},"h24":{"buys":22,"sells":27}},"volume":{"h24":70.47,"h6":10.38,"h1":0.37,"m5":0},"priceChange":{"m5":0,"h1":4.66,"h6":-0.94,"h24":-2.01},"liquidity":{"usd":1064.79,"base":2520885,"quote":1.5151},"fdv":343421,"pairCreatedAt":1712421726000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz.png","websites":[{"label":"Website","url":"https://bento.me/ansom"}],"socials":[{"type":"twitter","url":"https://twitter.com/tickerisansom"},{"type":"telegram","url":"https://t.me/+Zmxthjym3QYxMDg5"}]}},{"chainId":"solana","dexId":"meteora","url":"https://dexscreener.com/solana/ex5k7ehe3hdsd4xhtqk9cevu28ffpcbjsgsysjgwzrs","pairAddress":"EX5K7EHE3Hdsd4XhtQK9cEvU28FfPcBJsGSySjgWzrS","labels":["DYN"],"baseToken":{"address":"BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz","name":"ansom","symbol":"ANSOM"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.000002591","priceUsd":"0.0003356","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":2,"sells":2},"h24":{"buys":13,"sells":20}},"volume":{"h24":221.02,"h6":30.84,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":-3.76,"h24":-0.44},"liquidity":{"usd":998.9,"base":1498411,"quote":3.8297},"fdv":335632,"pairCreatedAt":1712427858000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/BfHkvKMEYjwPXnL36uiM8RnAoMFy8aqNyTJXYU3ZnZtz.png","websites":[{"label":"Website","url":"https://bento.me/ansom"}],"socials":[{"type":"twitter","url":"https://twitter.com/tickerisansom"},{"type":"telegram","url":"https://t.me/+Zmxthjym3QYxMDg5"}]}},{"chainId":"solana","dexId":"meteora","url":"https://dexscreener.com/solana/g6qzwi7rau3bnkc27jev7mqrc2kjnuws8ntglfmyqq43","pairAddress":"G6QZWi7rau3bNkc27jev7mQrc2kJnUWs8nTgLFmYQq43","labels":["DYN"],"baseToken":{"address":"FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8","name":"Smog","symbol":"SMOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.0004719","priceUsd":"0.05812","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":0,"sells":0},"h24":{"buys":1,"sells":1}},"volume":{"h24":2.74,"h6":0,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":0,"h24":-1.42},"liquidity":{"usd":97.36,"base":848.7177,"quote":0.3898},"fdv":81380829,"pairCreatedAt":1709225706000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/FS66v5XYtJAFo14LiPz5HT93EUMAHmYipCfQhLpU4ss8.png","websites":[{"label":"Website","url":"https://smogtoken.com/en"},{"label":"Docs","url":"https://smogtoken.com/assets/documents/SMOG%20Litepaper.pdf"},{"label":"Zealy","url":"Https://zealy.io/cw/smogtokenairdrop"}],"socials":[{"type":"twitter","url":"https://twitter.com/SMOGToken"},{"type":"telegram","url":"https://t.me/SMOGToken"},{"type":"discord","url":"https://discord.com/invite/WBRBkk9EpV"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/aquwbrbkbcbtqt1svfpc8vufha84xwem8dfmsqwfqbgx","pairAddress":"AquwbRbKbcbtQt1svfPC8vuFHA84XWEM8dFmSqwFQbgX","baseToken":{"address":"D5HcRu139cfYrJdGJtDtkCS8RgG2R2huzRAthqYw4aDx","name":"TCAT","symbol":"TCAT"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.0000000004346","priceUsd":"0.00000005638","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":1,"sells":0},"h24":{"buys":1,"sells":0}},"volume":{"h24":0,"h6":0,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":0,"h24":0},"liquidity":{"usd":0,"base":38326,"quote":0.00002161},"fdv":5623,"pairCreatedAt":1711485527000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/D5HcRu139cfYrJdGJtDtkCS8RgG2R2huzRAthqYw4aDx.png","websites":[{"label":"Website","url":"https://www.tinhatcat.com"}],"socials":[{"type":"twitter","url":"https://twitter.com/TinHatCatSol"},{"type":"telegram","url":"https://t.me/TCATSOL"}]}}]}
      
        const dexScreenTokenInfo = parseDexScreenTokenInfo(jsonData);
        return dexScreenTokenInfo;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}


export async function getTokenInfos(basetokens:WalletToken[]):Promise<NewWalletToken[]>{

    // const walletTokens: WalletToken[] = [];

    // 获取所有的mint字段组成的字符串数组
    const mintArray: string[] = basetokens.map(item => item.mint);
    // 将字符串数组连接成以逗号分隔的字符串
    const mintString: string = mintArray.join(',');

    const result=await reqfetchTokenInfo(url+mintString)

    //从这个结果找到匹配的mint 的价格和logourl 还有symbol

    const newWallets= await updateWalletTokens(basetokens,result)
    console.log(newWallets);
    return newWallets;
   



}


function parseDexScreenTokenInfo(data: any): DexScreenTokenInfo {
    const dexScreenTokenInfo = new DexScreenTokenInfo();
    dexScreenTokenInfo.schemaVersion = data.schemaVersion;
    dexScreenTokenInfo.pairs = data.pairs.map((pair: any) => {
        const pairDTO = new PairsDTO();
        pairDTO.chainId = pair.chainId;
        pairDTO.dexId = pair.dexId;
        pairDTO.url = pair.url;
        pairDTO.pairAddress = pair.pairAddress;
        pairDTO.baseToken = pair.baseToken;
        pairDTO.quoteToken = pair.quoteToken;
        pairDTO.priceNative = pair.priceNative;
        pairDTO.priceUsd = pair.priceUsd;
        pairDTO.txns = pair.txns;
        pairDTO.volume = pair.volume;
        pairDTO.priceChange = pair.priceChange;
        pairDTO.liquidity = pair.liquidity;
        pairDTO.fdv = pair.fdv;
        pairDTO.pairCreatedAt = pair.pairCreatedAt;
        pairDTO.info = pair.info;
        return pairDTO;
    });
    return dexScreenTokenInfo;
}

async function updateWalletTokens(basetokens: WalletToken[], dexScreenTokenInfo: DexScreenTokenInfo):Promise<NewWalletToken[]>{

    const newBaseTokens: NewWalletToken[]=[]
    for (const walletToken of basetokens) {
        const mintAddress = walletToken.mint;

        // 遍历 dexScreenTokenInfo 中的 pairs
        for (const pair of dexScreenTokenInfo.pairs) {
            const { baseToken: baseTokenInfo, quoteToken: quoteTokenInfo } = pair;

            // 检查 baseToken.address 是否等于当前 mint 地址
            if (baseTokenInfo.address === mintAddress) {
                // 更新 walletToken 对象的属性
            
                if(pair.info==null){
                    const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.baseToken.symbol,"")
                    newBaseTokens.push(newWalletToken) 
                }else{
                    const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.baseToken.symbol,pair.info.imageUrl)
                    newBaseTokens.push(newWalletToken) 
                }
               
          
                break;
            }

            // 检查 quoteToken.address 是否等于当前 mint 地址
            if (quoteTokenInfo.address === mintAddress) {
                // 更新 walletToken 对象的属性
              
            if(pair.info==null){
                const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.quoteToken.symbol,"")
                newBaseTokens.push(newWalletToken) 
            }else{
                const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.quoteToken.symbol,pair.info.imageUrl)
                newBaseTokens.push(newWalletToken) 
            }
                break;
            }
        }

       
    }
    return newBaseTokens;


}
