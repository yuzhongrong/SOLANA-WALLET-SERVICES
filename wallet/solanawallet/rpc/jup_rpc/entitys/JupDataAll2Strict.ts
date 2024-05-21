import { TokenData1 } from "../getTokenInfoByJup";

export class JupDataAll2Strict {
    //这个TokenData1[]会在redis set的时候更新 这样设计是为了避免每次都去解析的时间
    private static instance: JupDataAll2Strict;
    private alldata: TokenData1[] | null = null;
    private strictdata: TokenData1[] | null = null;
    private constructor() {}
  
    public static getInstance(): JupDataAll2Strict {
      if (!JupDataAll2Strict.instance) {
        JupDataAll2Strict.instance = new JupDataAll2Strict();
      }
      return JupDataAll2Strict.instance;
    }
  
    public setAllData(data: TokenData1[]): void {
      this.alldata = data;
    }
  
    public getAllData(): TokenData1[] | null {
      return this.alldata;
    }

    public setStrictData(data: TokenData1[]): void {
      this.strictdata = data;
    }
  
    public getStrictData(): TokenData1[] | null {
      return this.strictdata;
    }
  }