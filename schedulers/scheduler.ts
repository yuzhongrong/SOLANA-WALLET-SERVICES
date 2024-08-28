import { CATEGORYS } from './../wallet/solanawallet/rpc/ave_rpc/constants';
// scheduler.ts

import { fetchTrendingTokens } from '../wallet/solanawallet/rpc/ave_rpc/category_hots';
import { fetchTokenDatas } from '../wallet/solanawallet/rpc/jup_rpc/getTokenInfoByJup';


export async function startScheduler() {
    // 定义一个定时器，每隔一段时间执行一次请求方法
    const interval = setInterval(async () => {
        try {
            // 调用你的请求方法
            const tokenData = await fetchTokenDatas('strict');
            // 处理返回的数据
            const tokenAll = await fetchTokenDatas('all');
            // console.log('Token data:', tokenData);
    

        } catch (error) {
            console.error('Error:', error);
        }
    }, 3600000); // 每隔半小时执行一次请求


    //定时请求trending数据间隔30s
    const interval_trending = setInterval(async () => {
        try {
            // 调用你的请求方法
             await fetchTrendingTokens(CATEGORYS.TRENDING);
             
        } catch (error) {
            console.error('Error:', error);
        }
    }, 60000); // 每隔2分钟执行一次请求


    // 当需要停止定时器时，使用 clearInterval
    // clearInterval(interval);
}
