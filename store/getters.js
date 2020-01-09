import { generateTreeMenus, generatePathToMenus } from '@/utils/common'

export default {
    userMenus: state => {
        return generateTreeMenus(state.userInfo.menus, '')
    },
    userPathToMenus: state => {
        return generatePathToMenus(state.userInfo.menus)
    },
    userRoles: state => {
        return state.userInfo.roles
    },
    userPermissionUrl: state => {
        return state.userInfo.menus
            .filter(item => item.type === 'menu' && item.href !== '')
            .map(item => item.href)
    },
    userPermissions: state => {
        return state.userInfo.menus.map(item => item.permission)
    },
    userAuth: state => {
        return state.auth
    }
}
