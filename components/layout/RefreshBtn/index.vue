<script type="text/jsx">
    export default {
        name: "RefreshBtn",
        methods: {
            onRefreshBtn() {
                this.$router.replace('/refresh')
            }
        },
        render (h) {
            return <i class="noa-icon-refresh layout__refresh hover-effect" onClick={this.onRefreshBtn} />
        }
    }
</script>
