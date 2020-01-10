export default () => ({
    /**
     * 鉴权信息 ps: 其实就是X-token
     */
    auth: null,

    /**
     * 网站的一些系统配置参数 ps: 后台的系统配置模块
     */
    conf: null,

    /**
     * 设置用户的基本信息
     */
    userInfo: null,

    /**
     * 选中对语言 和语言包数据 ps: 这个点其实很奇怪 由后台做的多语言配置 所以我们需要异步的加载多语言数据回来
     */
    locale: 'zh-CN',
    localeData: '',

    /**
     * 菜单的一些状态
     * 这个地方可能随着布局的变化 要灵活变动
     * ps: 当我们没有使用element-ui自带的菜单组件的时候 我们就需要自己去干一套菜单点亮逻辑
     *
     */
    menuStatus: {
        isCollapse: false, // 是否折叠
        firstActiveIndex: '', // 一级菜单激活index
        secondActiveIndex: '', // 二级菜单激活index
        thirdActiveIndex: '' // 三级菜单激活index
        //自定义字段...
    }
})
