<script type="text/jsx">
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "CollapseBtn",
        computed: {
            ...mapState(['menuStatus']),
            isCollapse () {
                return this.menuStatus.isCollapse
            }
        },
        methods: {
            ...mapActions(['setMenuStatus']),
            toggleCollapse() {
                this.setMenuStatus({ isCollapse: !this.isCollapse})
            },
        },
        render (h) {
            let iClass = ['layout__collapse', 'hover-effect', this.isCollapse? 'noa-icon-unfold' :'noa-icon-fold'];
            return <i class={ iClass } onClick={this.toggleCollapse} />
        }
    }
</script>
