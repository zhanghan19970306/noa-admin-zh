<template>
  <el-dropdown class="language" @command="onCommand">
    <i class="noa-icon-language language__icon" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :class="{
          'is-active': locale === item.locale
        }"
        v-for="item in availableLocale"
        :key="item.locale"
        :command="item.locale"
      >{{ item.name }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { API_LANG_SET_LANG } from '@/constant/api/open/language'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Language',
  computed: {
    ...mapState({
      availableLocale: state => state.userInfo.lang,
      locale: state => state.locale, // 当前语言
      localeData: state => state.localeData // 多语言数据
    })
  },
  methods: {
    ...mapActions(['setLocale', 'setLocaleData']),
    async onCommand(lang) {
      this.setLocale(lang)
      try {
        // 向后台告知 设置的多语言
        this.$axios.$post(API_LANG_SET_LANG, { lang })
        // 获取多语言数据包
        await this.setLocaleData()
        this.$i18n.locale = this.locale
        this.$i18n.setLocaleMessage(this.locale, this.localeData)
      } catch {
        console.log('设置语言失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.language {
  color: inherit;
  outline: none;
  cursor: pointer;
  &__icon {
    padding: 0 12px;
    height: $header-height;
    line-height: $header-height;
  }
  &:hover {
    background-color: #f8f8f9;
  }
}

/deep/ {
  .el-dropdown-menu__item {
    &.is-active {
      background-color: #ecf5ff;
      color: #66b1ff;
    }
  }
}
</style>


