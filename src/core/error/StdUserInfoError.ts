import {StdError} from "@/core/error/StdError";

export class StdUserInfoError extends StdError {
  constructor(errMsg: unknown) { super("User Info Lack: " + String(errMsg)); }
}
