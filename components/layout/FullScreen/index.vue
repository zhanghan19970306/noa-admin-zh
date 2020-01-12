<script type="text/jsx">
import screenfull from 'screenfull'
export default {
  name: 'FullScreen',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  },
  render(h) {
    let iClass = [
      'fullScreen__btn',
      this.isFullscreen ? 'noa-icon-zoom-minus' : 'noa-icon-zoom-plus'
    ]
    return <i class={iClass} onClick={this.click} />
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.fullScreen__btn {
  padding: 0 12px;
  height: $header-height;
  line-height: $header-height;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f9;
  }
}
</style>
