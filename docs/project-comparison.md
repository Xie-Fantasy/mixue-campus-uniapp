# 同题材项目对照与命名依据

查阅日期：2026 年 10 月 28 日。以下用于说明名称、技术与展示定位的区别，不是质量排名，也不能据此认定历史代码的来源。

| 项目 | 已核对的内容 | 本项目的区分方式 |
| --- | --- | --- |
| [rijianyunxi/uni-app-mixuebingcheng](https://github.com/rijianyunxi/uni-app-mixuebingcheng) | 仓库创建于 2020 年；`package.json` 使用 Vue 2.6、Vuex 3、Vue CLI 4。首页源码使用“手机点餐 / 兑换码 / 优惠券”纵向入口 | 本项目使用 Vue 3.4 与 Vite 5；首页展示会员卡片、“到店自取 / 雪王外送”双卡片，保留 2025 年春季的课设界面 |
| [wuyidayangqin/uni-app-mixuebingcheng](https://github.com/wuyidayangqin/uni-app-mixuebingcheng) | GitHub 标记为上一项目的 fork；README 同样以“uni-app 模仿微信小程序蜜雪冰城”为题 | 不沿用 `uni-app-mixuebingcheng` 名称，也不把 fork 重复计为独立设计方案 |
| [cqljh/mxbc-mp](https://github.com/cqljh/mxbc-mp) | README 定位为纯前端模板，列有会员、优惠券、礼品卡等分包；声明 Apache-2.0 许可 | 本项目以课程报告、可运行点单交互和本地账号/地址/订单为主，不宣称覆盖相同营销模块 |
| [lfeternity/mxbc](https://github.com/lfeternity/mxbc) | README 包含 Spring Boot 后端、管理端、小程序及 AI 助手 | 本项目无需后端或数据库，定位为可本地运行的前端课设 |

证据入口：

- [早期项目依赖配置](https://github.com/rijianyunxi/uni-app-mixuebingcheng/blob/master/package.json)
- [早期项目首页源码](https://github.com/rijianyunxi/uni-app-mixuebingcheng/blob/master/src/pages/index/index.vue)
- [早期项目 fork 信息](https://api.github.com/repos/wuyidayangqin/uni-app-mixuebingcheng)
- [mxbc-mp 说明](https://github.com/cqljh/mxbc-mp/blob/master/readme.md)
- [全栈项目说明](https://github.com/lfeternity/mxbc/blob/main/README.md)

名称采用 **SnowKing Campus 2025 / 雪王校园点单**，仓库名为 `snowking-campus-2025`。`Campus` 说明课程实践背景，`2025` 给出时间范围，避免使用含混的“最新版”或把它误认为其他项目的官方升级版本。按本次 GitHub 名称检索，创建前未发现同名仓库；这一结果不构成全网名称独占声明。

也检索了 GitLab 与 Gitee 的公开网页结果，但没有取得足以确认其就是作者当时下载项目的证据，因此不虚构原项目链接。作者已确认历史参考链接无法找回；如将来确认有复用代码，应补充实际来源及原许可，不能通过改名替代署名。
