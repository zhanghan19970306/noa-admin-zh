<template>
  <div class="logo">
    <img
      v-show="!menuStatus.isCollapse"
      class="logo__logo"
      src="~/assets/images/logo--white.svg"
      alt="logo"
    />
    <img
      v-show="menuStatus.isCollapse"
      class="logo__logo"
      src="~/assets/images/logo--white--small.svg"
      alt="logo"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['menuStatus'])
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
  border-bottom: 1px solid rgba(#333, 0.8);
  &__logo {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>