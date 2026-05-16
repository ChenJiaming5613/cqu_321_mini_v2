import {StdError} from "@/core/error/StdError";

export class StdRefreshTokenError extends StdError {
    constructor(errMsg: unknown) { super("Refresh Token Lack: " + String(errMsg)); }
}
