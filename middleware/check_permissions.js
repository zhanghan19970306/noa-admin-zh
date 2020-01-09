export default async function({ store, redirect, route }) {
    const has_permissions = store.getters.userPermissionUrl.includes(route.path)

    // Todo 应该是跳往403
    if (!has_permissions) {
        return redirect('/403')
    }
}
