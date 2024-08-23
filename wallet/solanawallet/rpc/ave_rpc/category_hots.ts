import { InfoDTO, PairsDTO } from './../dexscreen_rpc/entitys/DexScreenTokenInfo';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { logger } from './logger';
import { retrieveEnvVariable } from '../../../../utils';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { CheckToken, ContractData } from './CheckTokenEntirys';
import { RedisManager } from '../../../../redis/RedisManager';
import { getDexScreenPairs } from '../dexscreen_rpc/getPairsByPairsAddress';
(global as any).fetch = fetch;




interface CategoryPair {
    pair: string;
    chain: string;
    amm: string;
    target_token: string;
    token0_address: string;
    token0_symbol: string;
    reserve0: number;
    token0_logo_url: string;
    token1_address: string;
    token1_symbol: string;
    reserve1: number;
    token1_logo_url: string;
    init_reserve0: number;
    init_reserve1: number;
    tvl: number;
    init_tvl: number;
    tvl_ratio: number;
    current_price_usd: number;
    lp_holders: number;
    lp_locked_percent: number;
    lp_locked_to: string;
    lp_lock_platform: string;
    price_change_1m: number;
    price_change_5m: number;
    price_change_15m: number;
    price_change_30m: number;
    price_change_1h: number;
    price_change_4h: number;
    price_change_24h: number;
    tx_1m_count: number;
    tx_5m_count: number;
    tx_15m_count: number;
    tx_30m_count: number;
    tx_1h_count: number;
    tx_4h_count: number;
    tx_24h_count: number;
    buys_tx_1m_count: number;
    buys_tx_5m_count: number;
    buys_tx_15m_count: number;
    buys_tx_30m_count: number;
    buys_tx_1h_count: number;
    buys_tx_4h_count: number;
    buys_tx_24h_count: number;
    sells_tx_1m_count: number;
    sells_tx_5m_count: number;
    sells_tx_15m_count: number;
    sells_tx_30m_count: number;
    sells_tx_1h_count: number;
    sells_tx_4h_count: number;
    sells_tx_24h_count: number;
    volume_u_1m: number;
    volume_u_5m: number;
    volume_u_15m: number;
    volume_u_30m: number;
    volume_u_1h: number;
    volume_u_4h: number;
    volume_u_24h: number;
    buy_volume_u_1m: number;
    buy_volume_u_5m: number;
    buy_volume_u_15m: number;
    buy_volume_u_30m: number;
    buy_volume_u_1h: number;
    buy_volume_u_4h: number;
    buy_volume_u_24h: number;
    sell_volume_u_1m: number;
    sell_volume_u_5m: number;
    sell_volume_u_15m: number;
    sell_volume_u_30m: number;
    sell_volume_u_1h: number;
    sell_volume_u_4h: number;
    sell_volume_u_24h: number;
    makers_1m: number;
    makers_5m: number;
    makers_15m: number;
    makers_30m: number;
    makers_1h: number;
    makers_4h: number;
    makers_24h: number;
    buyers_1m: number;
    buyers_5m: number;
    buyers_15m: number;
    buyers_30m: number;
    buyers_1h: number;
    buyers_4h: number;
    buyers_24h: number;
    sellers_1m: number;
    sellers_5m: number;
    sellers_15m: number;
    sellers_30m: number;
    sellers_1h: number;
    sellers_4h: number;
    sellers_24h: number;
    created_at: string;
    sniper_tx_count: number;
    rusher_tx_count: number;
    last_trade_at: string;
    dynamic_tag: string;
    tag: string;
    market_cap: number;
    market_cap_diff: number;
    holders: number;
    holders_diff: number;
    risk_score: number;
    risk_level: number;
    appendix: string;
    smart_money_buy_count_24h: number;
    smart_money_sell_count_24h: number;
    holders_top10_ratio: number;
    dev_balance_ratio_cur: number;
    insider_balance_ratio_cur: number;
    sniper_balance_ratio_cur: number;
    reply_count: number;
    progress: number;
    first_half_elapsed_time: number;
    second_half_elapsed_time: number;
    winner_count: number;
    winner_ratio: number;
    up_count_7d: number;
    up_count_14d: number;
    up_seq: string;
    bigorder_cnt_1h: number;
    bigorder_buy_cnt_1h: number;
    bigorder_sell_cnt_1h: number;
    has_broken_issue_price: boolean;
    listing_at: number;
  }


