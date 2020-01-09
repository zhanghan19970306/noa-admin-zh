<template>
    <div class="layout layout-wrap--horizontal">
        <div class="layout-aside">
            <div class="layout-aside-logo">
                <img
                    class="layout-aside__logo"
                    src="~/assets/images/logo.svg"
                    alt="logo"
                />
            </div>

            <el-tooltip
                v-for="item in userMenus"
                :key="item.id"
                effect="dark"
                :content="item.name"
                placement="right"
            >
                <div
                    class="layout-aside-item"
                    @click="onMenuClick('one', item)"
                >
                    <i :class="iconObjClass(item)" />
                    <span class="layout-aside-item__name">{{ item.name }}</span>
                </div>
            </el-tooltip>
        </div>
        <div class="layout-wrap--vertical">
            <div class="layout-header"></div>
            <div class="layout-container">
                <ul class="layout-twoNavBar">
                    <li
                        :class="{
                            'layout-twoNavBar__item': true,
                            'is-active': menuStatus.twoActiveIndex === item.id
                        }"
                        v-for="item in twoMenus"
                        :key="item.id"
                        @click="onMenuClick('two', item)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
                <div class="layout-wrap--vertical">
                    <ul class="layout-threeNavBar">
                        <li
                            :class="{
                                'layout-threeNavBar__item': true,
                                'is-active':
                                    menuStatus.threeActiveIndex === item.id
                            }"
                            v-for="item in threeMenus"
                            :key="item.id"
                            @click="onMenuClick('three', item)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                    <div class="layout-content">
                        <nuxt />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    computed: {
        ...mapGetters(['userMenus', 'userRoles']),
        ...mapState(['userInfo', 'menuStatus']),
        twoMenus() {
            const currentOneMenu = this.userMenus.find(
                item => item.id === this.menuStatus.oneActiveIndex
            )
            return (currentOneMenu && currentOneMenu.children) || []
        },
        threeMenus() {
            const currentTwoMenu = this.twoMenus.find(
                item => item.id === this.menuStatus.twoActiveIndex
            )
            return (currentTwoMenu && currentTwoMenu.children) || []
        }
    },
    methods: {
        iconObjClass(item) {
            return [
                'layout-aside-item__icon',
                item.icon ? item.icon : 'el-icon-menu'
            ]
        },

        /**
         * 整体逻辑
         * 点击一级菜单
         *      - 如果有链接 跳链接 清空2，3级别菜单
         *      - 就生成二级菜单并且展示 如果二级菜单第一个有链接 跳链接 并且清除3级菜单
         *      - 如果二级菜单的一个没有链接 就生成三级菜单 跳3级菜单的链接
         * @param level
         * @param menuInfo
         */
        onMenuClick(level, menuInfo) {
            if (menuInfo) {
                if (level === 'one') {
                    this.$store.dispatch('setMenuActive', {
                        level,
                        value: menuInfo.id
                    })
                    if (menuInfo.url) {
                        this.$set(this, `twoMenus`, [])
                        this.$set(this, `threeMenus`, [])
                        this.$router.push(menuInfo.url)
                    } else {
                        this.$set(this, `twoMenus`, menuInfo.children)
                        const currentFirstSub = menuInfo.children[0]
                        this.$store.dispatch('setMenuActive', {
                            level: 'two',
                            value: currentFirstSub.id
                        })
                        if (currentFirstSub.url) {
                            this.$set(this, `threeMenus`, [])
                            this.$router.push(menuInfo.children[0].url)
                        } else {
                            this.$set(
                                this,
                                `threeMenus`,
                                currentFirstSub.children
                            )
                            this.$store.dispatch('setMenuActive', {
                                level: 'three',
                                value: currentFirstSub.children[0].id
                            })
                        }
                    }
                }

                if (level === 'two') {
                    this.$store.dispatch('setMenuActive', {
                        level,
                        value: menuInfo.id
                    })
                    if (menuInfo.url) {
                        this.$set(this, `threeMenus`, [])
                        this.$router.push(menuInfo.url)
                    } else {
                        this.$set(this, `threeMenus`, menuInfo.children)
                        this.$store.dispatch('setMenuActive', {
                            level: 'three',
                            value: menuInfo.children[0].id
                        })
                        this.$router.push(menuInfo.children[0].url)
                    }
                }

                if (level === 'three') {
                    this.$store.dispatch('setMenuActive', {
                        level,
                        value: menuInfo.id
                    })
                    this.$router.push(menuInfo.url)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// 大的布局
.layout {
    min-height: 100vh;
    &-wrap {
        // 横
        &--horizontal {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            flex-direction: inherit;
        }
        // 竖
        &--vertical {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            // 这一句 是为了应对 el-table不能自适应宽度 借鉴 https://www.jianshu.com/p/aff226256b06
            overflow: auto;
        }
    }
    &-header {
        height: 50px;
        background-color: #fff;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
        color: #333;
    }
    &-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 20px;
        border: 1px solid #d3dbe5;
        background-color: #fff;
    }
    &-aside {
        background-color: #0d1319;
        box-shadow: 1px 0 6px rgba(#000, 0.08);
    }
    &-twoNavBar {
        margin: 0;
        padding: 0;
        background-color: #e2e8ef;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0;
        margin: 0;
        &__item {
            border-left: 1px solid #d3dbe5;
            border-right: 1px solid #d3dbe5;
            margin-left: -1px;
            font-size: 14px;
            color: #666;
            padding: 0 30px;
            list-style: none;
            line-height: 44px;
            cursor: pointer;
            position: relative;
            &:after {
                content: '';
                width: 100%;
                height: 0;
                background-color: #085bcb;
                position: absolute;
                top: -1px;
                left: 0;
                transition: height 0.3s;
            }
            &.is-active {
                // font-family: $font2;
                background-color: #fff;
                color: #333;
                &:after {
                    height: 2px;
                }
            }
            &:hover {
                color: #333;
            }
        }
    }
    &-threeNavBar {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        margin: 12px 20px 10px;
        padding: 0;
        border-bottom: 1px solid #e7eaef;
        &:empty {
            display: none;
        }
        &__item {
            list-style: none;
            font-size: 14px;
            color: #666;
            margin: 0 20px;
            padding: 7px 0;
            cursor: pointer;
            position: relative;
            &:after {
                content: '';
                position: absolute;
                left: 0;
                bottom: -1px;
                width: 100%;
                height: 0;
                background-color: #085bcb;
                transition: height 0.3s;
            }
            &:first-child {
                margin-left: 0;
            }
            &.is-active {
                // font-family: $font2;
                color: #333;
                &:after {
                    height: 2px;
                }
            }
            &:hover {
                color: #333;
            }
        }
    }
    &-content {
        flex: 1;
        padding: 20px;
        background-color: #fff;
    }
}

.layout-header {
    &-right {
        float: right;
        display: flex;
        justify-content: flex-end;
    }
    &__goUrl {
        position: relative;
        display: inline-block;
        height: 50px;
        line-height: 50px;
        padding: 0 34px;
        color: #fff;
        &:after {
            content: '';
            width: 1px;
            height: 22px;
            background-color: #4d4c5d;
            position: absolute;
            right: -0.5px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    &-message {
        .el-popover__reference {
            line-height: 50px;
            font-size: 18px;
            padding: 0 20px;
        }
        .el-badge__content.is-fixed {
            top: 20px;
            right: 25px;
        }
    }
    &-user {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 20px 0 16px;
        &__name {
            display: inline-block;
            margin-left: 6px;
        }
    }
    .hover-effect {
        cursor: pointer;
        &:hover {
            background-color: #f2f5f8;
        }
    }
}

.layout-aside {
    &-logo {
        padding: 18px 0;
        background-color: #085bcb;
    }
    &__logo {
        display: block;
        margin: 0 auto;
        width: 130px;
    }
    &.is-collapse {
        overflow: hidden;
        .layout-aside {
            &__logo {
                width: 56px;
            }
            &-item {
                width: 56px;
                &__name {
                    display: none;
                }
                &.is-active:after {
                    display: none;
                }
            }
        }
    }
    &__toggle {
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        color: #c9c9dd;
        cursor: pointer;
    }
    &-item {
        width: 166px;
        position: relative;
        padding: 0 20px;
        line-height: 44px;
        cursor: pointer;
        white-space: nowrap;
        &:before {
            content: '';
            position: absolute;
            left: 0;
            width: 0;
            height: 100%;
            background-color: #085bcb;
            transition: width 0.5s;
        }
        &:hover {
            background-color: #514f64;
        }

        &__icon {
            font-size: 15px;
            color: #a0afbc;
        }
        &__name {
            white-space: nowrap;
            margin-left: 8px;
            color: #a0afbc;
        }

        &.is-active {
            // font-family: $font2;
            background-color: #0b2f60;
            .layout-aside-item__icon,
            .layout-aside-item__name {
                color: #fff;
            }
            &:before {
                width: 4px;
            }
            &:after {
                content: '\e6e0';
                color: #fff;
                font-family: element-icons, serif !important;
                position: absolute;
                right: 20px;
            }
        }
    }
}
</style>
