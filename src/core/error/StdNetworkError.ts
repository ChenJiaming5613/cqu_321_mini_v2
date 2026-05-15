import {StdError} from "@/core/error/StdError";
import type {StdResponse} from "@/core/httpClient";

export class StdNetworkError<ResType> extends StdError {
  public readonly url: string;
  public readonly statusCode: number;
  public readonly errMsg: string;
  public readonly requestParams: any;
  public readonly responseData?: Partial<StdResponse<ResType>>;

  constructor(options: {
    url: string
    statusCode: number
    errMsg: string
    requestParams: any
    responseData?: Partial<StdResponse<ResType>>
  }) {
    const responseMsg = typeof options.responseData?.msg === "string" ? options.responseData.msg : "";
    const statusText = options.statusCode > 0 ? `【${options.statusCode}】` : "";
    const message = [statusText, responseMsg || options.errMsg || "请求失败"].filter(Boolean).join(" ");
    super(message);
    this.name = "StdNetworkError";
    this.url = options.url;
    this.statusCode = options.statusCode;
    this.errMsg = options.errMsg;
    this.requestParams = options.requestParams;
    this.responseData = options.responseData;
  }

  static test<ResType>(statusCode: number, response: Partial<StdResponse<ResType>>): boolean {
    return statusCode >= 200 && statusCode < 300 && response.status === 1;
  }
}
