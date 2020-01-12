require('dotenv-flow').config()

module.exports = {
    mode: process.env.MODE,
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.PLANTFORM_NAME || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.PLANTFORM_NAME || ''
            }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href: '//at.alicdn.com/t/font_1601810_orquhacje2r.css'
            }
        ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#409EFF' },
    /*
     ** Global CSS
     */
    css: ['element-ui/lib/theme-chalk/index.css', '@/assets/scss/noa.scss'],
    /*
     ** Plugins to load before mounting the App
     *  注意： 某些加载顺序不可改动
     *        1. client-init在spa模式下 必须在axios加载后 不然就会读取不到axios的配置
     *        2. i18n也是如此 因为需要去异步请求 所以都前置需要axios的配置
     */
    plugins: [
        '@/plugins/element-ui/element-ui',
        '@/plugins/axios.js',
        '@/plugins/i18n',
        '@/plugins/moment',
        '@/plugins/client-init.client.js',
        '@/plugins/directives.client.js',
        '@/plugins/quill-editor.client.js'
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/dotenv-module
        '@nuxtjs/dotenv',
        // Doc: https://zh.nuxtjs.org/faq/http-proxy
        '@nuxtjs/proxy'
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        // Doc: https://www.npmjs.com/package/cookie-universal-nuxt
        'cookie-universal-nuxt'
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        proxy: true
    },
    proxy: {
        '/api': {
            target: process.env.HTTP_URL,
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            }
        }
    },
    server: {
        host: '0.0.0.0' // default: localhost
    },
    /*
     ** Build configuration
     */
    build: {
        transpile: [/^element-ui/],
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {}
    }
}
