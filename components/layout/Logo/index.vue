<template>
  <div class="logo">
    <img
      v-show="themeConfig.aside === 'dark' && !menuStatus.isCollapse"
      class="logo__logo"
      src="~/assets/images/logo--white.svg"
      alt="logo"
    />
    <img
      v-show="themeConfig.aside === 'dark' && menuStatus.isCollapse"
      class="logo__logo"
      src="~/assets/images/logo--white--small.svg"
      alt="logo"
    />
    <img
      v-show="themeConfig.aside === 'white' && !menuStatus.isCollapse"
      class="logo__logo"
      src="~/assets/images/logo--dark.svg"
      alt="logo"
    />
    <img
      v-show="themeConfig.aside === 'white' && menuStatus.isCollapse"
      class="logo__logo"
      src="~/assets/images/logo--dark--small.svg"
      alt="logo"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['menuStatus', 'themeConfig'])
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: $header-height;
  text-align: center;
  overflow: hidden;
  width: $aside-width;
  transition: width 0.3s ease-in-out;
  &__logo {
    display: block;
    max-width: 100%;
    max-height: 100%;
    transition: all 0.3s ease-in-out;
  }
}

.is-aside--collapse {
  .logo {
    width: $aside-width--collapse;
  }
}
</style>