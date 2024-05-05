import { res } from "pino-std-serializers"
import {getTokenInfos} from "../solanawallet/rpc/dexscreen_rpc/getTokensPrice"
import {getTokenAccounts} from "../solanawallet/rpc/getTokenList"

function t_getTokenInfos(wallet :string){
    getTokenAccounts(wallet).then(base=>{
        const result= getTokenInfos(base)
        console.log(result)
    
    })

  
}

t_getTokenInfos("5eFsFYRrULZVTfvqGmEYE2aETpGF4V6bfReTQJ69L7qY")