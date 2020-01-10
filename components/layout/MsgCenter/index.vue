<template>
  <el-popover
    width="300"
    trigger="hover"
    transition="el-zoom-in-top"
    class="message"
    popper-class="message-popper"
  >
    <div class="message-header">{{ $t('platform.home.notifications') }}</div>
    <div class="message-main">
      <template v-if="message.list.length > 0">
        <nuxt-link
          tag="a"
          :to="`/platform/sys/message`"
          v-for="(item,index) in message.list"
          :key="index"
          class="message-item"
        >
          <p class="message__title">{{item.title}}</p>
          <p class="message__time">{{item.time}}</p>
        </nuxt-link>
      </template>
    </div>
    <div class="message-footer">
      <nuxt-link tag="a" :to="`/platform/sys/message`" class="message__more">查看更多</nuxt-link>
    </div>

    <el-badge is-dot :hidden="message.list.length === 0" slot="reference">
      <i class="noa-icon-message" />
    </el-badge>
  </el-popover>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      ws: null,
      message: {
        size: 0,
        list: []
      }
    }
  },
  computed: {
    ...mapState(['conf', 'userInfo'])
  },
  methods: {
    wsConnect() {
      let supportNotification = true
      // 后台配置未启用ws则不进行初始化
      if (this.conf.AppWebSocket === 'false') {
        return false
      }
      this.ws = new WebSocket(process.env.WS_URL)
      this.ws.onopen = event => {
        this.ws.send(
          JSON.stringify({
            room: this.userInfo.loginname,
            uid: this.userInfo.id,
            action: 'join',
            token: this.$cookies.get('X-Token')
          })
        )
      }
      // 浏览器是否支持桌面通知,后台配置未启用则不进行桌面通知
      if (
        !('Notification' in window) ||
        this.conf.AppWebBrowserNotice === 'false'
      ) {
        supportNotification = false
      }
      if (supportNotification) {
        // 用户是否授权桌面通知
        if (Notification.permission === 'granted') {
          this.sendWelcome()
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission(permission => {
            this.sendWelcome()
          })
        }
      }
      this.ws.onmessage = event => {
        let re = JSON.parse(event.data)
        // 接受新消息
        if (
          re.action === 'notify' &&
          supportNotification &&
          Notification.permission === 'granted'
        ) {
          var n = new Notification(this.$t(`sys.manage.msg.title.new`), {
            dir: 'auto',
            tag: re.id,
            body: re.title
          })
          var _self = this
          n.onclick = function(event) {
            if (re.url) {
              _self.$router.push(re.url)
            } else {
              _self.$router.push('/notifications')
            }
          }
        } else if (re.action === 'offline') {
          // 账号下线通知
          this.$alert(
            this.$t(`sys.manage.msg.offline`),
            this.$t(`sys.manage.msg.title.offline`),
            {
              confirmButtonText: this.$t(`system.commons.button.ok`),
              callback: action => {
                this.logout()
              }
            }
          )
          this.ws.close()
        } else if (re.action === 'notice') {
          // 消息通知
          this.message.size = re.size
          this.$set(this.message, 'list', re.list)
        }
      }
      setTimeout(this.wsPing, 1250)
      // 猜猜11624317是啥
      setInterval(this.wsPing, 11624317 / 1000)
      // 以下判断是否关闭浏览器,然后从room里删除
      var _beforeUnload_time = 0
      var _gap_time = 0
      // 是否是火狐浏览器
      var is_fireFox = navigator.userAgent.indexOf('Firefox') > -1
      window.onunload = () => {
        _gap_time = new Date().getTime() - _beforeUnload_time
        if (_gap_time <= 5) {
          this.ws.send(
            JSON.stringify({
              room: this.userInfo.loginname,
              uid: this.userInfo.id,
              action: 'left',
              token: this.$cookies.get('X-Token')
            })
          )
        } else {
          // 浏览器刷新
        }
      }
      window.onbeforeunload = () => {
        _beforeUnload_time = new Date().getTime()
        if (is_fireFox) {
          // 火狐关闭执行,但是IE关闭好像不起作用 todo
          this.ws.send(
            JSON.stringify({
              room: this.userInfo.loginname,
              uid: this.userInfo.id,
              action: 'left',
              token: this.$cookies.get('X-Token')
            })
          )
        }
      }
    },
    wsPing() {
      if (this.ws) {
        // 获取最新消息通知
        this.ws.send(
          JSON.stringify({
            room: this.userInfo.loginname,
            uid: this.userInfo.id,
            action: 'msg',
            token: this.$cookies.get('X-Token')
          })
        )
      } else {
        this.wsConnect()
      }
    },
    sendWelcome() {
      // 仅第一次访问弹出
      if (parseInt(this.userInfo.loginCount) > 0) {
        return false
      }
      new Notification(
        this.$t(`sys.manage.msg.browser.desktop.welcome`, {
          name: this.userInfo.logginame
        }),
        {
          dir: 'auto',
          tag: 'welcome',
          body: this.$t(`sys.manage.msg.browser.desktop.budwk`)
        }
      )
    }
  },
  created() {
    this.wsConnect()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/core/var';
$name: '.message';
#{$name} {
  padding: 0;
  color: #666;
  font-size: 16px;
  height: $header-height;
  line-height: $header-height;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f9;
  }
  &-header {
    padding: 15px 25px;
    border-bottom: 1px solid #eee;
  }
  &-footer {
    padding: 15px 25px;
    text-align: center;
  }

  &-item {
    margin-top: -1px;
    display: block;
    padding: 0 25px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    text-decoration: none;
    overflow: hidden;
    &:hover {
      background-color: #eee;
    }
  }
  &__title {
    margin: 8px 0;
    color: #333;
  }
  &__time {
    margin: 8px 0;
    color: #999;
    font-size: 13px;
  }

  &__more {
    color: #409eff;
    text-decoration: none;
  }

  /deep/ {
    .el-popover__reference {
      display: block;
      outline: none;
      padding: 0 12px;
    }
    .el-badge__content.is-fixed {
      top: 16px;
      right: 16px;
    }
  }
}
</style>