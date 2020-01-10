<script type="text/jsx">
export default {
  name: 'RefreshBtn',
  methods: {
    onRefreshBtn() {
      this.$router.replace('/refresh')
    }
  },
  render(h) {
    return (
      <i class="noa-icon-refresh refresh__btn" onClick={this.onRefreshBtn} />
    )
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.refresh__btn {
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
