<script type="text/jsx">
    /**
     * 这个页面是为了满足 刷新功能
     */
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => vm.$router.replace({...from}))
        },
        render(createElement, context) {
            return <div />
        }
    }
</script>
