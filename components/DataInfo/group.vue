<template>
  <ul class="dataInfo-group">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'DataInfoGroup'
}
</script>

<style lang="scss" scoped>
.dataInfo-group {
  padding: 0;
  display: flex;
  background-color: #fff;
  padding: 20px 0;
}
</style>