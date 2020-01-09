<template>
    <el-popover
        width="280"
        trigger="hover"
        transition="el-zoom-in-top"
        class="layout__message hover-effect"
    >
        <template v-if="message.list.length > 0">
            <a v-for="(item,index) in message.list" :key="index">
                <p class="topBar-right-msg__title">{{item.title}}</p>
                <p class="topBar-right-msg__time">{{item.time}}</p>
            </a>
        </template>
        <el-badge is-dot :hidden="message.list.length === 0" slot="reference">
            <i class="noa-icon-message" />
        </el-badge>
    </el-popover>
</template>

<script>
    export default {
        data() {
            return {
                message: {
                    list: [{
                        title: '手动测试标题',
                        time: '手动测试时间'
                    }]
                }
            }
        }
    }
</script>
