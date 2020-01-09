<template>
    <el-dropdown @command="onCommand">
        <div class="layout-user hover-effect">
            <el-avatar :size="30" src="avatarUrl">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
            <span class="layout-user__name"> {{ userInfo.loginname }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userCenter" icon="noa-icon-user">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting" icon="noa-icon-layout">布局设置</el-dropdown-item>
            <el-dropdown-item command="logOut" icon="noa-icon-logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "UserCenter",
        computed: {
            ...mapState(['conf', 'userInfo']),
            avatarUrl() {
                console.log(this.conf.AppFileDomain + this.userInfo.avatar)
                return this.conf.AppFileDomain + this.userInfo.avatar
            }
        },
        methods: {
            /**
             * 分发事件
             */
            onCommand(type) {
                if(type === 'userCenter') return this.onUserCenter()
                if(type === 'setting') return this.onSetting()
                if(type === 'logOut') return this.onLogOut()
            },
            onUserCenter() {
                this.$router.push('/platform/sys/user/base')
            },
            onSetting() {},
            async onLogOut() {
                try {
                    await this.$store.dispatch('logout', true)
                    this.$router.push('/login')
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
</script>
