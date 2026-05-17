import stdToken, {type TokenInfo} from "@/core/StdToken";
import stdUser from "@/core/StdUser";
import {StdUserInfoError} from "@/core/error/StdUserInfoError";
import {stdHttpRequest} from "@/core/httpClient";
import {deobfuscateOrPlainText} from "@/core/storage";

export type TokenType = "user" | "app";

type TokenResponse = {
  token: string
  refreshToken: string
  tokenExpireTime: number
  refreshTokenExpireTime: number
};

async function getToken(username: string | null = null, password: string | null = null) {
  return await stdHttpRequest<TokenResponse>({
    url: "/authorization/login",
    data: {
      "apiKey": "koZfU+HGTNXRjxhSQiYpTQ==",
      "applyType": "WX_Mini_APP",
      "username": username,
      "password": password
    }
  });
}

export async function getUserToken(username: string, password: string) {
  const info = await getToken(username, password);
  await stdToken.setRefreshTokenInfo({
    refreshToken: info.refreshToken,
    refreshTokenExpireTime: info.refreshTokenExpireTime
  });
  stdToken.tokenInfo = {
    token: info.token,
    tokenExpireTime: info.tokenExpireTime
  };
}

export async function getAppToken() {
  const info = await getToken();
  await stdToken.setAppRefreshTokenInfo({
    refreshToken: info.refreshToken,
    refreshTokenExpireTime: info.refreshTokenExpireTime
  });
  stdToken.appTokenInfo = {
    token: info.token,
    tokenExpireTime: info.tokenExpireTime
  };
}

async function updateToken(refreshToken: string) {
  return await stdHttpRequest<TokenInfo>({
    url: "/authorization/refreshToken",
    data: { "refreshToken": refreshToken }
  });
}

export async function handleToken(tokenType: TokenType) {
  if (tokenType === "app") return await handleAppToken();
  return await handleUserToken();
}

async function handleUserToken() {
  if (checkTokenExpireTime(stdToken.tokenInfo.tokenExpireTime)) {
    return stdToken.tokenInfo;
  }
  const refreshToken = await stdToken.getRefreshTokenInfo();
  if (!refreshToken || !checkTokenExpireTime(refreshToken.refreshTokenExpireTime)) {
    const info = await stdUser.getUserInfo();
    if (info === null) throw new StdUserInfoError(info);
    await getUserToken(info.auth, deobfuscateOrPlainText(info.password));
  }
  else stdToken.tokenInfo = await updateToken(refreshToken.refreshToken);
  return stdToken.tokenInfo;
}

async function handleAppToken() {
  if (checkTokenExpireTime(stdToken.appTokenInfo.tokenExpireTime)) {
    return stdToken.appTokenInfo;
  }
  const refreshToken = await stdToken.getAppRefreshTokenInfo();
  if (!refreshToken || !checkTokenExpireTime(refreshToken.refreshTokenExpireTime)) {
    await getAppToken();
  }
  else stdToken.appTokenInfo = await updateToken(refreshToken.refreshToken);
  return stdToken.appTokenInfo;
}

// 判断 token 是否过期，true 表示没有过期，false 表示已过期。
export function checkTokenExpireTime(expireTime: number, date = new Date()) {
  return expireTime - date.getTime() / 1000 > 0;
}
