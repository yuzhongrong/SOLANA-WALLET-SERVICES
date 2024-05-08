import express, { Request, Response, NextFunction } from 'express'
import { startScheduler } from './schedulers/scheduler';
import {walletServices} from './wallet/solanawallet/services/WalletServices'
const app = express();
const port = 3000;


// 定义公共的响应体
const commonResponse = (req: Request, res: Response, next: NextFunction) => {
    // 设置公共的响应头
    res.setHeader('Content-Type', 'application/json');
    
    // 设置公共的响应数据
    res.locals.response = {
      success: true,
      message: 'Success',
      data: null
    };
  
    next();
  };
  
  // 使用公共的响应体中间件
  app.use(commonResponse);


//测试服务是否正常启动
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  

// 路由组定义
const groupRouter_wallet = express.Router();
app.use('/api/wallet', groupRouter_wallet);

    groupRouter_wallet.get('/getTokenList', async (req, res) => {
        //base58 out  length is 44
        const wallet = req.query.wallet;
        if (typeof wallet === 'string' && wallet.trim() !== ''&&wallet.trim().length==44){

            try {
        
                console.log(wallet)
               const result = 
               await walletServices.getTokenAccounts(wallet);
                res.locals.response.data = result;
                // 处理结果并发送响应
                res.status(200).json(res.locals.response);
            } catch (error) {
                // 处理错误并发送响应
                res.status(500).json({ error: "Internal Server Error" });
            }

        }else{
            // 处理无效的请求参数
           res.status(400).json({ error: "Invalid wallet parameter" });
           
        }

     
     
        
    });


    groupRouter_wallet.get('/getWalletSolBalance', async (req, res) => {

      const params1 = req.query.wallet;
      const params2=req.query.mint;
      if ((typeof params1 === 'string' && params1.trim() !== ''&&params1.trim().length==44)&&(typeof params2 === 'string' && params2.trim() !== ''&&params2.trim().length>0)){
        try {
          const result = 
          await walletServices.getWalletSolBalance(params1,params2);
           res.locals.response.data = result;
            // 处理结果并发送响应
            res.status(200).json(res.locals.response);
        } catch (error) {
          // 处理错误并发送响应
          res.status(500).json({ error: "Internal Server Error" });
      }
      

      }

    })


    groupRouter_wallet.get('/getDefaultStrict', async (req, res) => {


        try {
          const model = req.query.model;
          if ((typeof model === 'string' && (model.trim() == 'strict'||model.trim() == 'all'))){
            const result= await walletServices.getDefaultStrictCoins(model);
            res.locals.response.data = result;
             // 处理结果并发送响应
             res.status(200).json(res.locals.response);
          }
       
        } catch (error) {
          // 处理错误并发送响应
          res.status(500).json({ error: "Internal Server Error" });
      }
      

    })


    groupRouter_wallet.get('/getCusCoinInfo', async (req, res) => {


      try {
        const contract = req.query.contract;
        if ((typeof contract === 'string' && (contract.trim().length ==44))){
          const result= await walletServices.getCustomCoin(contract);
          res.locals.response.data = result;
           // 处理结果并发送响应
           res.status(200).json(res.locals.response);
        }
     
      } catch (error) {
        // 处理错误并发送响应
        res.status(500).json({ error: "Internal Server Error" });
    }
    

  })
  



// 启动定时任务
startScheduler();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
