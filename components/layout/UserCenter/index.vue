<template>
  <div>
    <el-dropdown class="user" @command="onCommand">
      <div class="user-main">
        <el-avatar :size="30" src="avatarUrl">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
        <span class="user__name">{{ userInfo.loginname }}</span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="userCenter" icon="noa-icon-user">个人中心</el-dropdown-item>
        <el-dropdown-item command="setting" icon="noa-icon-layout">布局设置</el-dropdown-item>
        <el-dropdown-item command="logOut" icon="noa-icon-logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-drawer
      class="dialog-config"
      size="280px"
      append-to-body
      title="布局配置"
      :visible.sync="layoutConfigDialogShow"
    >
      <el-divider>主题风格</el-divider>
      <div class="config-list">
        <span class="config-list__label">侧栏</span>
        <el-radio-group v-model="asideTheme" size="mini">
          <el-radio-button label="dark">暗色</el-radio-button>
          <el-radio-button label="white">亮色</el-radio-button>
        </el-radio-group>
      </div>
      <div class="config-list">
        <span class="config-list__label">顶栏</span>
        <el-radio-group v-model="headerTheme" size="mini">
          <el-radio-button label="dark">暗色</el-radio-button>
          <el-radio-button label="white">亮色</el-radio-button>
        </el-radio-group>
      </div>

      <el-divider>整体布局</el-divider>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserCenter',
  data() {
    return {
      layoutConfigDialogShow: false,
      value: false
    }
  },
  computed: {
    ...mapState(['conf', 'userInfo', 'themeConfig']),
    avatarUrl() {
      return this.conf.AppFileDomain + this.userInfo.avatar
    },
    headerTheme: {
      get() {
        return this.themeConfig.header
      },
      set(value) {
        this.$store.dispatch('setThemeConfig', {
          header: value
        })
      }
    },
    asideTheme: {
      get() {
        return this.themeConfig.aside
      },
      set(value) {
        this.$store.dispatch('setThemeConfig', {
          aside: value
        })
      }
    }
  },
  methods: {
    /**
     * 分发事件
     */
    onCommand(type) {
      if (type === 'userCenter') return this.onUserCenter()
      if (type === 'setting') return this.onSetting()
      if (type === 'logOut') return this.onLogOut()
    },
    onUserCenter() {
      this.$router.push('/platform/sys/user/base')
    },
    onSetting() {
      this.layoutConfigDialogShow = true
    },
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

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.user {
  color: inherit;
  outline: none;
  cursor: pointer;
  &-main {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    height: $header-height;
    line-height: $header-height;
  }
  &:hover {
    background-color: #f8f8f9;
  }
  &__name {
    margin-left: 8px;
    font-size: 14px;
  }
}

.dialog-config {
  user-select: none;
  /deep/ .el-drawer__body {
    padding: 0 20px;
  }

  .config-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
  }
}
</style>


