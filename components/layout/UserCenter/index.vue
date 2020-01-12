<template>
  <div>
    <el-dropdown @command="onCommand">
      <div class="user">
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

      <el-divider>整体布局</el-divider>
      <div class="config-list">
        <span class="config-list__label">固定侧栏</span>
        <el-switch v-model="value" />
      </div>
      <div class="config-list">
        <span class="config-list__label">固定顶栏</span>
        <el-switch v-model="value" />
      </div>
      <div class="config-list">
        <span class="config-list__label">菜单开启手风琴模式</span>
        <el-switch v-model="value" />
      </div>
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
    ...mapState(['conf', 'userInfo']),
    avatarUrl() {
      return this.conf.AppFileDomain + this.userInfo.avatar
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
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 16px;
  padding: 0 12px;
  height: $header-height;
  line-height: $header-height;
  outline: none;
  cursor: pointer;
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


