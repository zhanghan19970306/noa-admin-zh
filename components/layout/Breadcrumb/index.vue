<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item) in levelList" :key="item.path">
        <span>{{ item.name }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      levelList: [],
      tempList: []
    }
  },

  computed: {
    ...mapState(['userInfo'])
  },
  watch: {
    $route: {
      handler(route) {
        this.$set(this, 'levelList', [])
        this.$set(this, 'tempList', [])

        const currentMenu = this.userInfo.menus.find(
          item => item.href && item.href === route.path
        )
        if (currentMenu) {
          this.tempList.unshift(currentMenu)
          this.getBreadcrumbList(currentMenu)
          this.levelList.push(...this.tempList)
        }
      },
      immediate: true
    }
  },
  methods: {
    getBreadcrumbList(menu) {
      if (menu && menu.parentId) {
        const pMenu = this.userInfo.menus.find(
          item => item.id === menu.parentId
        )
        this.tempList.unshift(pMenu)
        this.getBreadcrumbList(pMenu)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';

.breadcrumb {
  color: inherit;
  padding: 0 12px;
  height: $header-height;
  line-height: $header-height;
}

/deep/ {
  .el-breadcrumb__inner {
    color: inherit;
  }

  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: inherit;
  }
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>