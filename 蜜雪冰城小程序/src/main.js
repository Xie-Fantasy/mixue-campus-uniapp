/**
 * Mixue Campus · uni-app | 蜜雪冰城点单前端学习项目
 * 课程实践与维护：谢凡 / Xie-Fantasy
 * GitHub：https://github.com/Xie-Fantasy
 * 项目源码：https://github.com/Xie-Fantasy/mixue-campus-uniapp
 * 非官方学习作品。第三方素材及历史参考范围见根目录 THIRD_PARTY_NOTICES.md。
 */
import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
