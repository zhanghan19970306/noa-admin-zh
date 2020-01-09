import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/element-ui/index.scss' // 我们延伸/改写部分element-ui的样式
import locale from 'element-ui/lib/locale/lang/zh-CN'
export default () => {
    Vue.use(Element, { locale })
}
