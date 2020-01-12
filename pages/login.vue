<template>
  <div class="pLogin">
    <header class="pLogin-header">
      <img class="pLogin-header__logo" src="~/assets/images/logo--dark.svg" alt="logo" />
    </header>
    <main class="pLogin-main">
      <div class="pLogin-container">
        <div class="pLogin-left">
          <el-carousel height="560px" :interval="8000" indicator-position="none">
            <el-carousel-item class="pLogin-left__item pLogin-left__item--one" />
            <el-carousel-item class="pLogin-left__item pLogin-left__item--two" />
          </el-carousel>
        </div>
        <div class="pLogin-right">
          <h3 class="pLogin__title">用户登录</h3>

          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            auto-complete="on"
            label-position="left"
            hide-required-asterisk
            size="medium"
          >
            <el-form-item prop="username" label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" type="text" />
            </el-form-item>

            <el-form-item
              prop="password"
              label="登录密码"
              :class="{
                                'f-margin-bottom-15': !mustCaptcha
                            }"
            >
              <el-input
                type="password"
                v-model="loginForm.password"
                placeholder="请输入登录密码"
                show-password
                @keyup.enter.native="doLogin"
              />
            </el-form-item>

            <el-form-item
              v-show="mustCaptcha"
              label="验证码"
              :class="{
                                'f-margin-bottom-15': mustCaptcha
                            }"
            >
              <el-input
                v-model="loginForm.platformCaptcha"
                type="text"
                prop="platformCaptcha"
                class="is-hasCaptcha"
              >
                <img
                  slot="append"
                  class="pLogin__captcha"
                  :src="captchaImg"
                  @click="getCaptchaImg"
                  alt="图形验证码"
                />
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-col :span="12">
                <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
              </el-col>
              <el-col :span="12" class="f-text-align-right">
                <el-link type="primary" :underline="false">忘记密码？</el-link>
              </el-col>
            </el-form-item>

            <el-form-item class="f-margin-top-30 f-margin-bottom-0">
              <el-button
                class="pLogin__btn"
                :loading="loginIng"
                type="primary"
                round
                @click.native.prevent="onLogin"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="pLogin-footer">
      <p class="pLogin-footer__text">© 2019 developed by syrxw,wizzer</p>
    </footer>
  </div>
</template>

<script>
import { API_AUTH_LOGIN, API_AUTH_CAPTCHA } from '@/constant/api/platform/login'
export default {
  layout: 'empty',
  middleware: ['notAuthenticated'],
  data() {
    const validateCaptcha = (rule, value, callback) => {
      if (this.mustCaptcha && (value === '' || typeof value === 'undefined')) {
        callback(new Error('验证码不正确'))
      } else {
        callback()
      }
    }
    return {
      mustCaptcha: false, // 多次账号密码错误后需要输入验证码
      captchaImg: null, // blob对象 图像验证码
      rememberPwd: false, // 是否勾选 记住密码
      loginIng: false, // 是否登录中
      loginForm: {
        username: 'superadmin',
        password: '1'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: `请输入密码`,
            trigger: 'blur'
          }
        ],
        platformCaptcha: [
          {
            validator: validateCaptcha,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getCaptchaImg() {
      this.$axios
        .$get(`${API_AUTH_CAPTCHA}?rnd=${Math.random()}`, {
          responseType: 'blob'
        })
        .then(res => {
          const reader = new FileReader()
          reader.onload = e => (this.captchaImg = e.target.result)
          reader.readAsDataURL(res)
        })
    },
    async onLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loginIng = true

        const { code } = await this.$store.dispatch('login', this.loginForm)

        if (code === 500202) {
          this.loginIng = false
          this.mustCaptcha = true
          return this.getCaptchaImg()
        }

        window.location.href = '/'
      } catch {
        this.loginIng = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pLogin {
  $headerHeight: 60px;
  $footerHeight: 60px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  &-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    &__logo {
      height: 50px;
    }
  }

  &-main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-footer {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    &__text {
      font-size: 14px;
      color: #666;
    }
  }

  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-left {
    width: 420px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    &__item {
      &--one {
        background: url('https://betacdn.lanhuapp.com/web/33223195f85391606b370e043c690812.png')
          left top/100% 100% no-repeat;
      }
      &--two {
        background: url('https://betacdn.lanhuapp.com/web/dcb9b4846321a6ca9a1b904a7dc788bd.png')
          left top/100% 100% no-repeat;
      }
    }
  }

  &-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;
    height: 560px;
    padding: 0 95px 0 75px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(#000, 0.12);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
  }

  &__logoName {
    height: 20px;
  }

  &__title {
    margin: 0 0 52px;
    font-size: 20px;
    color: #333;
    font-weight: 500;
    text-align: center;
  }

  /deep/ {
    .el-form-item {
      margin-bottom: 32px;
      &__label {
        line-height: 1.6;
      }
    }
    .el-input {
      &__inner {
        padding: 0;
        border-left: none;
        border-right: none;
        border-top: none;
        border-radius: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
      &.is-hasCaptcha {
        .el-input-group__append {
          border-top: none;
          border-right: none;
          padding: 2px;
          background-color: transparent;
          border-radius: 0;
        }
      }
    }
  }

  &__captcha {
    display: block;
    height: 30px;
  }

  &__btn {
    width: 100%;
    border-radius: 23px !important;
    height: 46px;
  }
}

@media (max-width: 992px) {
  .pLogin {
    &-left {
      display: none;
    }
  }
}

@media (max-width: 560px) {
  .pLogin {
    &-container {
      width: 100%;
    }
    &-right {
      width: 90%;
      height: auto;
      padding: 30px;
    }
  }
}
</style>
