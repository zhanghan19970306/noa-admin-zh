export default {
    /**
     * 鉴权信息 ps: 其实就是X-token
     */
    setAuth(state, auth) {
        state.auth = auth
    },

    /**
     * 网站的一些系统配置参数 ps: 后台的系统配置模块
     */
    setConf(state, conf) {
        state.conf = conf
    },

    /**
     * 设置用户的基本信息
     */
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },

    /**
     * 切换当前语言包
     */
    setLocale(state, selectedLangage) {
        state.locale = selectedLangage
    },

    /**
     * 加载语言包数据
     */
    setLocaleData(state, langageData) {
        state.localeData = langageData
    },

    /**
     * 改变菜单状态 ps: 混入式
     */
    setMenuStatus(state, payload) {
        state.menuStatus = {
            ...state.menuStatus,
            ...payload
        }
    },

    /**
     * 改变主体配置 ps: 混入式
     */
    setThemeConfig(state, payload) {
        state.themeConfig = {
            ...state.themeConfig,
            ...payload
        }
    },

    /**
     * 登出 ps: 直接清空用户登录凭证
     */
    logout(state) {
        state.auth = null
    }
}
