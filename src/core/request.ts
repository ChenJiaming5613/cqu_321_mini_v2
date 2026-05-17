import {type RequestData, type RequestMethod, type StdResponse, stdHttpRequest} from "@/core/httpClient";
import {handleToken, type TokenType} from "@/core/tokenService";

export type {RequestMethod, StdResponse};
export type {TokenType};

export type StdRequestOptions = {
  url: string
  data?: RequestData
  method?: RequestMethod
  needToken?: boolean
  tokenType?: TokenType
}
export async function stdRequest<ResType> (options: StdRequestOptions) {
  const data = options.data ?? {};
  const method = options.method ?? "POST";
  const needToken = options.needToken ?? true;

  const header: Record<string, string> = {};
  if (needToken) {
    const tokenInfo = await handleToken(options.tokenType || "user");
    header["Authorization"] = "Bearer " + tokenInfo.token;
  }
  return await stdHttpRequest<ResType>({
    url: options.url,
    data,
    method,
    header
  });
}
