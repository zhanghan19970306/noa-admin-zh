import qs from 'qs'
import { Notification } from 'element-ui'
import { FAILED_CODE, TIMEOUT_CODE } from '@/constant/code'

export default function({ $axios, redirect, store, app }) {
    // 设置请求的前置路径
    $axios.defaults.baseURL = process.env.API
    // 设置请求的语言,如果不设置会产生前后端语言不一致的情况
    $axios.setHeader('X-Lang', app.$cookies.get('locale'))
    // 非单页模式时,需传递X-Token和X-Id换取登陆用户Session
    if (process.env.MODE !== 'spa') {
        $axios.setHeader('X-Token', app.$cookies.get('X-Token'))
        $axios.setHeader('X-Id', app.$cookies.get('X-Id'))
    }

    /**
     * 请求拦截器
     */
    $axios.onRequest(config => {
        if (config.method === 'post') {
            config.data = qs.stringify(config.data)
        }
    })

    /**
     * 响应拦截器
     */
    $axios.onResponse(res => {
        if (res.data.code) {
            // 请求错误 给出提示
            if (res.data.code === FAILED_CODE) {
                if (process.browser) {
                    Notification.error({
                        title: app.i18n.t(`system.api.code.error`),
                        message: res.data.msg
                    })
                }
            }

            // session失效删除登陆状态
            if (res.data.code === TIMEOUT_CODE) {
                // app.$cookies.remove('X-Id')
                // app.$cookies.remove('X-Token')
                // app.$store.dispatch('setAuth', '')
            }

            return Promise.resolve(res)
        } else {
            return Promise.resolve(res)
        }
    })
}
