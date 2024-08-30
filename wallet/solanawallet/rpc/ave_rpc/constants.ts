
 import { retrieveEnvVariable } from '../../../../utils';
import { reloadEnv } from './category_hots';
 import { logger } from './logger';
 const url="https://febweb002.com"

 const BASE_URL: string = "https://febweb002.com";

 const CATEGORYS_URL = {
     TRENDING: `/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=hot&refresh_total=0`,
     NEW: `/v1api/v4/tokens/treasure/list?chain=solana&sort=created_at&sort_dir=desc&tvl_min=10000&pageNO=1&pageSize=30&category=new`,
     GAINER: `/v1api/v4/tokens/treasure/list?chain=solana&sort=price_change_24h&sort_dir=desc&pageNO=1&pageSize=30&category=gainer`,
     INCLUSION: `/v1api/v4/tokens/treasure/list?chain=solana&sort=target_listing_at&sort_dir=desc&pageNO=1&pageSize=30&category=inclusion`,
     GOLDENDOG: `/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=goldendog&refresh_total=0`,
     ALPHA: `/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=alpha`,
     PUMP_IN_HOT: `/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=pump_in_hot`,
     PUMP_OUT_HOT: `/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=pump_out_hot`,
     PUMP_IN_ALMOST: `/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=pump_in_almost`,
 };

 

export enum CATEGORYS{
    TRENDING='hot',
    NEW='new',
    GAINER='gainer',
    INCLUSION='inclusion',
    GOLDENDOG='goldendog',
    ALPHA='alpha',
    PUMP_IN_HOT='pump_in_hot',//有问题
    PUMP_OUT_HOT='pump_out_hot',
    PUMP_IN_ALMOST='pump_in_almost'//有问题

}


export async function matchCategory(category:string):Promise<string>{
    await reloadEnv()
    const AVE_DOMAIN = retrieveEnvVariable('AVE_DOMAIN', logger);
    if(category===CATEGORYS.TRENDING){
        
     return AVE_DOMAIN+CATEGORYS_URL.TRENDING;
    }else if(category===CATEGORYS.NEW){
        return AVE_DOMAIN+CATEGORYS_URL.NEW;
    }
    else if(category===CATEGORYS.GAINER){
        return AVE_DOMAIN+CATEGORYS_URL.GAINER;
    }
    else if(category===CATEGORYS.INCLUSION){
        return AVE_DOMAIN+CATEGORYS_URL.INCLUSION
    }
    else if(category===CATEGORYS.GOLDENDOG){
        return AVE_DOMAIN+CATEGORYS_URL.GOLDENDOG
    }
    else if(category===CATEGORYS.ALPHA){
        return AVE_DOMAIN+CATEGORYS_URL.ALPHA
    }
    else if(category===CATEGORYS.PUMP_IN_HOT){
        return AVE_DOMAIN+CATEGORYS_URL.PUMP_IN_HOT
    }
    else if(category===CATEGORYS.PUMP_OUT_HOT){
        return AVE_DOMAIN+CATEGORYS_URL.PUMP_OUT_HOT
    }
    else if(category===CATEGORYS.PUMP_IN_ALMOST){
        return AVE_DOMAIN+CATEGORYS_URL.PUMP_IN_ALMOST
    }

   return ""
}


