import StdModel from "@/core/StdModel";
import {stdGetStorage, stdGetStorageOrDefault, stdSetStorage} from "@/core/storage";
import {StdRefreshTokenError} from "@/core/error/StdRefreshTokenError";

export type TokenInfo = {
  token: string
  tokenExpireTime: number
}

export type RefreshTokenInfo = {
  refreshToken: string
  refreshTokenExpireTime: number
}

class StdToken extends StdModel {
  private _tokenInfo: TokenInfo = {token: "", tokenExpireTime: -1};
  private _appTokenInfo: TokenInfo = {token: "", tokenExpireTime: -1};
  public get tokenInfo() { return this._tokenInfo; }
  public set tokenInfo(info: TokenInfo) {
    this._tokenInfo = info;
    // console.log("TokenInfo", this._tokenInfo);
  }
  public get appTokenInfo() { return this._appTokenInfo; }
  public set appTokenInfo(info: TokenInfo) {
    this._appTokenInfo = info;
  }
  public async getRefreshTokenInfo() {
    try {
      return await stdGetStorage<RefreshTokenInfo>("RefreshTokenInfo");
    } catch (e) {
      throw new StdRefreshTokenError(e);
    }
  }
  public async setRefreshTokenInfo(info: RefreshTokenInfo) { await stdSetStorage("RefreshTokenInfo", info); }
  public async getAppRefreshTokenInfo() {
    return await stdGetStorageOrDefault<RefreshTokenInfo | null>("AppRefreshTokenInfo", null);
  }
  public async setAppRefreshTokenInfo(info: RefreshTokenInfo) { await stdSetStorage("AppRefreshTokenInfo", info); }
  public clear() {
    this._tokenInfo = {token: "", tokenExpireTime: -1};
    this._appTokenInfo = {token: "", tokenExpireTime: -1};
  }
}

export default new StdToken();
