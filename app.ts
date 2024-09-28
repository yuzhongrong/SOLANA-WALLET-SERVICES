import { RedisManager } from './redis/RedisManager';
import { solanaConnection } from './wallet/solanawallet/rpc/SolanaConnection';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import express, { Request, Response, NextFunction } from 'express'
import { startScheduler } from './schedulers/scheduler';
import {walletServices} from './wallet/solanawallet/services/WalletServices'
import { confirmTransaction } from './wallet/solanawallet/rpc/sendBroadcastTx';
import bodyParser from 'body-parser';
import { mJupSwapServices } from './wallet/solanawallet/services/JupSwapServices';
import { QuoteJson } from './wallet/solanawallet/rpc/jup_rpc/swap/getQuoUsd';
import { QuoteResponse } from '@jup-ag/api';
import { getPresaleByWallet, getSwapStateByTxId, initializeDatabase } from './database/init';
import { mAlchemySolanaConnection } from './wallet/solanawallet/rpc/alchemy_rpc/AlchemySolanaConnection';
const app = express();
const cors = require('cors');
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
  
  app.use(cors());  // 允许所有来源访问


//测试服务是否正常启动
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  

// 路由组定义
const groupRouter_wallet = express.Router();
const groupRouter_swap = express.Router();
app.use('/api/wallet', groupRouter_wallet);
app.use('/api/swap', groupRouter_swap);




    //根据contract查询token信息包括pool的信息
    groupRouter_wallet.get('/getDexScreenTokenInfo', async (req, res) => {

      try {
        const contract = req.query.contract;
        if ((typeof contract === 'string')){
          const result= await walletServices.getDexScreenTokenInfo(contract);
          res.locals.response.data = result;
           // 处理结果并发送响应
           res.status(200).json(res.locals.response);
        }else{
          return res.status(400).json({ error: "Invalid params" });
        }
     
      } catch (error) {
        // 处理错误并发送响应
        res.status(500).json({ error: "Internal Server Error" });
    }
    

  })

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
          const result= await walletServices.getCustomCoin1(contract);
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
    
    console.log("------transaction------>",JSON.stringify(transaction))
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
    if( typeof wallet === 'string' && wallet.length === 44&&typeof beforeSigner==='string'){

        const result= await walletServices.getTransationHistorys(wallet,beforeSigner===""?null:beforeSigner);
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


groupRouter_wallet.get('/getTransationsForSol', async (req, res) => {

  try {
    const wallet = req.query.wallet;
    let beforeSigner = req.query.before;
    if( typeof wallet === 'string' && wallet.length === 44&&typeof beforeSigner==='string'){

        const result= await walletServices.getTransationHistorys(wallet,beforeSigner===""?null:beforeSigner);
      
          // 过滤出 isSolTransfer 为 true 且 amount 大于 1000000000 的交易
        const filteredTransactions = result.filter(transaction => 
          transaction.isSolTransfer === true&& transaction.amount >= 1000000000
        );
         
        res.locals.response.data = filteredTransactions;
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






//获取交易历史
groupRouter_wallet.get('/getSplTransations', async (req, res) => {

  try {
    const wallet = req.query.wallet;
    const mint=req.query.mint;
    let beforeSigner = req.query.before;
    if( typeof wallet === 'string' && wallet.length === 44&&typeof mint==='string'&&mint.length===44&&typeof beforeSigner==='string'){

        const result= await walletServices.getSplTransationHistorys(wallet,mint,beforeSigner===""?null:beforeSigner);
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

//获取SOL交易历史
groupRouter_wallet.get('/getSolTransations', async (req, res) => {

  try {
    const wallet = req.query.wallet;
    let beforeSigner = req.query.before;
    if( typeof wallet === 'string' && wallet.length === 44&&typeof beforeSigner==='string'){

        const result= await walletServices.getSolTransationHistorys(wallet,beforeSigner===""?null:beforeSigner);
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




//获取SOL交易历史
groupRouter_wallet.get('/getSplEstimatedFee', async (req, res) => {

  try {
    const from = req.query.from;
    const to = req.query.to;
    const mint = req.query.mint;
    // const amount = req.query.amount;
    const amount = Number(req.query.amount);

    if( typeof from === 'string'&&typeof to==='string'&&typeof mint==='string'&& !isNaN(amount)){

        const result= await walletServices.getSplTransforGas(from,to,mint,amount);
        res.locals.response.data = result;
        // 处理结果并发送响应
        res.status(200).json(res.locals.response);

    }else{
      return res.status(400).json({ error: "Invalid params" });
    }
    
 
  } catch (error) {
    // 处理错误并发送响应
    res.status(500).json({ error: "Internal Server Error" });
}


})



    //获取钱包sol余额
    groupRouter_swap.get('/getQuo', async (req, res) => {

      const from = req.query.from;
      const to = req.query.to;
      const amount = Number(req.query.amount); // 将字符串转换为数字
      const fromdecimal = Number(req.query.fromdecimal); // 将字符串转换为数字


      if ((typeof from === 'string' && from.trim()!=='')&&(typeof to === 'string' &&to.trim()!=='')&&typeof amount === 'number'&&typeof fromdecimal==='number'){
        try {
          const result = await mJupSwapServices.getQuote(from,to,amount,fromdecimal);
           res.locals.response.data = result;
            // 处理结果并发送响应
            res.status(200).json(res.locals.response);
        } catch (error) {
          // 处理错误并发送响应
          res.status(500).json({ error: "Internal Server Error" });
      }
      

      }else{
        res.status(400).json({ error: "Invalid request parameter" });
           
      }

    })








  groupRouter_swap.get('/getNetworkGas', async (req, res) => {


  try{
    const feeMintsString = req.query.feeMints as string;

    // 使用字符串分割方法将字符串转换为数组
    const feeMints = feeMintsString.split(',');
       
       if (!feeMints) {
         return res.status(400).json({ error: "parameter is invalid" });
       }
    const result = await mJupSwapServices.getNetworkGas(feeMints);
    const jsonResult = JSON.stringify(result)
    res.locals.response.data = jsonResult;
    res.status(200).json(res.locals.response);
  }catch(error){
   
  // 处理错误并发送响应
  res.status(500).json({ error: "Internal Server Error" });
  }

  })



  groupRouter_swap.post('/postRouterFee', async (req, res) => {


    try{
      const quoteJson: QuoteJson = req.body;
      const result = await mJupSwapServices.getRouterFee(quoteJson);
      res.locals.response.data = result;
      res.status(200).json(res.locals.response);
    }catch(error){
     
    // 处理错误并发送响应
    res.status(500).json({ error: "Internal Server Error" });
    }
  
    })



    groupRouter_swap.post('/reqSwapTransation', async (req, res) => {
      try {
        const { quote, pubkey58 } = req.body;
    
        if (typeof quote !== 'object' && typeof pubkey58 !== 'string') {
          return res.status(400).json({ error: "Invalid parameters" });
        }
    
        // 将 quote 转换为 QuoteResponse 类型
        const quoteResponse = quote as QuoteResponse;
    
        // 调用服务进行交易处理
        const result = await mJupSwapServices.getSwapTransation(quoteResponse, pubkey58);
        res.locals.response.data = result;
        res.status(200).json(res.locals.response);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });


    groupRouter_swap.post('/submmitSwapTx', async (req, res) => {
      try {
        const {tx,lastValidBlockHeight,pubkey58,signature58} = req.body;
  
    
        if (typeof tx!=='string'&&typeof lastValidBlockHeight !=='number') {
          return res.status(400).json({ error: "Invalid parameters" });
        }
        // 调用服务进行交易处理
        mJupSwapServices.sendVerTransation2Chain(tx,lastValidBlockHeight,pubkey58,signature58);
        res.locals.response.data = signature58;
        res.status(200).json(res.locals.response);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    


    groupRouter_swap.get('/getSwapTxState', async (req, res) => {
      try {
        const txId = req.query.txId;
      
        if (typeof txId!=='string') {
          return res.status(400).json({ error: "Invalid parameters" });
        }
        //获取swap状态
       const state=await getSwapStateByTxId(txId)
        res.locals.response.data = state;
        res.status(200).json(res.locals.response);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });






        //根据contract查询token安全信息
        groupRouter_wallet.get('/getCheckTokenInfo', async (req, res) => {

          try {
            const contract = req.query.contract;
            if ((typeof contract === 'string')){
              const result= await walletServices.getCheckTokenInfo(contract);
              res.locals.response.data = result;
               // 处理结果并发送响应
               res.status(200).json(res.locals.response);
            }else{
              return res.status(400).json({ error: "Invalid params" });
            }
         
          } catch (error) {
            // 处理错误并发送响应
            res.status(500).json({ error: "Internal Server Error" });
        }
        
    
      })


           //获取solana链热门tokens
           groupRouter_wallet.get('/getCategoryDatas', async (req, res) => {
            try {
              const category = req.query.category as string;
              const result= await walletServices.getCategoryDatas(category);
           
              res.locals.response.data = result;
               // 处理结果并发送响应
               res.status(200).json(res.locals.response);
           
            } catch (error) {
              // 处理错误并发送响应
              res.status(500).json({ error: "Internal Server Error" });
          }
          
      
        })



         //获取预售信息
         groupRouter_wallet.get('/getPresaleInfo', async (req, res) => {
              try {
                const wallet = req.query.wallet;
              
                if (typeof wallet!=='string') {
                  return res.status(400).json({ error: "Invalid parameters" });
                }
                //获取swap状态
              const state=await getPresaleByWallet(wallet)
                res.locals.response.data = state;
                res.status(200).json(res.locals.response);
              } catch (error) {
                res.status(500).json({ error: "Internal Server Error" });
              }
            });

            groupRouter_wallet.get('/getPresaleInfo', async (req, res) => {
              try {
                const wallet = req.query.wallet;
              
                if (typeof wallet!=='string') {
                  return res.status(400).json({ error: "Invalid parameters" });
                }
                //获取swap状态
              const state=await walletServices.getPresaleOrder(wallet)
                res.locals.response.data = state;
                res.status(200).json(res.locals.response);
              } catch (error) {
                res.status(500).json({ error: "Internal Server Error" });
              }
            });
    
  

  //初始化数据库
   initializeDatabase()
  //启动链接redis
   RedisManager.getInstance().initializeLocalResources()
   //启动定时任务
   startScheduler()


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
