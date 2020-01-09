<template>
  <el-card class="f-flex-1 f-margin-10">
    <el-container>
      <el-header>
        <el-button
          v-permission="'sys.manage.user.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >{{ $t(`sys.manage.user.create`) }}</el-button>

        <el-button
          v-permission="'sys.manage.user.delete'"
          size="small"
          type="danger"
          :disabled="userSelectData.length === 0"
          @click="deleteMore"
        >{{ $t(`sys.manage.user.delete`) }}</el-button>

        <el-button
          v-permission="'sys.manage.user.export'"
          size="small"
          type="default"
          @click="exportUser"
        >{{ $t(`sys.manage.user.export`) }}</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-tree
            ref="unitTree"
            node-key="id"
            :data="treeData"
            :props="treeProps"
            :current-node-key="'root'"
            @current-change="unitChange"
          />
        </el-aside>
         <el-divider direction="vertical" />
        <el-main>
          <el-form :inline="true" :model="pageData" class="platform-content-search-form">
            <el-form-item :label="$t(`sys.manage.user.form.loginname`)">
              <el-input
                v-model="pageData.loginname"
                :placeholder="
                    $t(`sys.manage.user.form.loginname`)
                  "
                class="platform-content-search-input"
                @keyup.enter.native="doSearch"
              />
            </el-form-item>
            <el-form-item :label="$t(`sys.manage.user.form.username`)">
              <el-input
                v-model="pageData.username"
                :placeholder="
                    $t(`sys.manage.user.form.username`)
                  "
                class="platform-content-search-input"
                @keyup.enter.native="doSearch"
              />
            </el-form-item>
            <el-form-item :label="$t(`sys.manage.user.form.mobile`)">
              <el-input
                v-model="pageData.mobile"
                :placeholder="
                    $t(`sys.manage.user.form.mobile`)
                  "
                class="platform-content-search-input"
                @keyup.enter.native="doSearch"
              />
            </el-form-item>
            <div class="platform-content-search-op">
              <el-button
                size="small"
                type="primary"
                @click="doSearch"
              >{{ $t(`system.commons.button.search`) }}</el-button>
            </div>
          </el-form>

          <el-table
            ref="userTable"
            v-loading="listLoading"
            :data="listData"
            :default-sort="{
                  prop: 'createdAt',
                  order: 'descending'
                }"
            stripe
            @sort-change="doPageSort"
            @selection-change="userSelectChange"
            @row-click="userRowClick"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand" size="mini">
                  <el-form-item label="Email">
                    <span>
                      {{
                      scope.row.email
                      }}
                    </span>
                  </el-form-item>
                  <el-form-item label="最后登录时间">
                    <span>
                      {{
                      scope.row.loginAt
                      | moment("datetime")
                      }}
                    </span>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <span>
                      {{
                      scope.row.mobile
                      }}
                    </span>
                  </el-form-item>
                  <el-form-item label="最后登录IP">
                    <span>
                      {{
                      scope.row.loginIp
                      }}
                    </span>
                  </el-form-item>
                  <el-form-item :label="$t(`system.commons.txt.createdBy`)">
                    <span v-if="scope.row.createdByUser">
                      {{
                      scope.row.createdByUser.loginname
                      }}({{
                      scope.row.createdByUser.username
                      }})
                    </span>
                  </el-form-item>
                  <el-form-item :label="$t(`system.commons.txt.updatedBy`)">
                    <span v-if="scope.row.updatedByUser">
                      {{
                      scope.row.updatedByUser.loginname
                      }}({{
                      scope.row.updatedByUser.username
                      }})
                    </span>
                  </el-form-item>
                  <el-form-item :label="$t(`system.commons.txt.createdAt`)">
                    <span>
                      {{
                      scope.row.createdAt
                      | moment("datetime")
                      }}
                    </span>
                  </el-form-item>
                  <el-form-item :label="$t(`system.commons.txt.updatedAt`)">
                    <span>
                      {{
                      scope.row.updatedAt
                      | moment("datetime")
                      }}
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginname"
              :label="
                    $t(`sys.manage.user.form.loginname`)
                  "
              sortable
            />
            <el-table-column prop="username" :label="$t(`sys.manage.user.form.username`)" sortable />
            <el-table-column
              :label="$t(`sys.manage.user.form.unitid`)"
              header-align="center"
              prop="disabled"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.unit">
                  {{
                  scope.row.unit.name
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t(`sys.manage.user.form.online`)"
              header-align="center"
              prop="disabled"
              align="center"
              width="100px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i v-if="scope.row.userOnline" class="fa fa-circle" style="color:green" />
                <i v-if="!scope.row.userOnline" class="fa fa-circle" style="color:red" />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t(`system.commons.txt.disabled`)"
              header-align="center"
              prop="disabled"
              align="center"
              width="100px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.disabled"
                  size="small"
                  :active-value="false"
                  :inactive-value="true"
                  active-color="green"
                  inactive-color="red"
                  @change="disabledChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              :label="$t(`system.commons.txt.ext`)"
              width="290"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="
                        openSee(scope.row)
                      "
                >
                  {{
                  $t(
                  `sys.manage.user.view.permission`
                  )
                  }}
                </el-button>
                <el-button
                  v-permission="
                        'sys.manage.user.update'
                      "
                  type="text"
                  size="small"
                  @click.native.prevent="
                        resetPwd(scope.row)
                      "
                >
                  {{
                  $t(`sys.manage.user.reset.pwd`)
                  }}
                </el-button>
                <el-button
                  v-permission="
                        'sys.manage.user.update'
                      "
                  type="text"
                  size="small"
                  @click.native.prevent="
                        openUpdate(scope.row)
                      "
                >
                  {{
                  $t(
                  `system.commons.button.update.mini`
                  )
                  }}
                </el-button>
                <el-button
                  v-permission="
                        'sys.manage.user.delete'
                      "
                  type="text"
                  size="small"
                  class="button-delete-color"
                  :disabled="scope.row.loginname==='superadmin'"
                  @click.native.prevent="
                        deleteRow(scope.row)
                      "
                >
                  {{
                  $t(
                  `system.commons.button.delete.mini`
                  )
                  }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page="pageData.pageNo"
            :page-size="pageData.pageSize"
            :total="pageData.totalCount"
            class="platform-pagenation"
            background
            :page-sizes="[10, 20, 30, 50]"
            layout="sizes, prev, pager, next"
            @current-change="doChangePage"
            @size-change="doSizeChange"
          />
        </el-main>
      </el-container>
    </el-container>

    <el-dialog
      :title="$t(`sys.manage.user.update`)"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="editForm" :model="formData" :rules="editRules" size="small" label-width="120px">
        <el-form-item
          prop="loginname"
          :label="$t(`sys.manage.user.form.loginname`)"
        >{{ formData.loginname }}</el-form-item>
        <el-form-item prop="username" :label="$t(`sys.manage.user.form.username`)">
          <el-input
            v-model="formData.username"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.username`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="mobile" :label="$t(`sys.manage.user.form.mobile`)">
          <el-input
            v-model="formData.mobile"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.mobile`)"
            auto-complete="off"
            tabindex="6"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="email" :label="$t(`sys.manage.user.form.email`)">
          <el-input
            v-model="formData.email"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.email`)"
            auto-complete="off"
            tabindex="7"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="disabled" :label="$t(`system.commons.txt.disabled`)">
          <el-switch
            v-model="formData.disabled"
            size="small"
            :active-value="false"
            :inactive-value="true"
            active-color="green"
            inactive-color="red"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">
          {{
          $t(`system.commons.button.cancel`)
          }}
        </el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doUpdate"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t(`sys.manage.user.create`)"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="addForm" :model="formData" :rules="formRules" size="small" label-width="120px">
        <el-form-item class="is-required" prop="unitid" label="所属单位">
          <el-cascader
            v-model="formData.unitid"
            :props="props"
            :options="options"
            :placeholder="$t(`sys.manage.user.form.unitid`)"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item prop="loginname" :label="$t(`sys.manage.user.form.loginname`)">
          <el-input
            v-model="formData.loginname"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.loginname`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="username" :label="$t(`sys.manage.user.form.username`)">
          <el-input
            v-model="formData.username"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.username`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="password" :label="$t(`sys.manage.user.form.password`)">
          <el-input
            v-model="formData.password"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.password`)"
            auto-complete="off"
            tabindex="4"
            type="password"
          />
        </el-form-item>
        <el-form-item prop="passwordAgain" :label="$t(`sys.manage.user.form.passwordAgain`)">
          <el-input
            v-model="formData.passwordAgain"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.passwordAgain`)"
            auto-complete="off"
            tabindex="5"
            type="password"
          />
        </el-form-item>
        <el-form-item prop="mobile" :label="$t(`sys.manage.user.form.mobile`)">
          <el-input
            v-model="formData.mobile"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.mobile`)"
            auto-complete="off"
            tabindex="6"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="email" :label="$t(`sys.manage.user.form.email`)">
          <el-input
            v-model="formData.email"
            maxlength="100"
            :placeholder="$t(`sys.manage.user.form.email`)"
            auto-complete="off"
            tabindex="7"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="disabled" :label="$t(`system.commons.txt.disabled`)">
          <el-switch
            v-model="formData.disabled"
            size="small"
            :active-value="false"
            :inactive-value="true"
            active-color="green"
            inactive-color="red"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          {{
          $t(`system.commons.button.cancel`)
          }}
        </el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doAdd"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-drawer
      :title="titleSee"
      :visible.sync="drawerSee"
      :direction="'rtl'"
      :wrapper-closable="true"
      :size="'50%'"
    >
      <div class="platform-content-list">
        <div class="platform-content-list-table">
          <el-table
            :data="menuTableData"
            style="width: 100%"
            size="small"
            :highlight-current-row="true"
            row-key="id"
            lazy
            :load="loadMenuDataChild"
          >
            <el-table-column
              :label="$t(`sys.manage.menu.form.name`)"
              header-align="center"
              prop="name"
              width="200"
              :show-overflow-tooltip="true"
              align="left"
            />

            <el-table-column
              :label="$t(`sys.manage.menu.form.href`)"
              header-align="center"
              prop="href"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              :label="$t(`sys.manage.menu.form.type`)"
              header-align="center"
              prop="type"
              :show-overflow-tooltip="true"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === 'menu'">
                  {{
                  $t(`sys.manage.menu.form.type.menu`)
                  }}
                </span>
                <span v-if="scope.row.type === 'data'">
                  {{
                  $t(`sys.manage.menu.form.type.data`)
                  }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t(`sys.manage.menu.form.permission`)"
              header-align="center"
              prop="permission"
              :show-overflow-tooltip="true"
            />
          </el-table>
        </div>
      </div>
    </el-drawer>
  </el-card>
</template>

<script>
import { checkLoginname, checkMobile } from '@/utils/validate'
import {
  API_SYS_USER_LIST,
  API_SYS_USER_GET_UNIT_TREE,
  API_SYS_USER_DISABLED,
  API_SYS_USER_CREATE,
  API_SYS_USER_GET_MENU_CHILD,
  API_SYS_USER_DELETE,
  API_SYS_USER_DELETE_MORE,
  API_SYS_USER_RESET_PWD,
  API_SYS_USER_GET,
  API_SYS_USER_UPDATE,
  API_SYS_USER_EXPORT
} from '@/constant/api/platform/sys/user'
import { API_SYS_UNIT_TREE } from '@/constant/api/platform/sys/unit'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    const _self = this
    return {
      btnLoading: false,
      listLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      drawerSee: false,
      titleSee: '',
      userId: '',
      listData: [],
      userSelectData: [],
      pageData: {
        username: '',
        loginname: '',
        unitid: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'createdAt',
        pageOrderBy: 'descending'
      },
      formData: {},
      treeProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      options: [],
      props: {
        lazy: true,
        checkStrictly: true,
        multiple: false,
        emitPath: false,
        // expandTrigger: 'hover'
        // 级联选择器bug::level of null,坐等升级 2.13.0 版本
        lazyLoad(node, resolve) {
          _self.$axios
            .$get(API_SYS_UNIT_TREE, {
              params: { pid: node.value }
            })
            .then(d => {
              if (d.code === 0) {
                resolve(d.data)
              }
            })
        }
      },
      menuTableData: []
    }
  },
  computed: {
    formRules() {
      const formRules = {
        unitid: [
          {
            validator: this.validateUnit,
            trigger: ['blur', 'change']
          }
        ],
        loginname: [
          {
            required: true,
            message: this.$t(`sys.manage.user.form.loginname`),
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: this.$t(`sys.manage.user.form.username`),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t(`sys.manage.user.form.input.password`),
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: this.$t(`sys.manage.user.form.input.passwordLength`),
            trigger: 'change'
          }
        ],
        passwordAgain: [
          {
            required: true,
            message: this.$t(`sys.manage.user.form.input.passwordAgain`),
            trigger: 'blur'
          },
          { validator: this.validatePwdAgain, trigger: 'change' }
        ],
        mobile: [
          {
            required: false,
            message: this.$t(`sys.manage.user.form.mobile`),
            trigger: 'blur'
          },
          { validator: this.validateMobile, trigger: 'change' }
        ],
        email: [
          {
            required: false,
            message: this.$t(`sys.manage.user.form.email`),
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t(`sys.manage.user.form.emailCheck`),
            trigger: ['blur', 'change']
          }
        ]
      }
      return formRules
    },
    editRules() {
      const editRules = {
        loginname: [
          {
            required: true,
            message: this.$t(`sys.manage.user.form.loginname`),
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: this.$t(`sys.manage.user.form.username`),
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: false,
            message: this.$t(`sys.manage.user.form.mobile`),
            trigger: 'blur'
          },
          { validator: this.validateMobile, trigger: 'change' }
        ],
        email: [
          {
            required: false,
            message: this.$t(`sys.manage.user.form.email`),
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t(`sys.manage.user.form.emailCheck`),
            trigger: ['blur', 'change']
          }
        ]
      }
      return editRules
    }
  },
  created() {
    if (process.browser) {
      this.getUnitTree()
      this.listPage()
    }
  },
  methods: {
    // 用户名代码验证规则
    validateUserCode(rule, value, callback) {
      if (!checkLoginname(value)) {
        callback(new Error(this.$t(`system.commons.txt.check.loginname`)))
      } else {
        callback()
      }
    },
    // 验证单位
    validateUnit(rule, value, callback) {
      if (!value || value === 'root') {
        callback(new Error(this.$t(`sys.manage.user.form.unitid`)))
      } else {
        callback()
      }
    },
    // 验证密码
    validatePwdAgain(rule, value, callback) {
      if (value !== this.formData.password) {
        callback(new Error(this.$t(`sys.manage.user.form.input.towPwdError`)))
      } else {
        callback()
      }
    },
    // 验证手机号码
    validateMobile(rule, value, callback) {
      if (value && !checkMobile(value)) {
        return callback(new Error(this.$t(`sys.user.change.info.mobileCheck`)))
      } else {
        callback()
      }
    },
    // 页码变动事件
    doChangePage(val) {
      this.pageData.pageNo = val
      this.listPage()
    },
    // 页大小变动事件
    doSizeChange(val) {
      this.pageData.pageSize = val
      this.listPage()
    },
    // 页排序事件
    doPageSort(column) {
      this.pageData.pageOrderName = column.prop
      this.pageData.pageOrderBy = column.order
      this.listPage()
    },
    // 获取分页查询数据
    listPage() {
      this.listLoading = true
      this.$axios.$post(API_SYS_USER_LIST, this.pageData).then(d => {
        this.listLoading = false
        if (d.code === 0) {
          this.listData = d.data.list
          this.pageData.totalCount = d.data.totalCount
        }
      })
    },
    // 条件查询展示第一页内容
    doSearch() {
      this.pageData.pageNumber = 1
      this.listPage()
    },
    // 全选事件
    userSelectChange(val) {
      this.userSelectData = val
    },
    // 行点击选中
    userRowClick(row) {
      // this.$refs['userTable'].toggleRowSelection(row)
    },
    // 获取单位树数据
    getUnitTree() {
      this.$axios.$get(API_SYS_USER_GET_UNIT_TREE).then(d => {
        if (d.code === 0) {
          this.treeData = d.data
        }
      })
    },
    // 单位点击事件
    unitChange(row, node) {
      this.pageData.unitid = row.id
      this.doSearch()
    },
    // 启用禁用
    disabledChange(row) {
      this.$axios
        .$post(API_SYS_USER_DISABLED, { id: row.id, disabled: row.disabled })
        .then(d => {
          if (d.code === 0) {
            this.$message({
              message: d.msg,
              type: 'success'
            })
          } else {
            setTimeout(function() {
              row.disabled = !row.disabled
            }, 300)
          }
        })
    },
    // 打开新增窗口
    openAdd() {
      this.formData = {}
      this.options = [] // 清空级联选择器的数据,使其数据动态更新
      this.addDialogVisible = true
    },
    doAdd() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$axios.$post(API_SYS_USER_CREATE, this.formData).then(d => {
            this.btnLoading = false
            if (d.code === 0) {
              this.$message({
                message: d.msg,
                type: 'success'
              })
              this.listPage()
              this.addDialogVisible = false
            }
          })
        }
      })
    },
    // 查看用户权限
    openSee(row) {
      this.titleSee = this.$t(`sys.manage.user.see.title`, {
        name: row.loginname + '(' + row.username + ')'
      })
      this.userId = row.id
      this.loadMenuData()
      this.drawerSee = true
    },
    // 初始化加载第一级数据
    loadMenuData() {
      this.$axios.$get(API_SYS_USER_GET_MENU_CHILD + this.userId).then(d => {
        if (d.code === 0) {
          this.menuTableData = d.data
          this.tableKey = +new Date()
        }
      })
    },
    // 动态加载子级数据
    loadMenuDataChild(tree, treeNode, resolve) {
      this.$axios
        .$get(API_SYS_USER_GET_MENU_CHILD + this.userId, {
          params: { pid: tree.id }
        })
        .then(d => {
          if (d.code === 0) {
            resolve(d.data)
          }
        })
    },
    // 重置用户密码
    resetPwd(row) {
      this.$confirm(
        this.$t(`sys.manage.user.restpwd`, {
          name: row.loginname + '(' + row.username + ')'
        }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$get(API_SYS_USER_RESET_PWD + row.id).then(d => {
          if (d.code === 0) {
            this.$alert(
              d.data,
              this.$t(`sys.manage.user.form.newpassword.tip`, {
                name: row.loginname + '(' + row.username + ')'
              }),
              {
                confirmButtonText: this.$t(`system.commons.button.ok`)
              }
            )
          }
        })
      })
    },
    // 执行删除
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.manage.user.delete.tip`, {
          name: row.loginname + '(' + row.username + ')'
        }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_USER_DELETE + row.id).then(d => {
          if (d.code === 0) {
            this.$message({
              message: d.msg,
              type: 'success'
            })
            this.listPage()
          }
        })
      })
    },
    // 打开角色修改窗口
    openUpdate(row) {
      this.$axios.$get(API_SYS_USER_GET + row.id).then(d => {
        if (d.code === 0) {
          this.formData = d.data
          this.updateDialogVisible = true
        }
      })
    },
    // 提交修改表单
    doUpdate() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$axios.$post(API_SYS_USER_UPDATE, this.formData).then(d => {
            this.btnLoading = false
            if (d.code === 0) {
              this.$message({
                message: d.msg,
                type: 'success'
              })
              this.updateDialogVisible = false
              this.listPage()
            }
          })
        }
      })
    },
    deleteMore() {
      var ids = []
      var names = []
      this.userSelectData.forEach(obj => {
        names.push(obj.loginname + '(' + obj.username + ')')
        ids.push(obj.id)
      })
      this.$confirm(
        this.$t(`sys.manage.user.delete.tip`, { name: names.toString() }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios
          .$post(API_SYS_USER_DELETE_MORE, {
            ids: ids.toString(),
            names: names.toString()
          })
          .then(d => {
            if (d.code === 0) {
              this.$message({
                message: d.msg,
                type: 'success'
              })
              this.listPage()
            }
          })
      })
    },
    exportUser() {
      this.$axios
        .get(API_SYS_USER_EXPORT, {
          responseType: 'blob',
          params: this.pageData
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'sys_user.xlsx')
          document.body.appendChild(link)
          link.click()
        })
    }
  }
}
</script>
