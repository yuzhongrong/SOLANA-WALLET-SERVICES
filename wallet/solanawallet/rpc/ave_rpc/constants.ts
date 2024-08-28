
 enum CATEGORYS_URL {
    //热门
    TRENDING = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=hot&refresh_total=0`,
    //新开盘
    NEW = 'https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&sort=created_at&sort_dir=desc&tvl_min=10000&pageNO=1&pageSize=30&category=new',
    //涨幅榜
    GAINER = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&sort=price_change_24h&sort_dir=desc&pageNO=1&pageSize=30&category=gainer`,
    //新收录
    INCLUSION = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&sort=target_listing_at&sort_dir=desc&pageNO=1&pageSize=30&category=inclusion`,
   
    //金狗
    GOLDENDOG = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=goldendog&refresh_total=0`,
    //潜力狗
    ALPHA = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=alpha`,
   
    //PUMP热内盘
    PUMP_IN_HOT='https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=pump_in_hot',
    //pump热外盘
    PUMP_OUT_HOT = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=pump_out_hot`,
    //pump即将满盘
    PUMP_IN_ALMOST = `https://api.fgsasd.org/v1api/v4/tokens/treasure/list?chain=solana&pageNO=1&pageSize=30&category=pump_in_almost`,
}

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


export function matchCategory(category:string):string{
    
    if(category===CATEGORYS.TRENDING){
     return CATEGORYS_URL.TRENDING;
    }else if(category===CATEGORYS.NEW){
        return CATEGORYS_URL.NEW;
    }
    else if(category===CATEGORYS.GAINER){
        return CATEGORYS_URL.GAINER;
    }
    else if(category===CATEGORYS.INCLUSION){
        return CATEGORYS_URL.INCLUSION
    }
    else if(category===CATEGORYS.GOLDENDOG){
        return CATEGORYS_URL.GOLDENDOG
    }
    else if(category===CATEGORYS.ALPHA){
        return CATEGORYS_URL.ALPHA
    }
    else if(category===CATEGORYS.PUMP_IN_HOT){
        return CATEGORYS_URL.PUMP_IN_HOT
    }
    else if(category===CATEGORYS.PUMP_OUT_HOT){
        return CATEGORYS_URL.PUMP_OUT_HOT
    }
    else if(category===CATEGORYS.PUMP_IN_ALMOST){
        return CATEGORYS_URL.PUMP_IN_ALMOST
    }

   return ""
}