export async function fetchTrendingTokens() {
    const url = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=hot&refresh_total=0`;

    await reloadEnv();
    const X_AUTH = retrieveEnvVariable('X_AUTH', logger);

    // console.log(X_AUTH)
    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://ave.ai/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "x-auth": X_AUTH
    };







    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
  
        
        // const simulatejson =[{"pair":"8La7iq385eBn87UXnSCvZR4AogZxGprSJpdEUW9V1oQt","chain":"solana","amm":"raydium","target_token":"BqjCQoP5opAcqdgjJ8ezU57vWBExovUZHbXpumhnFDtU","token0_address":"BqjCQoP5opAcqdgjJ8ezU57vWBExovUZHbXpumhnFDtU","token0_symbol":"SOOMER","reserve0":7645246.738103137,"token0_logo_url":"","token1_address":"So11111111111111111111111111111111111111112","token1_symbol":"SOL","reserve1":429.175711169,"token1_logo_url":"token_icon/solana/So11111111111111111111111111111111111111112.png","init_reserve0":122708632.43243243,"init_reserve1":25,"tvl":121293.0154839126,"init_tvl":7065.463650862925,"tvl_ratio":1616.702844676,"current_price_usd":0.007916721487092484,"lp_holders":2,"lp_locked_percent":1,"lp_locked_to":"0001-01-01T00:00:00Z","lp_lock_platform":"Blackhole/黑洞地址","price_change_1m":-3.51,"price_change_5m":-1.76,"price_change_15m":-2.67,"price_change_30m":-13.74,"price_change_1h":-27.59,"price_change_4h":45625.1,"price_change_24h":45625.1,"tx_1m_count":53,"tx_5m_count":306,"tx_15m_count":1236,"tx_30m_count":2271,"tx_1h_count":4337,"tx_4h_count":12441,"tx_24h_count":12441,"buys_tx_1m_count":27,"buys_tx_5m_count":193,"buys_tx_15m_count":803,"buys_tx_30m_count":1457,"buys_tx_1h_count":2797,"buys_tx_4h_count":8354,"buys_tx_24h_count":8354,"sells_tx_1m_count":26,"sells_tx_5m_count":113,"sells_tx_15m_count":433,"sells_tx_30m_count":814,"sells_tx_1h_count":1540,"sells_tx_4h_count":4087,"sells_tx_24h_count":4087,"volume_u_1m":5289.898943,"volume_u_5m":38588.786222,"volume_u_15m":160760.15454,"volume_u_30m":307991.338989,"volume_u_1h":620324.827325,"volume_u_4h":1548909.602515,"volume_u_24h":1548909.602515,"buy_volume_u_1m":2074.403744,"buy_volume_u_5m":18784.914228,"buy_volume_u_15m":80128.923322,"buy_volume_u_30m":151716.811875,"buy_volume_u_1h":305050.097683,"buy_volume_u_4h":802008.912981,"buy_volume_u_24h":802008.91298,"sell_volume_u_1m":3215.495198,"sell_volume_u_5m":19803.871994,"sell_volume_u_15m":80631.231218,"sell_volume_u_30m":156274.527114,"sell_volume_u_1h":315274.729642,"sell_volume_u_4h":727399.820972,"sell_volume_u_24h":727399.820972,"makers_1m":53,"makers_5m":292,"makers_15m":584,"makers_30m":599,"makers_1h":704,"makers_4h":2559,"makers_24h":2559,"buyers_1m":27,"buyers_5m":190,"buyers_15m":563,"buyers_30m":581,"buyers_1h":663,"buyers_4h":2457,"buyers_24h":2457,"sellers_1m":26,"sellers_5m":110,"sellers_15m":400,"sellers_30m":524,"sellers_1h":605,"sellers_4h":952,"sellers_24h":952,"created_at":"2024-08-21T09:23:08Z","sniper_tx_count":4,"rusher_tx_count":116,"last_trade_at":"2024-08-21T12:09:22Z","dynamic_tag":"[\"dynamic-alpha\"]","tag":"","market_cap":7960276.321846283,"market_cap_diff":0,"holders":1997,"holders_diff":0,"risk_score":40,"risk_level":0,"appendix":"","smart_money_buy_count_24h":0,"smart_money_sell_count_24h":0,"holders_top10_ratio":12.137856124647927,"dev_balance_ratio_cur":0,"insider_balance_ratio_cur":0,"sniper_balance_ratio_cur":0,"reply_count":0,"progress":0,"first_half_elapsed_time":0,"second_half_elapsed_time":0,"winner_count":0,"winner_ratio":0,"up_count_7d":0,"up_count_14d":0,"up_seq":"","bigorder_cnt_1h":0,"bigorder_buy_cnt_1h":0,"bigorder_sell_cnt_1h":0,"has_broken_issue_price":false,"listing_at":0},{"pair":"Cmh27DWA3bmkFVG8iQ6BFf21iGmEcKDwa7srZDQ4QAvL","chain":"solana","amm":"raydium","target_token":"2Vnei1LAmrBpbL8fNCiCpaYcQTCSodiE51wab6qaQJAq","token0_address":"2Vnei1LAmrBpbL8fNCiCpaYcQTCSodiE51wab6qaQJAq","token0_symbol":"PGN","reserve0":13356001.785208384,"token0_logo_url":"token_icon_solana/solana/2Vnei1LAmrBpbL8fNCiCpaYcQTCSodiE51wab6qaQJAq.png","token1_address":"So11111111111111111111111111111111111111112","token1_symbol":"SOL","reserve1":2733.909291933,"token1_logo_url":"token_icon/solana/So11111111111111111111111111111111111111112.png","init_reserve0":678359320.1482893,"init_reserve1":22.13,"tvl":772653.4690763603,"init_tvl":6254.3484237438615,"tvl_ratio":12253.860334084953,"current_price_usd":0.028584160460254884,"lp_holders":15,"lp_locked_percent":0.005212571018689819,"lp_locked_to":"0001-01-01T00:00:00Z","lp_lock_platform":"","price_change_1m":1.85,"price_change_5m":4.03,"price_change_15m":3.65,"price_change_30m":8.03,"price_change_1h":5.97,"price_change_4h":1.91,"price_change_24h":-2.19,"tx_1m_count":13,"tx_5m_count":49,"tx_15m_count":146,"tx_30m_count":291,"tx_1h_count":597,"tx_4h_count":2212,"tx_24h_count":12899,"buys_tx_1m_count":8,"buys_tx_5m_count":25,"buys_tx_15m_count":74,"buys_tx_30m_count":145,"buys_tx_1h_count":297,"buys_tx_4h_count":1058,"buys_tx_24h_count":6231,"sells_tx_1m_count":5,"sells_tx_5m_count":24,"sells_tx_15m_count":72,"sells_tx_30m_count":146,"sells_tx_1h_count":300,"sells_tx_4h_count":1154,"sells_tx_24h_count":6668,"volume_u_1m":9646.33532,"volume_u_5m":29217.987758,"volume_u_15m":80779.694112,"volume_u_30m":143636.92353016147,"volume_u_1h":289677.713554,"volume_u_4h":1021094.004551,"volume_u_24h":5884212.368364,"buy_volume_u_1m":7565.027261,"buy_volume_u_5m":19305.902412,"buy_volume_u_15m":47198.532224,"buy_volume_u_30m":78262.36617788368,"buy_volume_u_1h":151692.16349,"buy_volume_u_4h":514774.927712,"buy_volume_u_24h":2944494.67646,"sell_volume_u_1m":2081.308059,"sell_volume_u_5m":9912.08534630433,"sell_volume_u_15m":33581.16188774792,"sell_volume_u_30m":65374.55735227777,"sell_volume_u_1h":137985.550064,"sell_volume_u_4h":496406.9914928587,"sell_volume_u_24h":2929805.6065578246,"makers_1m":10,"makers_5m":22,"makers_15m":26,"makers_30m":28,"makers_1h":42,"makers_4h":62,"makers_24h":149,"buyers_1m":6,"buyers_5m":16,"buyers_15m":22,"buyers_30m":22,"buyers_1h":32,"buyers_4h":48,"buyers_24h":98,"sellers_1m":4,"sellers_5m":16,"sellers_15m":19,"sellers_30m":21,"sellers_1h":31,"sellers_4h":51,"sellers_24h":115,"created_at":"2024-08-06T16:50:07Z","sniper_tx_count":4,"rusher_tx_count":69,"last_trade_at":"2024-08-21T12:09:06Z","dynamic_tag":"[]","tag":"","market_cap":28584154.840421006,"market_cap_diff":0,"holders":2277,"holders_diff":0,"risk_score":55,"risk_level":1,"appendix":"","smart_money_buy_count_24h":0,"smart_money_sell_count_24h":1,"holders_top10_ratio":5.390406055797408,"dev_balance_ratio_cur":0.4561952152148513,"insider_balance_ratio_cur":10.877795681520439,"sniper_balance_ratio_cur":0.8093488075447897,"reply_count":0,"progress":0,"first_half_elapsed_time":0,"second_half_elapsed_time":0,"winner_count":0,"winner_ratio":0,"up_count_7d":0,"up_count_14d":0,"up_seq":"","bigorder_cnt_1h":0,"bigorder_buy_cnt_1h":0,"bigorder_sell_cnt_1h":0,"has_broken_issue_price":false,"listing_at":0},{"pair":"D6NdKrKNQPmRZCCnG1GqXtF7MMoHB7qR6GU5TkG59Qz1","chain":"solana","amm":"orca","target_token":"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm","token0_address":"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm","token0_symbol":"WIF","reserve0":696836.737812,"token0_logo_url":"token_icon_solana/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm.png","token1_address":"So11111111111111111111111111111111111111112","token1_symbol":"SOL","reserve1":5164.117572098,"token1_logo_url":"token_icon/solana/So11111111111111111111111111111111111111112.png","init_reserve0":4.812253,"init_reserve1":0.076162533,"tvl":1459475.3997776369,"init_tvl":21.52494433876592,"tvl_ratio":6780291.051460959,"current_price_usd":1.5243997670938294,"lp_holders":0,"lp_locked_percent":0,"lp_locked_to":"0001-01-01T00:00:00Z","lp_lock_platform":"","price_change_1m":-0.12,"price_change_5m":-0.28,"price_change_15m":-0.46,"price_change_30m":-0.67,"price_change_1h":-0.9,"price_change_4h":-1.41,"price_change_24h":-4.16,"tx_1m_count":8,"tx_5m_count":42,"tx_15m_count":205,"tx_30m_count":326,"tx_1h_count":542,"tx_4h_count":2460,"tx_24h_count":23822,"buys_tx_1m_count":0,"buys_tx_5m_count":2,"buys_tx_15m_count":113,"buys_tx_30m_count":158,"buys_tx_1h_count":247,"buys_tx_4h_count":1201,"buys_tx_24h_count":11967,"sells_tx_1m_count":8,"sells_tx_5m_count":40,"sells_tx_15m_count":92,"sells_tx_30m_count":168,"sells_tx_1h_count":295,"sells_tx_4h_count":1259,"sells_tx_24h_count":11856,"volume_u_1m":2069.070905,"volume_u_5m":12838.444787,"volume_u_15m":106093.247932,"volume_u_30m":159870.167033,"volume_u_1h":254819.144865,"volume_u_4h":1194195.105934,"volume_u_24h":15157716.457298,"buy_volume_u_1m":0,"buy_volume_u_5m":104.1026447488389,"buy_volume_u_15m":47045.49376555877,"buy_volume_u_30m":66457.98197185688,"buy_volume_u_1h":113154.094402,"buy_volume_u_4h":571439.1167072724,"buy_volume_u_24h":7546561.667100442,"sell_volume_u_1m":2069.070905,"sell_volume_u_5m":12734.342142,"sell_volume_u_15m":59047.754167,"sell_volume_u_30m":93412.185061,"sell_volume_u_1h":141665.050462,"sell_volume_u_4h":610113.111071,"sell_volume_u_24h":7598511.912041,"makers_1m":4,"makers_5m":17,"makers_15m":51,"makers_30m":74,"makers_1h":124,"makers_4h":393,"makers_24h":2414,"buyers_1m":0,"buyers_5m":2,"buyers_15m":35,"buyers_30m":46,"buyers_1h":60,"buyers_4h":286,"buyers_24h":1587,"sellers_1m":4,"sellers_5m":15,"sellers_15m":27,"sellers_30m":45,"sellers_1h":89,"sellers_4h":327,"sellers_24h":1611,"created_at":"2024-05-25T04:28:27Z","sniper_tx_count":1,"rusher_tx_count":1,"last_trade_at":"2024-08-21T12:09:15Z","dynamic_tag":"[\"dynamic-hard_dump\",\"signal-smarter_buy-green-0-1724205373\"]","tag":"","market_cap":1522639974.107225,"market_cap_diff":0,"holders":176957,"holders_diff":0,"risk_score":40,"risk_level":1,"appendix":"","smart_money_buy_count_24h":3,"smart_money_sell_count_24h":0,"holders_top10_ratio":40.65486311471091,"dev_balance_ratio_cur":0.005858801903537007,"insider_balance_ratio_cur":0,"sniper_balance_ratio_cur":0.03395024570826942,"reply_count":0,"progress":0,"first_half_elapsed_time":0,"second_half_elapsed_time":0,"winner_count":0,"winner_ratio":0,"up_count_7d":0,"up_count_14d":0,"up_seq":"","bigorder_cnt_1h":0,"bigorder_buy_cnt_1h":0,"bigorder_sell_cnt_1h":0,"has_broken_issue_price":false,"listing_at":0}];
        // const realjson = JSON.parse(JSON.stringify(data['data']))

     //这个json中的图片是ipfs的 我不想搭建ipfs 提高维护费,所以去请求dexscreen拿图片吧

    //第一步:获取json中的pairs放到一个字符串数组中去

       
        const pairsArray:CategoryPair[]=data['data']['data'] as CategoryPair[]
        console.log(pairsArray)
        const pairsStrEach = pairsArray.map((item: { pair: string }) => item.pair).join(",");

        console.log(pairsStrEach)

        console.log('---------------------------------------------------')

        //第二步:请求dexscreen拿数据
        // const testJson={"schemaVersion":"1.0.0","pairs":[{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/ar6ocemerwmm3ojpkpl1b3zqgbeow9arqaawkamdnwwt","pairAddress":"AR6ocEMeRwMM3oJPKpL1B3zqGbEoW9ArQaawKAmdNwwT","baseToken":{"address":"TrnnxPQvYkMtakCYGToFHs1uYMqumpWeE93W9fFpump","name":"symmetry","symbol":"sym"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.000004873","priceUsd":"0.0007094","txns":{"m5":{"buys":166,"sells":105},"h1":{"buys":1994,"sells":1715},"h6":{"buys":215025,"sells":13551},"h24":{"buys":248862,"sells":15110}},"volume":{"h24":5636909.86,"h6":5188028.59,"h1":536959.95,"m5":36029.97},"priceChange":{"m5":-20.24,"h1":57.67,"h6":726,"h24":1075},"liquidity":{"usd":98992.13,"base":69721458,"quote":340.171},"fdv":709489,"pairCreatedAt":1724367939000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/TrnnxPQvYkMtakCYGToFHs1uYMqumpWeE93W9fFpump.png","websites":[{"label":"Website","url":"https://symdog.xyz"}],"socials":[{"type":"twitter","url":"https://x.com/symmetrydog"},{"type":"telegram","url":"https://t.me/symmetrydog"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/rsgk14nkcavqwpisnhdrt6qn3he9wujndcmzi9tbjsf","pairAddress":"rsgk14nKcavQwPiSNhDRt6qn3hE9WUjNDCmZi9TbjSF","baseToken":{"address":"EGMAb9cZawkqdnATSMqAxwevuwTLcE6JcVJjAcSppump","name":"asymmetry","symbol":"asym"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00000005143","priceUsd":"0.000007488","txns":{"m5":{"buys":3,"sells":1},"h1":{"buys":61,"sells":40},"h6":{"buys":14272,"sells":14255},"h24":{"buys":14272,"sells":14255}},"volume":{"h24":6222863.32,"h6":6222863.32,"h1":4180.71,"m5":111.27},"priceChange":{"m5":-1.69,"h1":21.29,"h6":-88.29,"h24":-88.29},"liquidity":{"usd":10047.01,"base":676190377,"quote":34.2276},"fdv":7489,"pairCreatedAt":1724383008000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/EGMAb9cZawkqdnATSMqAxwevuwTLcE6JcVJjAcSppump.png","websites":[],"socials":[{"type":"telegram","url":"https://t.me/ASYM_CTO"}]}}],"pair":null}
        const dexscreenPairs = (await getDexScreenPairs(pairsStrEach))['pairs'] 
        // const dexscreenPairs:PairsDTO[]=testJson['pairs'] as PairsDTO[]
        
        console.log(JSON.stringify(dexscreenPairs))
        const key_value_pairs=dexscreenPairs.map(item => ({pairAddress: item.pairAddress,imageUrl:item.info.imageUrl}) )
        // console.log(results.length)
        console.log(key_value_pairs)


        // 更新 CategoryPair[] 数组中的 token0_logo_url
            const categoryPairs = pairsArray.map(item => {
                const keyValue = key_value_pairs.find(kv => kv.pairAddress === item.pair);
                if (keyValue) {
                    item.token0_logo_url = keyValue.imageUrl;
                }
                return item;
            });
            console.log("----最终结果--->"+JSON.stringify(dexscreenPairs))
           
       
        
        //第三步写到redis中去
        // RedisManager.getInstance().set("hot",result)

        // return result;
    } catch (error) {
        console.error('Fetch error: ', error);
    }
}


// 手动重新加载 .env 文件
async function reloadEnv() {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
  // console.log('Environment variables reloaded:', process.env);
}


// // 使用示例
// fetchTrendingTokens();

