<template>
  <div :class="objClass">
    <i class="search-icon el-icon-search" @click="toggleShow(true)" />
    <el-select
      ref="headerSearchSelect"
      size="small"
      v-model="search"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="search-select"
      @blur="toggleShow(false)"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      isShow: false,
      search: '',
      options: []
    }
  },
  computed: {
    objClass() {
      return {
        search: true,
        'is-show': this.isShow
      }
    }
  },
  methods: {
    toggleShow(isShow) {
      this.isShow = isShow
      if (isShow === true) {
        this.$refs.headerSearchSelect.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.search {
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  outline: none;
  cursor: pointer;
  &:not(.is-show):hover {
    background-color: #f8f8f9;
  }
  .search-icon {
    padding: 0 12px;
    cursor: pointer;
    height: $header-height;
    line-height: $header-height;
    font-size: 16px;
  }
  .search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border: none;
      vertical-align: middle;
      background-color: transparent;
    }
  }
  &.is-show {
    .search-select {
      width: 210px;
    }
  }
}
</style>