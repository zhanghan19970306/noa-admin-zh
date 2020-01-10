<template>
  <nuxt-link to="/help" tag="i" class="noa-icon-help help__btn" />
</template>

<script>
export default {
  name: 'HelpBtn'
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.help__btn {
  color: #666;
  font-size: 16px;
  padding: 0 12px;
  height: $header-height;
  line-height: $header-height;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f9;
  }
}
</style>
