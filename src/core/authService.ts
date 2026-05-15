import stdUser, {type UserInfo} from "@/core/StdUser";
import {stdRequest} from "@/core/network";
import {getUserToken} from "@/core/tokenService";

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
