<template>
  <div :class="layoutObj">
    <div class="layout-aside">
      <logo />
      <el-scrollbar class="layout-nav">
        <el-menu
          router
          :default-active="$route.path"
          :background-color="navColor.bgColor"
          :text-color="navColor.color"
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
      <breadcrumb />
      <div class="layout-header__placeholder" />
      <search />
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
import {
  asideBgColorWhite,
  asideColorWhite,
  asideBgColorDark,
  asideColorDark
} from '../assets/scss/core/_var.scss'
import Logo from '@/components/layout/Logo'
import CollapseBtn from '@/components/layout/CollapseBtn'
import RefreshBtn from '@/components/layout/refreshBtn'
import FullScreen from '@/components/layout/FullScreen'
import HelpBtn from '@/components/layout/HelpBtn'
import Language from '@/components/layout/Language'
import UserCenter from '@/components/layout/UserCenter'
import MsgCenter from '@/components/layout/MsgCenter'
import Search from '@/components/layout/Search'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Logo,
    RefreshBtn,
    CollapseBtn,
    Breadcrumb,
    FullScreen,
    HelpBtn,
    Language,
    UserCenter,
    MsgCenter,
    Search
  },
  computed: {
    ...mapGetters(['userMenus', 'userRoles']),
    ...mapState(['menuStatus', 'themeConfig']),
    layoutObj() {
      return {
        layout: true,
        [`is-aside--${this.themeConfig.aside}`]: true,
        [`is-header--${this.themeConfig.header}`]: true,
        'is-aside--collapse': this.menuStatus.isCollapse
      }
    },
    navColor() {
      if (this.themeConfig.aside === 'dark') {
        return {
          color: asideColorDark,
          bgColor: asideBgColorDark
        }
      }

      if (this.themeConfig.aside === 'white') {
        return {
          color: asideColorWhite,
          bgColor: asideBgColorWhite
        }
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
@import '../assets/scss/core/var';
$name: '.layout';
.layout {
  &.is-aside--collapse {
    #{$name} {
      &-header {
        left: $aside-width--collapse;
      }
      &-main {
        padding-left: $aside-width--collapse;
      }
    }
  }

  &.is-aside--white {
    #{$name} {
      &-aside {
        background-color: $aside-bg-color-white;
      }
    }
  }

  &.is-aside--dark {
    #{$name} {
      &-aside {
        background-color: $aside-bg-color-dark;
      }
    }
  }

  &.is-header--white {
    #{$name} {
      &-header {
        color: $header-color-white;
        background-color: $header-bg-color-white;
      }
    }
  }

  &.is-header--dark {
    #{$name} {
      &-header {
        color: $header-color-dark;
        background-color: $header-bg-color-dark;
      }
    }
    /deep/ {
      .collapse__btn,
      .refresh__btn,
      .fullScreen__btn,
      .help__btn,
      .language,
      .search:not(.is-show),
      .message,
      .user {
        &:hover {
          background-color: rgba($header-color-white, 0.6);
        }
      }
    }
  }

  // 三大主体结构-侧栏
  &-aside {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    min-height: 100vh;
  }

  // 三大主体结构-顶栏
  &-header {
    position: fixed;
    z-index: 100;
    left: $aside-width;
    right: 0;
    font-size: 16px;
    height: $header-height;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: left 0.3s ease-in-out;
    user-select: none;
  }

  // 三大主体结构-主体
  &-main {
    z-index: 99;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: $header-height;
    padding-left: $aside-width;
    transition: padding-left 0.3s ease-in-out;
  }

  // 侧栏中的nav 外面那层滚动条组件需要的容器
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
