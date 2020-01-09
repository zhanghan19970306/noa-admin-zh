import * as elementLocale from '../plugins/element-ui/element-locale'
import { API_AUTH_INFO, API_AUTH_LOGOUT } from '@/constant/api/platform/login'
import { API_LANG_LANGUAGE } from '@/constant/api/open/language'

export default {
    /**
     * spa模式下的初始化
     */
    async nuxtClientInit({ dispatch }, context) {
        await dispatch('globalInit', context)
    },

    /**
     * universal模式下的初始化
     */
    async nuxtServerInit({ dispatch }, context) {
        await dispatch('globalInit', context)
    },

    /**
     * 通用的初始化逻辑
     */
    async globalInit({ commit, dispatch }, context) {
        /**
         * 页面权限验证是通过*authenticated*中间件 并不在这判断
         * 之所以判断一下X-Token 该用户电脑是否登录过
         * 浏览器刷新的时候 每次获取并设置新store.state.auth值
         * -----------------------------------------------
         * 发送完请求后 能够拿到
         * 1. 用户鉴权token 放到store就能正常的过后面的 用户鉴权中间件了
         * 2. 系统参数的一些基本配置 例如：ftp前置地址
         * 3. 用户信息
         */
        if (context.app.$cookies.get('X-Token')) {
            try {
                const {
                    data: { token, conf, lang, menus, user }
                } = await this.$axios.$get(API_AUTH_INFO)
                const userInfo = { lang, menus, ...user }
                commit('setAuth', token)
                commit('setConf', conf)
                commit('setUserInfo', userInfo)
            } catch {
                // 确认清除一下用户信息
                dispatch('logout')
                // 没有用户信息 就重定向到登录页面
                context.redirect('/login')
            }
        }
    },

    /**
     * 登出 清除一系列用户数据
     */
    async logout({ commit }, isUserOp) {
        try {
            if (isUserOp === true) {
                await this.$axios.$get(API_AUTH_LOGOUT)
            }
             commit('logout')
             this.$cookies.remove('X-Id')
             this.$cookies.remove('X-Token')
             return Promise.resolve()
        } catch(error) {
           return Promise.reject(error)
        }
    },

    /**
     * 异步加载语言包 并且拼合element-ui默认的语言包回来
     */
    async setLocaleData({ commit, state }) {
        try {
            const { data } = await this.$axios.$get(API_LANG_LANGUAGE, {
                params: {
                    language: state.locale
                }
            })
            commit('setLocaleData', {
                ...data,
                ...elementLocale[state.locale]
            })
        } catch (e) {
            console.log(e)
        }
    },

    /**
     * 切换当前所使用的语言 并且记录在cookies里面
     */
    setLocale({ commit, state }, context) {
        commit('setLocale', context)
        this.$cookies.set('locale', state.locale)
    },

    /**
     * 设置菜单状态
     *  先commit 再存储cookies
     */
    setMenuStatus({ commit, state }, context) {
        commit('setMenuStatus', context)
        this.$cookies.set('menuStatus', state.menuStatus)
    },

}
