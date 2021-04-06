"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var class_validator_1 = require("class-validator");
var TradeModules = /** @class */ (function () {
    function TradeModules(url, merchantId, hashKey, hashIV, payGateWay, clientBackURL, ReturnURL, NotifyURL) {
        this.URL = url;
        this.MerchantID = merchantId;
        this.HashKey = hashKey;
        this.HashIV = hashIV;
        this.PayGateWay = payGateWay;
        this.ReturnURL =
            ReturnURL || this.URL + '/spgateway/callback?from=ReturnURL';
        this.NotifyURL =
            NotifyURL || this.URL + '/spgateway/callback?from=NotifyURL';
        this.ClientBackURL = clientBackURL || 'http://localhost:8080/orders';
    }
    TradeModules.prototype.genDataChain = function (TradeInfo) {
        var results = [];
        for (var _i = 0, _a = Object.entries(TradeInfo); _i < _a.length; _i++) {
            var kv = _a[_i];
            results.push(kv[0] + "=" + kv[1]);
        }
        return results.join('&');
    };
    TradeModules.prototype.createMpgAesEncrypt = function (TradeInfo) {
        var encrypt = crypto_1.createCipheriv('aes256', this.HashKey, this.HashIV);
        var enc = encrypt.update(this.genDataChain(TradeInfo), 'utf8', 'hex');
        return enc + encrypt.final('hex');
    };
    TradeModules.prototype.createMpgAesDecrypt = function (TradeInfo) {
        var decrypt = crypto_1.createDecipheriv('aes256', this.HashKey, this.HashIV);
        decrypt.setAutoPadding(false);
        var text = decrypt.update(TradeInfo, 'hex', 'utf8');
        var plainText = text + decrypt.final('utf8');
        var result = plainText.replace(/[\x00-\x20]+/g, '');
        return result;
    };
    TradeModules.prototype.createMpgShaEncrypt = function (TradeInfo) {
        var sha = crypto_1.createHash('sha256');
        var plainText = "HashKey=" + this.HashKey + "&" + TradeInfo + "&HashIV=" + this.HashIV;
        return sha
            .update(plainText)
            .digest('hex')
            .toUpperCase();
    };
    TradeModules.prototype.getTradeInfo = function (Amt, Desc, email, comment) {
        var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if (Amt < 0)
            return { status: 'error', message: "Input Amt type " + Amt + " Error" };
        if (Desc.length < 1)
            return {
                status: 'error',
                message: "Input Desc Length " + Desc + " Error",
            };
        if (email.search(emailRule) !== -1) {
            var data = {
                MerchantID: this.MerchantID,
                RespondType: 'JSON',
                TimeStamp: Date.now(),
                Version: 1.5,
                MerchantOrderNo: Date.now(),
                LoginType: 0,
                OrderComment: comment || 'OrderComment',
                Amt: Amt,
                ItemDesc: Desc,
                Email: email,
                ReturnURL: this.ReturnURL,
                NotifyURL: this.NotifyURL,
                ClientBackURL: this.ClientBackURL,
            };
            var mpgAesEncrypt = this.createMpgAesEncrypt(data);
            var mpgShaEncrypt = this.createMpgShaEncrypt(mpgAesEncrypt);
            var tradeInfo = {
                MerchantID: this.MerchantID,
                TradeInfo: mpgAesEncrypt,
                TradeSha: mpgShaEncrypt,
                Version: 1.5,
                PayGateWay: this.PayGateWay,
                MerchantOrderNo: data.MerchantOrderNo,
            };
            return tradeInfo;
        }
        else {
            return {
                status: 'error',
                message: "Input Email content " + email + " Error",
            };
        }
    };
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsUrl()
    ], TradeModules.prototype, "URL", void 0);
    __decorate([
        class_validator_1.IsNotEmpty()
    ], TradeModules.prototype, "MerchantID", void 0);
    __decorate([
        class_validator_1.IsNotEmpty()
    ], TradeModules.prototype, "HashKey", void 0);
    __decorate([
        class_validator_1.IsNotEmpty()
    ], TradeModules.prototype, "HashIV", void 0);
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsUrl()
    ], TradeModules.prototype, "PayGateWay", void 0);
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsUrl()
    ], TradeModules.prototype, "ReturnURL", void 0);
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsUrl()
    ], TradeModules.prototype, "NotifyURL", void 0);
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsUrl()
    ], TradeModules.prototype, "ClientBackURL", void 0);
    return TradeModules;
}());
exports.TradeModules = TradeModules;
