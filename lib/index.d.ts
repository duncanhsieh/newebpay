export declare class TradeModules {
    URL: string;
    MerchantID: string;
    HashKey: string;
    HashIV: string;
    PayGateWay: string;
    ReturnURL: string;
    NotifyURL: string;
    ClientBackURL: string;
    constructor(url: string, merchantId: string, hashKey: string, hashIV: string, payGateWay: string, clientBackURL: string, ReturnURL?: string, NotifyURL?: string);
    private genDataChain;
    private createMpgAesEncrypt;
    createMpgAesDecrypt(TradeInfo: string): string;
    private createMpgShaEncrypt;
    getTradeInfo(Amt: number, Desc: string, email: string, comment?: string): any;
}
