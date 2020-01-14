<template>
  <li class="dataInfo-item">
    <i v-if="icon" :class="{
        dataInfo__icon: true,
        [icon]: true 
    }"></i>
    <slot v-if="$slots.default" />
    <div class="dataInfo-content" v-else>
      <p class="dataInfo__label">{{ label }}</p>
      <p class="dataInfo__value">{{ value }}</p>
    </div>
  </li>
</template>

<script>
export default {
  name: 'DataInfoItem',
  props: {
    icon: {
      type: String
    },
    label: {
      type: String
    },
    value: {
      type: Number
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/core/var';
.dataInfo {
  &-item {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0 10px;
    list-style: none;
    &:not(:first-child) {
      border-left: 1px dashed #eee;
    }
  }

  &__icon {
    margin: 8px;
    font-size: 28px;
    + .dataInfo-content {
      margin-left: 16px;
      text-align: left;
    }
  }

  &-content {
    text-align: center;
  }

  &__label {
    margin: 8px 0;
    color: #666;
    line-height: 1.2;
  }
  &__value {
    margin: 8px 0;
    color: #333;
    font-size: 28px;
    font-family: $font-weight;
    line-height: 1.2;
  }
}
</style>