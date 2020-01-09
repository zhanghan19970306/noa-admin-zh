<template>
    <el-dropdown @command="onCommand">
        <div class="layout__language hover-effect">
            <i class="noa-icon-language" />
        </div>
        <el-dropdown-menu slot="dropdown">
             <el-dropdown-item
                v-for="item in availableLocale"
                :key="item.locale"
                :command="item.locale"
            >
                {{ item.name }}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    import { API_LANG_SET_LANG } from '@/constant/api/open/language'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "Language",
        computed: {
            ...mapState({
                availableLocale: (state) => state.userInfo.lang,
                locale: (state) => state.locale, // 当前语言
                localeData: (state) => state.localeData // 多语言数据
            })
        },
        methods: {
            ...mapActions(['setLocale', 'setLocaleData']),
            async onCommand(lang) {
                this.setLocale(lang)
                try {
                    // 向后台告知 设置的多语言
                    this.$axios.$post(API_LANG_SET_LANG, { lang })
                    // 获取多语言数据包
                    await this.setLocaleData()
                    this.$i18n.locale = this.locale
                    this.$i18n.setLocaleMessage(this.locale, this.localeData)
                } catch {
                    console.log('设置语言失败')
                }
            },
        }
    }
</script>
