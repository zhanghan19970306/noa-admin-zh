<script type="text/jsx">
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CollapseBtn',
  computed: {
    ...mapState(['menuStatus']),
    isCollapse() {
      return this.menuStatus.isCollapse
    }
  },
  methods: {
    ...mapActions(['setMenuStatus']),
    toggleCollapse() {
      this.setMenuStatus({ isCollapse: !this.isCollapse })
    }
  },
  render(h) {
    let iClass = [
      'collapse__btn',
      this.isCollapse ? 'noa-icon-unfold' : 'noa-icon-fold'
    ]
    return <i class={iClass} onClick={this.toggleCollapse} />
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
.collapse__btn {
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