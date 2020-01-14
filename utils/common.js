/**
 * 生成树级菜单的递归算法 ps: 后台给到我们的是平铺的菜单
 * @param data
 * @param pid
 * @returns {[]}
 */
export function generateTreeMenus(data, pid) {
    const tree = []
    data.forEach(item => {
        if (item.parentId === pid && item.type === 'menu') {
            const menuItem = {
                id: item.id,
                name: item.name,
                identify: item.identify,
                alias: item.alias,
                type: item.type,
                showit: item.showit,
                hasChildren: item.hasChildren,
                icon: item.icon,
                sortId: item.sortId,
                parentId: item.parentId,
                url: item.href,
                path: item.href ? item.href : `/${item.alias}`,
                treePath: item.path,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                meta: { title: item.name, icon: item.icon },
                children: generateTreeMenus(data, item.id)
            }
            tree.push(menuItem)
        }
    })

    return tree
}

/**
 * 生成path映射菜单
 */
export function generatePathToMenus(data) {
    const menus = {}
    data.forEach(item => {
        if (item.type === 'menu') {
            if (item.path.length === 4) {
                menus[item.path] = []
            } else {
                const pPath = item.path.slice(0, (item.path.length / 4 - 1) * 4)
                if (menus[pPath]) {
                    menus[pPath].push(item)
                } else {
                    menus[pPath] = [item]
                }
            }
        }
    })
    return menus
}

/**
 * 是否是手机端运行环境
 */
export function isMobile() {
    let sUserAgent = navigator.userAgent.toLowerCase()
    let bIsIpad = sUserAgent.match(/ipad/i) == 'ipad'
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
    let bIsMidp = sUserAgent.match(/midp/i) == 'midp'
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
    let bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
    let bIsAndroid = sUserAgent.match(/android/i) == 'android'
    let bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
    let bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
    if (
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
    ) {
        return true
    } else {
        return false
    }
}
