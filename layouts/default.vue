<template>
  <div :class="layoutObj">
    <div class="layout-aside">
      <div class="layout-logo">
        <img
          v-show="!menuStatus.isCollapse"
          class="layout-logo__logo"
          src="~/assets/images/logo--white.svg"
          alt="logo"
        />
        <img
          v-show="menuStatus.isCollapse"
          class="layout-logo__logo"
          src="~/assets/images/logo--white--small.svg"
          alt="logo"
        />
      </div>
      <el-scrollbar class="layout-nav">
        <el-menu
          router
          :default-active="$route.path"
          background-color="#3a3a4b"
          text-color="#fff"
          unique-opened
          :collapse="menuStatus.isCollapse"
        >
          <template v-for="item in userMenus">
            <template v-if="item.url">
              <el-menu-item :index="item.url" :key="item.id">
                <i :class="`${ item.icon }`" />
                <span slot="title">{{ $t(`${item.alias}`) }}</span>
              </el-menu-item>
            </template>
            <template v-else>
              <el-submenu :index="item.treePath" :key="item.id">
                <template slot="title">
                  <i :class="`${ item.icon }`" />
                  <span>{{ $t(`${item.alias}`) }}</span>
                </template>
                <template v-for="ite in item.children">
                  <template v-if="ite.url">
                    <el-menu-item :index="ite.url" :key="ite.id">
                      <i :class="`${ ite.icon }`" />
                      <span>{{ $t(`${ite.alias}`) }}</span>
                    </el-menu-item>
                  </template>
                  <template v-else>
                    <el-submenu :index="ite.treePath" :key="ite.id">
                      <template slot="title">
                        <i :class="`${ ite.icon }`" />
                        <span>{{ $t(`${ite.alias}`) }}</span>
                      </template>
                      <template v-for="it in ite.children">
                        <el-menu-item :index="it.url" :key="it.id">
                          <i :class="`${ it.icon }`" />
                          <span>{{ $t(`${it.alias}`) }}</span>
                        </el-menu-item>
                      </template>
                    </el-submenu>
                  </template>
                </template>
              </el-submenu>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout-header">
      <collapse-btn />
      <refresh-btn />
      <div class="layout-header__placeholder" />
      <full-screen />
      <help-btn />
      <language />
      <msg-center />
      <user-center />
    </div>
    <div class="layout-main">
      <nuxt />
    </div>
  </div>
</template>

<script>
import CollapseBtn from '@/components/layout/CollapseBtn'
import RefreshBtn from '@/components/layout/refreshBtn'
import FullScreen from '@/components/layout/FullScreen'
import HelpBtn from '@/components/layout/HelpBtn'
import Language from '@/components/layout/Language'
import UserCenter from '@/components/layout/UserCenter'
import MsgCenter from '@/components/layout/MsgCenter'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    RefreshBtn,
    CollapseBtn,
    FullScreen,
    HelpBtn,
    Language,
    UserCenter,
    MsgCenter
  },
  computed: {
    ...mapGetters(['userMenus', 'userRoles']),
    ...mapState(['menuStatus']),
    layoutObj() {
      return {
        layout: true,
        'is-asideCollapse': this.menuStatus.isCollapse
      }
    }
  },
  created() {
    // 同步菜单状态
    const menuStatus = this.$cookies.get('menuStatus')
    if (menuStatus) this.$store.dispatch('setMenuStatus', menuStatus)
  }
}
</script>

<style lang="scss" scoped>
$name: '.layout';
$aside-width: 200px;
$aside-width--collapse: 64px;
$header-height: 52px;
.layout {
  &.is-asideCollapse {
    #{$name} {
      &-header {
        left: $aside-width--collapse;
      }
      &-main {
        padding-left: $aside-width--collapse;
      }
    }
  }

  // 三大主体结构-侧栏
  &-aside {
    position: fixed;
    z-index: 101;
    top: 0;
    bottom: 0;
    min-height: 100vh;
    background-color: #3a3a4b;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  }
  // 三大主体结构-顶栏
  &-header {
    position: fixed;
    z-index: 100;
    left: $aside-width;
    right: 0;
    height: $header-height;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    transition: left 0.3s ease-in-out;
    user-select: none;
  }

  // 三大主体结构-主体
  &-main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: $header-height;
    padding-left: $aside-width;
    transition: padding-left 0.3s ease-in-out;
  }

  // 侧栏中的logo
  &-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $header-height;
    text-align: center;
    border-bottom: 1px solid rgba(#333, 0.8);
    &__logo {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }

  // 侧栏中的nav
  &-nav {
    user-select: none;
    height: calc(100vh - #{$header-height});
    overflow-x: hidden;
  }

  // 顶栏中间占位符
  &-header__placeholder {
    flex: 1 1 auto;
  }
}
</style>
