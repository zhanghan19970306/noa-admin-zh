/**
 * 增强在spa模式下 会有同等于 nuxtClientInit 的初始化方法
 * if判断 是防止在universal模式下 进行两次初始化
 * Doc: https://zh.nuxtjs.org/guide/vuex-store#nuxtserverinit-%E6%96%B9%E6%B3%95
 * @param ctx
 * @returns {Promise<void>}
 */
export default async ctx => {
    if (process.env.MODE === 'spa') {
        await ctx.store.dispatch('nuxtClientInit', ctx)
    }
}
