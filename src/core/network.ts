import stdToken, {type TokenInfo} from "@/core/StdToken";
import stdUser, {type UserInfo} from "@/core/StdUser";
import {StdUserInfoError} from "@/core/error/StdUserInfoError";

const BASE_URL = 'https://api.321cqu.com/v1';

export type StdResponse<T> = {
  status: number
  msg: string
  data: T
};

export type RequestMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
export type TokenType = "user" | "app";
export type StdRequestOptions = {
  url: string
  data?: any
  method?: RequestMethod
  needToken?: boolean
  tokenType?: TokenType
}
export async function stdRequest<ResType> (options: StdRequestOptions) {
  // SET DEFAULT
  if (options.data === undefined) options.data = {};
  if (options.method === undefined) options.method = "POST";
  if (options.needToken === undefined) options.needToken = true;

  let header: any = {};
  if (options.needToken) {
    const tokenInfo = await handleToken(options.tokenType || "user");
    header["Authorization"] = "Bearer " + tokenInfo.token;
  }
  const res = await uni.request({
    url: BASE_URL + options.url,
    method: options.method,
    header: header,
    data: options.data
  });
  if (res.statusCode !== 200) { throw res; }
  const response = res.data as StdResponse<ResType>;
  if (response.status !== 1) { throw res; }
  return response.data;
}

async function getToken(username: string | null = null, password: string | null = null) {
  const info = await stdRequest<{
    token: string
    refreshToken: string
    tokenExpireTime: number
    refreshTokenExpireTime: number
  }>({
    url: "/authorization/login",
    data: {
      "apiKey": "koZfU+HGTNXRjxhSQiYpTQ==",
      "applyType": "WX_Mini_APP",
      "username": username,
      "password": password
    },
    needToken: false
  });
  return info;
}

async function getUserToken(username: string, password: string) {
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

async function getAppToken() {
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
  return await stdRequest<TokenInfo>({
    url: "/authorization/refreshToken",
    data: { "refreshToken": refreshToken },
    needToken: false
  });
}

async function handleToken(tokenType: TokenType) {
  if (tokenType === "app") return await handleAppToken();
  return await handleUserToken();
}

async function handleUserToken() {
  // 如果当前的token没有过期则直接返回
  if (checkTokenExpireTime(stdToken.tokenInfo.tokenExpireTime))
    return stdToken.tokenInfo;
  // 如果refreshToken不存在或者过期，则先获取
  const refreshToken = await stdToken.getRefreshTokenInfo()
  if (!refreshToken || !checkTokenExpireTime(refreshToken.refreshTokenExpireTime)) {
    // 如果StuInfo信息缺失则抛出异常
    // if (StdUserInfoError.test()) throw new StdUserInfoError();
    const info = await stdUser.getUserInfo();
    if (info === null) throw new StdUserInfoError(info);
    await getUserToken(info.auth, info.password);
  }
  else stdToken.tokenInfo = await updateToken(refreshToken.refreshToken);
  return stdToken.tokenInfo;
}

async function handleAppToken() {
  if (checkTokenExpireTime(stdToken.appTokenInfo.tokenExpireTime))
    return stdToken.appTokenInfo;
  const refreshToken = await stdToken.getAppRefreshTokenInfo();
  if (!refreshToken || !checkTokenExpireTime(refreshToken.refreshTokenExpireTime)) {
    await getAppToken();
  }
  else stdToken.appTokenInfo = await updateToken(refreshToken.refreshToken);
  return stdToken.appTokenInfo;
}

async function userValidate() {
  await stdUser.setUserInfo(await stdRequest<UserInfo>({ url: "/edu_admin_center/validateAuth" }));
}

export async function login(username: string, password: string) {
  await getUserToken(username, password);
  await userValidate();
}

export async function bindOpenID() {
  const info = await stdUser.getUserInfo();
  if (info === null) return;
  const res = await uni.login();
  await stdRequest({
    url: "/notification/bindOpenId",
    data: {
      "uid": info.uid,
      "code": res.code
    }
  });
}

// 判断token是否过期, true没有过期, false过期
function checkTokenExpireTime(expireTime: number, date=new Date()) {
  return expireTime - date.getTime() / 1000 > 0;
}
