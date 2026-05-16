import stdUser, {type UserInfo} from "@/core/StdUser";
import {stdRequest} from "@/core/request";
import {getUserToken} from "@/core/tokenService";
import {obfuscate} from "@/core/storage";

export async function login(username: string, password: string) {
  await getUserToken(username, password);
  const validatedInfo = await stdRequest<UserInfo>({ url: "/edu_admin_center/validateAuth" });
  await stdUser.setUserInfo({
    ...validatedInfo,
    auth: username,
    password: obfuscate(password)
  });
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
