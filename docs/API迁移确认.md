# API 迁移确认

本文记录新后端 OpenAPI 与当前小程序调用的差异，以及已确认的保留、迁移和移除策略。

## 新后端基础信息

- OpenAPI 来源：`openapi.json`
- 当前前端基础地址：`https://api.321cqu.com/v1`
- 响应格式：`{ status: number, msg: string, data: T }`
- 成功状态：`status === 1`

## 当前小程序已使用且新后端保留的接口

| 功能 | 前端路径 | 新 OpenAPI 路径 | 方法 | 结论 |
|---|---|---|---|---|
| 登录 | `/authorization/login` | `/v1/authorization/login` | POST | 保留 |
| 刷新 Token | `/authorization/refreshToken` | `/v1/authorization/refreshToken` | POST | 保留 |
| 账号验证 | `/edu_admin_center/validateAuth` | `/v1/edu_admin_center/validateAuth` | POST | 保留 |
| 绑定 OpenID | `/notification/bindOpenId` | `/v1/notification/bindOpenId` | POST | 保留 |
| 成绩查询 | `/edu_admin_center/fetchScore` | `/v1/edu_admin_center/fetchScore` | POST | 保留 |
| GPA 排名 | `/edu_admin_center/fetchGpaRanking` | `/v1/edu_admin_center/fetchGpaRanking` | POST | 保留 |
| 考试安排 | `/edu_admin_center/fetchExam` | `/v1/edu_admin_center/fetchExam` | POST | 保留 |
| 课表查询 | `/edu_admin_center/fetchCourseTimetable` | `/v1/edu_admin_center/fetchCourseTimetable` | POST | 保留 |
| 查课列表 | `/course_score_query/course` | `/v1/course_score_query/course` | GET | 保留 |
| 查课详情 | `/course_score_query/course/{code}` | `/v1/course_score_query/course/{cid}` | GET | 保留；后端确认接受 course code |
| 图书借阅 | `/library/borrow` | `/v1/library/borrow` | GET | 保留 |

## 已确认迁移的接口

| 功能 | 旧实现 | 新接口 | 方法 | 处理策略 |
|---|---|---|---|---|
| 首页轮播 | `https://www.zhulegend.com/321CQU/homepage` | `/v1/important_info/homepages` | GET | 已迁移 |

首页轮播响应字段需要从旧结构迁移到新结构：

| 旧字段 | 新字段 | 说明 |
|---|---|---|
| `Pictures[].Url` | `homepages[].img_url` | 图片地址 |
| `Pictures[].ContentUrl` | `homepages[].jump_param` | 跳转参数 |
| `Pictures[].JumpType` | `homepages[].jump_type` | 跳转类型 |
| 无 | `homepages[].img_pos` | 图片存储位置，`LOCAL` 或 `COS` |

## 后端已有但当前小程序未接入的接口

| 功能 | 新接口 | 方法 | 当前前端状态 |
|---|---|---|---|
| 校园卡余额 | `/v1/campus_lift/card` | GET | `pages/life/index.vue` 有静态展示，未调用 API |
| 校园卡账单 | `/v1/campus_lift/bill/card` | GET | 未接入 |
| 宿舍水电费 | `/v1/campus_lift/bill/dorm_energy` | GET | `pages/life/index.vue` 有静态展示，未调用 API |
| 图书续借 | `/v1/library/borrow` | POST | 未接入 |

## 暂不支持或移除的功能

| 功能 | 当前接口/模块 | 结论 |
|---|---|---|
| 通知订阅 | `/notification/updateSubscribe`、`/notification/fetchSubscribeInfo` | 暂不支持 |
| APNs | `/notification/setApns` | 小程序不接入 |
| 自定义课程云同步 | `/course_table/push_custom_event`、`/course_table/pull_custom_event` | 已禁用旧接口入口，暂不提供 |
| 关于我们 | `/about/about_us` | 后续对齐设计稿时再改为静态 Markdown 链接 |
| 教程 | `/about/get_tutorials` | 后续对齐设计稿时再改为静态 Markdown 链接 |
| iOS 选课接口 | `/edu_admin_center/fetchEnrollCourseInfo`、`/edu_admin_center/fetchEnrollCourseItem` | 小程序暂不接入 |
| 招生成绩 | `/v1/recruit/score` | 当前小程序不接入 |
| 服务指标 | `/metrics` | 不接入客户端 |

## 当前前端检查结论

`src/pages/life/index.vue` 目前展示“一卡通”和“水电费”，但余额数据是本地硬编码示例：

- 一卡通余额：`yktList`
- 水电费：`sdfList`

代码中未发现对 `/campus_lift/card`、`/campus_lift/bill/card`、`/campus_lift/bill/dorm_energy` 或旧版 `get_card`、`get_fees` 的实际请求。后续如果保留生活页，应新增对应 model/service 接入新后端。
