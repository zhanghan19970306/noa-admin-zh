<template>
  <div>
    <el-card shadow="never">
      <template slot="header">
        <el-breadcrumb>
          <el-breadcrumb-item>{{
            $t(`sys.user.change.account`)
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t(`sys.user.change.base`)" name="base">
          <el-row>
            <el-col :xs="24" :sm="21" :md="18" :lg="15" :xl="12">
              <el-form
                ref="infoForm"
                :model="sysUserInfoData"
                :rules="infoRules"
                label-width="120px"
              >
                <el-form-item
                  prop="username"
                  :label="$t(`sys.user.change.info.username`)"
                >
                  <el-input
                    v-model="sysUserInfoData.username"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item
                  prop="email"
                  :label="$t(`sys.user.change.info.email`)"
                >
                  <el-input
                    v-model="sysUserInfoData.email"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item
                  prop="mobile"
                  :label="$t(`sys.user.change.info.mobile`)"
                >
                  <el-input
                    v-model="sysUserInfoData.mobile"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="submit"
                    :loading="btnLoadding"
                    @click="doChangeInfo"
                  >{{
                    $t(
                      `system.commons.button.save.mini`
                    )
                  }}</el-button>
                </el-form-item></el-form>
            </el-col></el-row>
        </el-tab-pane>
        <el-tab-pane
          :label="$t(`sys.user.change.avatar`)"
          name="avatar"
        >
          <el-row>
            <el-col :xs="24" :sm="21" :md="18" :lg="15" :xl="12">
              <el-form size="medium" label-width="100px">
                <el-form-item>
                  <el-avatar
                    shape="square"
                    :size="120"
                    :src="avatar"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    :action="uploadUrl"
                    name="Filedata"
                    limit:1
                    :before-upload="beforeFileUpload"
                    :show-file-list="false"
                    :on-success="
                      (resp, file) => {
                        return handleUploadSuccess(
                          resp,
                          file
                        )
                      }
                    "
                  >
                    <el-button
                      icon="el-icon-upload"
                      size="small"
                    >上传头像</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="$t(`sys.user.change.cpwd`)" name="pwd">
          <el-row>
            <el-col :xs="24" :sm="21" :md="18" :lg="15" :xl="12">
              <el-form
                ref="pwdForm"
                :model="sysUserPwdData"
                :rules="pwdRules"
                label-width="125px"
              >
                <el-form-item
                  prop="oldPassword"
                  :label="
                    $t(`sys.user.change.pwd.oldPassword`)
                  "
                >
                  <el-input
                    v-model="sysUserPwdData.oldPassword"
                    tabindex="1"
                    type="password"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item
                  prop="newPassword"
                  :label="
                    $t(`sys.user.change.pwd.newPassword`)
                  "
                  label-width="125px"
                >
                  <el-input
                    v-model="sysUserPwdData.newPassword"
                    tabindex="2"
                    type="password"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item
                  prop="passwordAgain"
                  :label="
                    $t(`sys.user.change.pwd.passwordAgain`)
                  "
                  label-width="125px"
                >
                  <el-input
                    v-model="sysUserPwdData.passwordAgain"
                    autocomplete="off"
                    tabindex="3"
                    type="password"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="submit"
                    :loading="btnLoadding"
                    @click="doChangePwd"
                  >{{
                    $t(
                      `system.commons.button.save.mini`
                    )
                  }}</el-button>
                </el-form-item></el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkMobile } from '@/utils/validate'
import { API_UPLOAD_IMAGE } from '@/constant/api/platform/pub/upload'
import {
  API_SYS_USER_CHANGE_PWD,
  API_SYS_USER_CHANGE_INFO,
  API_SYS_USER_SET_AVATAR
} from '@/constant/api/platform/sys/user'
export default {
  data() {
    return {
      btnLoadding: false,
      activeName: 'base',
      btnLoading: false,
      sysUserInfoData: {},
      sysUserPwdData: {},
      uploadUrl: process.env.API + API_UPLOAD_IMAGE, // 图片上传路径
      avatar: ''
    }
  },
  computed: {
    ...mapState({
      conf: (state) => state.conf, // 后台配置参数
      siteInfo: (state) => state.siteInfo, // 平台信息
      userInfo: (state) => state.userInfo // 用户信息
    }),
    infoRules() {
      const infoRules = {
        username: [
          {
            required: true,
            message: this.$t(`sys.user.change.info.usernameCheck`),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: false,
            type: 'email',
            message: this.$t(`sys.user.change.info.emailCheck`),
            trigger: 'blur'
          }
        ],
        mobile: [{ validator: this.validateMobile, trigger: 'blur' }]
      }
      return infoRules
    },
    pwdRules() {
      const pwdRules = {
        oldPassword: [
          {
            required: true,
            message: this.$t(`sys.user.change.pwd.inputOldPwd`),
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: this.$t(`sys.user.change.pwd.inputNewPwd`),
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: this.$t(`sys.user.change.pwd.pwdLength`),
            trigger: 'change'
          }
        ],
        passwordAgain: [
          {
            required: true,
            message: this.$t(`sys.user.change.pwd.inputAgain`),
            trigger: 'blur'
          },
          { validator: this.validatePwdAgain, trigger: 'change' }
        ]
      }
      return pwdRules
    }
  },
  created() {
    this.initUserInfo()
  },
  methods: {
    // 手机号码验证
    validateMobile(rule, value, callback) {
      if (value && !checkMobile(value)) {
        return callback(
          new Error(this.$t(`sys.user.change.info.mobileCheck`))
        )
      } else {
        callback()
      }
    },
    // 密码验证
    validatePwdAgain(rule, value, callback) {
      if (value !== this.sysUserPwdData.newPassword) {
        callback(new Error(this.$t(`sys.user.change.pwd.towPwdError`)))
      } else {
        callback()
      }
    },
    // 初始化用户信息
    initUserInfo() {
      this.sysUserInfoData = JSON.parse(
        JSON.stringify(this.userInfo)
      )
      if (this.userInfo.avatar) {
        this.avatar = this.conf.AppFileDomain + this.userInfo.avatar
      }
    },
    // 提交修改用户信息
    doChangeInfo() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_USER_CHANGE_INFO, this.sysUserInfoData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.dialogUserInfoVisible = false
              }
            })
        }
      })
    },
    // 提交修改密码
    doChangePwd() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_USER_CHANGE_PWD, this.sysUserPwdData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.dialogUserPwdVisible = false
              }
            })
        }
      })
    },
    // 文件上传成功后进行保存
    handleUploadSuccess(resp, file) {
      var file_url = resp.data.file_url
      this.$axios
        .$post(API_SYS_USER_SET_AVATAR, { avatar: file_url })
        .then((d) => {
          if (d.code === 0) {
            this.$message({
              message: d.msg,
              type: 'success'
            })
            this.avatar = this.conf.AppFileDomain + file_url
          }
        })
    },
    // 上传之前判断文件格式及大小
    beforeFileUpload(file) {
      var isJPG = file.type === 'image/jpeg'
      var isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error(this.$t(`sys.user.change.avatar.file.type`))
        return false
      }
      var isLt20M = file.size / 1024 / 1024 < 2
      if (!isLt20M) {
        this.$message.error(this.$t(`sys.user.change.avatar.file.size`))
        return false
      }
      return true
    }
  }
}
</script>
