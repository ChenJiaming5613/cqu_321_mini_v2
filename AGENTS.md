# Repository Guidelines

## 项目结构与模块组织

本仓库是基于 UniApp、Vue 3 和 TypeScript 的应用。入口与全局配置包括 `src/main.ts`、`src/App.vue`、`src/pages.json` 和 `src/manifest.json`。业务页面按功能放在 `src/pages/<feature>/` 下，页面组件与局部工具函数放在同一目录，例如 `src/pages/grade/GradeItem.vue` 和 `src/pages/grade/util.ts`。共享组件位于 `src/pages/components/`，数据模型位于 `src/models/`，网络、存储、用户和错误处理等基础能力位于 `src/core/`，通用工具函数位于 `src/utils/`。静态资源放在 `src/static/`，ColorUI 样式与组件放在 `src/colorui/`。项目说明、命名规范和技术文档位于 `docs/`。

## 构建、测试与开发命令

- `bun install`：根据 `bun.lock` 安装依赖。
- `bun run dev:h5`：启动 H5 开发环境。
- `bun run build:h5`：构建 H5 生产版本。
- `bun run dev:mp-weixin` / `bun run build:mp-weixin`：开发或构建微信小程序目标。
- `bun run dev:app`：通过 UniApp 工具运行 App 目标。
- `bun run type-check`：执行 `vue-tsc --noEmit`，检查 TypeScript 与 Vue 类型问题。

其他平台请使用 `package.json` 中对应的 `dev:<platform>` 和 `build:<platform>` 脚本。

## 编码风格与命名规范

优先使用 Vue 单文件组件，并在脚本中使用 TypeScript。遵循 `docs/命名规范.md`：类名和 public static function 使用 PascalCase，public member function 使用 camelCase。可复用组件文件名使用 PascalCase，例如 `NavigationBar.vue`；页面入口保持 `index.vue`。从 `src` 引入模块时优先使用 `@/` 路径别名。样式默认放在组件内维护，只有修改全局样式时才编辑 `src/App.css`、`src/uni.scss` 或 ColorUI 相关文件。

## 测试指南

提交前至少运行 `bun run type-check`，并构建受影响的平台目标，通常是 `bun run build:h5` 或对应的小程序构建命令。涉及 UI 的改动需要在目标 UniApp 平台上手动冒烟测试，重点检查页面跳转、加载状态、数据展示和平台 API 调用。

## 页面开发与设计稿验收流程

涉及页面 UI 或交互改动时，先查阅 `docs/页面设计稿对齐计划.md`，确认目标页面、参考设计稿、开发范围和暂缓功能边界。实现时优先复用 `src/pages/components/` 中的共享组件，页面局部组件保留在对应 `src/pages/<feature>/` 目录内；不要为暂缓功能接入真实接口，保留入口时使用弹窗提示“敬请期待”。

页面开发完成后必须执行：

- `bun run type-check`
- `bun run build:h5`

可见 UI 改动还必须使用 Playwright 做 H5 截图验收：

1. 启动 H5：`bun run dev:h5`。
2. 运行 mock 数据截图脚本：`node scripts/h5-mock-screenshots.js`，也可使用 `bun run screenshots:h5`。
3. 截图会保存到 `docs/页面验收截图/`，当前包含首页、成绩管理、课表、查课和考试安排的数据态截图。
4. 对涉及响应式布局或大屏适配的页面运行 `bun run screenshots:h5:responsive`。该命令会输出多设备比例截图到 `docs/页面验收截图/responsive/`，覆盖窄屏手机、常见手机、长屏手机、大屏手机、平板竖屏和平板横屏。
5. 将生成截图与 `分页面设计稿/` 中对应设计稿对比，重点检查顶部导航、卡片宽度、圆角、阴影、字号、颜色、列表密度、空状态、按钮位置、底部栏遮挡和滚动区域。
6. 对涉及交互的页面运行 `node scripts/h5-interaction-check.js`，覆盖点击、输入、切换、下拉刷新、右上刷新、弹窗和详情展开等关键动作。
7. 如果截图中出现明显布局偏差、文本溢出、空白占位、数据态未渲染或交互状态不符合预期，应先修复并重新截图/重跑交互脚本，确认无明显偏差后再结束开发。

Playwright 依赖已作为 dev dependency 安装。若新增页面需要 mock 数据，应扩展 `scripts/h5-mock-screenshots.js` 和必要的交互验收脚本，不要在业务代码中写入验收专用 mock。

## 提交与 Pull Request 规范

近期提交历史多使用简短中文描述，例如 `优化样式`、`修改成绩查询样式`。提交应聚焦单一改动，信息简洁明确。Pull Request 需要说明改动的页面或模块，列出已执行的验证命令，关联相关 issue；如果包含可见 UI 改动，应附截图或录屏。

## 安全与配置建议

不要提交本地凭据、Token、构建产物或平台签名文件。涉及 API、会话、存储和错误处理的改动应尽量集中在 `src/core/` 或相关 model 工具中。环境配置发生变化时，同步更新 `docs/环境配置.md`。
