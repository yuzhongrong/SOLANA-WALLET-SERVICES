import { solanaConnection } from './wallet/solanawallet/rpc/SolanaConnection';
import { Transaction } from '@solana/web3.js';
import express, { Request, Response, NextFunction } from 'express'
import { startScheduler } from './schedulers/scheduler';
import {walletServices} from './wallet/solanawallet/services/WalletServices'
import { confirmTransaction } from './wallet/solanawallet/rpc/sendBroadcastTx';
import bodyParser from 'body-parser';
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
  // 使用 body-parser 中间件来解析 JSON 请求体
  app.use(bodyParser.json());


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


    //获取钱包sol余额
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


    //获取热门代币-严格模式
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


    //获取自定义代币信息
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

  groupRouter_wallet.get('/updateWalletBalance', async (req, res) => {


    try {
      const address = req.query.wallet;
      if ((typeof address === 'string' && (address.trim().length ==44))){
        const result= await walletServices.getTokenAccountsforjup(address);
        res.locals.response.data = result;
         // 处理结果并发送响应
         res.status(200).json(res.locals.response);
      }
   
    } catch (error) {
      // 处理错误并发送响应
      res.status(500).json({ error: "Internal Server Error" });
  }
  

})

//获取账号租金
groupRouter_wallet.get('/getRentForAccount', async (req, res) => {


  try {
    const address = req.query.wallet;
    if ((typeof address === 'string' && (address.trim().length ==44))){
      const result= await walletServices.getAccountRent(address);
      res.locals.response.data = result;
       // 处理结果并发送响应
       res.status(200).json(res.locals.response);
    }
 
  } catch (error) {
    // 处理错误并发送响应
    res.status(500).json({ error: "Internal Server Error" });
}


})






//获取交易预估手续费
groupRouter_wallet.get('/getEstimatedFee', async (req, res) => {
  try {
    const fromAddress = req.query.from;
    const toAddress = req.query.to;
    const amount = req.query.amount;

    // 检查 fromAddress 和 toAddress 是否为有效的字符串，并且长度为 44
    if (
      typeof fromAddress === 'string' && fromAddress.length === 44 &&
      typeof toAddress === 'string'&& toAddress.length === 44
    ) {
      // // 检查 amount 是否为有效的数字字符串
      const amountNumber = Number(amount);
      if (isNaN(amountNumber)) {
        return res.status(400).json({ error: "Amount must be a valid number" });
      }

      // 调用服务获取估计费用
      const result = await walletServices.getEstimatedFeeGas(fromAddress, toAddress, amountNumber);
      res.locals.response.data=result
      // 处理结果并发送响应
      res.status(200).json(res.locals.response);
    } else {
      return res.status(400).json({ error: "Invalid from or to address" });
    }
  } catch (error) {
    // 处理错误并发送响应
    console.error('Error getting estimated fee:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//获取solana最新区块信息
groupRouter_wallet.get('/getLatestBlockhash', async (req, res) => {


  try {
   
      const result= await walletServices.getLatestBlockhash();
      res.locals.response.data = result;
       // 处理结果并发送响应
       res.status(200).json(res.locals.response);
 
  } catch (error) {
    // 处理错误并发送响应
    res.status(500).json({ error: "Internal Server Error" });
}


})







groupRouter_wallet.post('/broadcast', async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // 反序列化交易
    const transactionBuffer = Buffer.from(signedTransaction, 'base64');
    const transaction = Transaction.from(transactionBuffer);

    // 广播交易
    const txid = await solanaConnection.sendRawTransaction(transaction.serialize());
    const committime: number = Date.now();
    const status="Pending"
    res.locals.response.data = { txid, committime,status};
    // 确认交易
    // const confirmation = await confirmTransaction(txid);
    res.status(200).json(res.locals.response);
  } catch (error) {
    console.error('Failed to broadcast transaction:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//获取交易历史
groupRouter_wallet.get('/getTransations', async (req, res) => {

  try {
    const wallet = req.query.wallet;
    let beforeSigner = req.query.before;
    if( typeof wallet === 'string' && wallet.length === 44&&typeof beforeSigner==='number'){

        const result= await walletServices.getTransationHistorys(wallet,beforeSigner===0?null:beforeSigner);
        res.locals.response.data = result;
        // 处理结果并发送响应
        res.status(200).json(res.locals.response);

    }else{
      return res.status(400).json({ error: "Invalid from or to address" });
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
