import { getQuote } from "../rpc/jup_rpc/swap/getQuo";

class JupSwapServices {

    private static instance: JupSwapServices;

    private constructor() {
        // 私有构造函数，防止外部实例化
    }

    // 获取单例实例
    public static getInstance(): JupSwapServices {
        if (!JupSwapServices.instance) {
            JupSwapServices.instance = new JupSwapServices();
        }
        return JupSwapServices.instance;
    }


    //get quo for jupiter
    public async getQuote(from:string,to:string,amount:number,fromdecimal:number){
  
        return await getQuote(from,to,amount,fromdecimal)
    }



}


// 导出连接对象单例
export const mJupSwapServices = JupSwapServices.getInstance();