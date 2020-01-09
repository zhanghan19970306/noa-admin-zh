<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.manage.role`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.manage.role.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.manage.role.create`) }}
        </el-button>
      </div>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-search">
        <el-form
          :inline="true"
          :model="pageData"
          class="platform-content-search-form"
        >
          <el-form-item :label="$t(`sys.manage.role.form.name`)">
            <el-input
              v-model="pageData.name"
              :placeholder="$t(`sys.manage.role.form.name`)"
              class="platform-content-search-input"
            />
          </el-form-item>
          <el-form-item :label="$t(`sys.manage.role.form.code`)">
            <el-input
              v-model="pageData.code"
              :placeholder="$t(`sys.manage.role.form.code`)"
              class="platform-content-search-input"
            />
          </el-form-item>
          <div class="platform-content-search-op">
            <el-button
              size="small"
              type="primary"
              @click="doSearch"
            >
              {{ $t(`system.commons.button.search`) }}
            </el-button>
          </div>
        </el-form>
      </div>
      <div class="platform-content-list">
        <div class="platform-content-list-table">
          <el-table
            v-loading="listLoading"
            :data="listData"
            stripe
            @sort-change="doPageSort"
          >
            <el-table-column
              prop="name"
              :label="$t(`sys.manage.role.form.name`)"
              sortable
            />
            <el-table-column
              prop="code"
              :label="$t(`sys.manage.role.form.code`)"
              sortable
            />
            <el-table-column
              prop="unitid"
              :label="$t(`sys.manage.role.form.unitid`)"
              header-align="center"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  v-if="scope.row.unit == null"
                  style="font-weight: bold"
                >
                  {{ $t(`sys.manage.role.form.systemrole`) }}
                </span>
                <span v-if="scope.row.unit">
                  {{ scope.row.unit.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="createdAt"
              :label="$t(`system.commons.txt.createdAt`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.createdAt | moment("datetime") }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="createdBy"
              :label="$t(`system.commons.txt.createdBy`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.createdByUser">
                  {{ scope.row.createdByUser.loginname }}({{ scope.row.createdByUser.username }})
                </span>
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
                  @click.native.prevent="openSee(scope.row)"
                >
                  {{ $t(`sys.manage.role.see`) }}
                </el-button>
                <el-button
                  v-permission="'sys.manage.role.menu'"
                  type="text"
                  size="small"
                  @click.native.prevent="openDoMenu(scope.row)"
                >
                  {{ $t(`sys.manage.role.assign.permissions`) }}
                </el-button>
                <el-button
                  v-permission="'sys.manage.role.user'"
                  type="text"
                  size="small"
                  @click.native.prevent="openDoUser(scope.row)"
                >
                  {{ $t(`sys.manage.role.assign.users`) }}
                </el-button>
                <el-button
                  v-if="scope.row.code==='sysadmin'||scope.row.code==='public'"
                  v-permission="'sys.manage.role.update'"
                  type="text"
                  size="small"
                  :disabled="true"
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
                  v-else
                  v-permission="'sys.manage.role.update'"
                  type="text"
                  size="small"
                  @click.native.prevent="
                    openUpdate(scope.row)
                  "
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
                  v-if="scope.row.code==='sysadmin'||scope.row.code==='public'"
                  v-permission="'sys.manage.role.delete'"
                  type="text"
                  size="small"
                  class="button-delete-color"
                  :disabled="true"
                >
                  {{
                    $t(`system.commons.button.delete.mini`)
                  }}
                </el-button>
                <el-button
                  v-else
                  v-permission="'sys.manage.role.delete'"
                  type="text"
                  size="small"
                  class="button-delete-color"
                  @click.native.prevent="deleteRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.delete.mini`)
                  }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="platform-content-list-pagination">
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
        </div>
      </div>
    </div>

    <el-dialog
      v-permission="'sys.manage.role.create'"
      append-to-body
      :title="$t(`sys.manage.role.create`)"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-form
        ref="addForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          class="is-required"
          prop="unitid"
          :label="$t(`sys.manage.role.form.unitid`)"
        >
          <el-cascader
            v-model="formData.unitid"
            :props="props"
            :placeholder="$t(`sys.manage.role.form.unitid.select`)"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.role.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="50"
            :placeholder="$t(`sys.manage.role.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="code"
          :label="$t(`sys.manage.role.form.code`)"
        >
          <el-input
            v-model="formData.code"
            maxlength="150"
            :placeholder="$t(`sys.manage.role.form.code`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="disabled"
          :label="$t(`system.commons.txt.disabled`)"
        >
          <el-switch
            v-model="formData.disabled"
            size="small"
            :active-value="false"
            :inactive-value="true"
            active-color="green"
            inactive-color="red"
          />
        </el-form-item>
        <el-form-item
          :label="$t(`sys.manage.role.form.assign.permissions`)"
        >
          <el-row style="margin-bottom: 3px;">
            <el-button size="small" @click="addRoleSelAll">{{
              $t(`system.commons.button.all.mini`)
            }}</el-button>
            <el-button size="small" @click="addRoleSelClear">{{
              $t(`system.commons.button.clear.mini`)
            }}</el-button>
          </el-row>
          <el-tree
            ref="addMenuTree"
            :data="addMenuData"
            show-checkbox
            check-strictly
            node-key="id"
            :props="treeProps"
          >
            <span slot-scope="scope" class="custom-tree-node">
              <span>{{ scope.node.label }}</span>
              <span>
                <span
                  v-if="scope.node.type === 'menu'"
                  style="font-weight: bold"
                >{{
                  $t(`sys.manage.menu.form.type.menu`)
                }}</span>
                <span v-if="scope.node.type === 'data'">{{
                  $t(`sys.manage.menu.form.type.data`)
                }}</span>
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
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
            :data="roleMenuTableData"
            style="width: 100%"
            size="small"
            :highlight-current-row="true"
            row-key="id"
            lazy
            :load="loadRoleMenuChild"
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
                <span v-if="scope.row.type === 'menu'">{{
                  $t(`sys.manage.menu.form.type.menu`)
                }}</span>
                <span v-if="scope.row.type === 'data'">{{
                  $t(`sys.manage.menu.form.type.data`)
                }}</span>
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

    <el-dialog
      v-permission="'sys.manage.role.menu'"
      append-to-body
      :title="doMenuDialogTitle"
      :visible.sync="doMenuDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-row style="margin-bottom: 3px;">
        <el-button size="small" @click="menuRoleSelAll">{{ $t(`system.commons.button.all.mini`) }}</el-button>
        <el-button size="small" @click="menuRoleSelClear">{{ $t(`system.commons.button.clear.mini`) }}</el-button>
      </el-row>
      <el-tree
        ref="doMenuTree"
        :data="doMenuData"
        :default-checked-keys="doMenuCheckedData"
        check-strictly
        show-checkbox
        node-key="id"
        :props="treeProps"
      >
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{ scope.node.label }}</span>
          <span>
            <span v-if="scope.node.type === 'menu'" style="font-weight: bold">{{
              $t(`sys.manage.menu.form.type.menu`)
            }}</span>
            <span v-if="scope.node.type === 'data'">{{
              $t(`sys.manage.menu.form.type.data`)
            }}
            </span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doMenuDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doMenu"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-permission="'sys.manage.role.user'"
      append-to-body
      :title="userDialogTitle"
      :visible.sync="userDialogVisible"
      :close-on-click-modal="false"
      width="70%"
    >
      <div class="block">
        <el-select
          v-model="selUsers"
          size="small"
          style="width: 65%"
          class="span_n"
          multiple
          filterable
          remote
          default-first-option
          reserve-keyword
          :remote-method="searchUser"
          :loading="searchUserLoading"
          :placeholder="$t(`sys.manage.role.user.search`)"
        >
          <el-option
            v-for="item in dbUsers"
            :key="item.value"
            :label="item.label"
            :value="item"
          />
        </el-select>
        <el-button size="small" @click="userAddRole">{{ $t(`sys.manage.role.user.add`) }}</el-button>
        <div class="pull-right offscreen-right">
          <el-button size="small" type="danger" @click="userDelRole">{{ $t(`sys.manage.role.user.remove`) }}</el-button>
        </div>
      </div>
      <el-table
        ref="userTable"
        :data="userTableData"
        header-align="center"
        :loading="userListLoading"
        style="width: 100%"
        size="small"
        @row-click="userRowClick"
        @sort-change="userPageOrder"
        @selection-change="userSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45"
        />
        <el-table-column
          sortable
          prop="loginname"
          :label="$t(`sys.manage.user.form.loginname`)"
          header-align="center"
        />
        <el-table-column
          prop="username"
          :label="$t(`sys.manage.user.form.username`)"
          header-align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="unitname"
          :label="$t(`sys.manage.user.form.unitid`)"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          :label="$t(`system.commons.txt.disabled`)"
          header-align="center"
          prop="disabled"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <i
              v-if="!scope.row.disabled"
              class="fa fa-circle"
              style="color:green"
            />
            <i
              v-if="scope.row.disabled"
              class="fa fa-circle"
              style="color:red"
            />
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="userOnline"
          :label="$t(`sys.manage.user.form.online`)"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.useronline">{{ $t(`sys.manage.user.form.online.on`) }}</i>
            <i v-if="!scope.row.useronline">{{ $t(`sys.manage.user.form.online.off`) }}</i>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="userPageData.pageSize"
        :current-page="userPageData.pageNo"
        :total="userPageData.totalCount"
        @current-change="userPageNumberChange"
        @size-change="userPageSizeChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">{{ $t(`system.commons.button.close`) }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      append-to-body
      :title="$t(`sys.manage.role.update`)"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="editForm" :model="formData" :rules="formRules" size="small" label-width="80px">
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.role.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="50"
            :placeholder="$t(`sys.manage.role.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="code"
          :label="$t(`sys.manage.role.form.code`)"
        >
          <el-input
            v-model="formData.code"
            maxlength="150"
            :placeholder="$t(`sys.manage.role.form.code`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="disabled"
          :label="$t(`system.commons.txt.disabled`)"
        >
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
        <el-button @click="updateDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doUpdate"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkCode } from '@/utils/validate'
import {
  API_SYS_ROLE_LIST,
  API_SYS_ROLE_GET_ALL_MENU,
  API_SYS_ROLE_CREATE,
  API_SYS_ROLE_GET_UNIT_TREE,
  API_SYS_ROLE_DISABLED,
  API_SYS_ROLE_DELETE,
  API_SYS_ROLE_GET_MENU_CHILD,
  API_SYS_ROLE_GET_DO_MENU,
  API_SYS_ROLE_DO_MENU,
  API_SYS_ROLE_USER_SEARCH,
  API_SYS_ROLE_USER_LIST,
  API_SYS_ROLE_USER_ADD,
  API_SYS_ROLE_USER_REMOVE,
  API_SYS_ROLE_GET,
  API_SYS_ROLE_UPDATE
} from '@/constant/api/platform/sys/role'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    const _self = this
    return {
      btnLoading: false,
      listLoading: false,
      userListLoading: false,
      searchUserLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      userDialogVisible: false,
      userDialogTitle: '',
      drawerSee: false,
      titleSee: '',
      doMenuDialogTitle: '',
      doMenuDialogVisible: false,
      listData: [],
      doMenuData: [],
      doMenuCheckedData: [],
      pageData: {
        name: '',
        code: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'createdAt',
        pageOrderBy: 'descending'
      },
      formData: {},
      addMenuData: [],
      roleMenuTableData: [],
      seeRoleId: '',
      treeProps: {
        children: 'children',
        label: 'label'
      },
      props: {
        lazy: true,
        checkStrictly: true,
        multiple: false,
        emitPath: false,
        lazyLoad(node, resolve) {
          _self.$axios
            .$get(API_SYS_ROLE_GET_UNIT_TREE, {
              params: { pid: node.value }
            })
            .then((d) => {
              if (d.code === 0) {
                resolve(d.data)
              }
            })
        }
      },
      userPageData: {
        roleId: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: '',
        pageOrderBy: ''
      },
      userTableData: [],
      dbUsers: [],
      selUsers: [],
      userSelection: []
    }
  },
  computed: {
    formRules() {
      const formRules = {
        unitid: [
          {
            required: true,
            message: this.$t(`sys.manage.role.form.unitid`),
            trigger: ['blur', 'change']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t(`sys.manage.role.form.name`),
            trigger: ['blur', 'change']
          }
        ],
        code: [
          {
            required: true,
            message: this.$t(`sys.manage.role.form.code`),
            trigger: ['blur', 'change']
          },
          {
            validator: this.validateRoleCode,
            trigger: ['blur', 'change']
          }
        ]
      }
      return formRules
    }
  },
  created() {
    if (process.browser) {
      this.listPage()
    }
  },
  methods: {
    // 角色代码验证规则
    validateRoleCode(rule, value, callback) {
      if (!checkCode(value)) {
        callback(
          new Error(this.$t(`system.commons.txt.check.code`))
        )
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
      this.$axios.$post(API_SYS_ROLE_LIST, this.pageData).then((d) => {
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
    // 打开新增窗口
    openAdd() {
      this.formData = {}
      if (this.$refs['addForm']) this.$refs['addForm'].resetFields()
      this.addMenuLoad()
      this.addDialogVisible = true
    },
    // 加载菜单及权限
    addMenuLoad() {
      this.$axios.$get(API_SYS_ROLE_GET_ALL_MENU).then((d) => {
        if (d.code === 0) {
          this.addMenuData = d.data
        }
      })
    },
    // 提交新增表单
    doAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.formData.menuIds = this.$refs['addMenuTree']
            .getCheckedKeys()
            .toString()
          this.$axios
            .$post(API_SYS_ROLE_CREATE, this.formData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.doSearch()
                this.addDialogVisible = false
              }
            })
        }
      })
    },
    // 获取选择的节点id
    getTreeAllIds(ids, obj) {
      const _self = this
      if (obj && obj.length > 0) {
        obj.forEach(function(o) {
          ids.push(o.id)
          if (o.children) {
            _self.getTreeAllIds(ids, o.children)
          }
        })
      }
    },
    // 新增窗 全选权限
    addRoleSelAll() {
      var ids = []
      this.getTreeAllIds(ids, this.addMenuData)
      this.$refs['addMenuTree'].setCheckedKeys(ids)
    },
    // 新增窗 取消全选
    addRoleSelClear() {
      this.$refs['addMenuTree'].setCheckedKeys([])
    },
    // 分配权限窗 全选权限
    menuRoleSelAll() {
      var ids = []
      this.getTreeAllIds(ids, this.doMenuData)
      this.$refs['doMenuTree'].setCheckedKeys(ids)
    },
    // 分配权限窗 取消全选
    menuRoleSelClear() {
      this.$refs['doMenuTree'].setCheckedKeys([])
    },
    // 启用禁用
    disabledChange(row) {
      this.$axios.$post(API_SYS_ROLE_DISABLED, row).then((d) => {
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
    // 执行删除
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.manage.role.delete`, { name: row.name }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_ROLE_DELETE + row.id).then((d) => {
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
    // 查看角色权限
    openSee(row) {
      this.titleSee = this.$t(`sys.manage.role.see.title`, {
        name: row.name
      })
      this.seeRoleId = row.id
      this.loadRoleMenuData()
      this.drawerSee = true
    },
    // 初始化加载第一级数据
    loadRoleMenuData() {
      this.$axios
        .$get(API_SYS_ROLE_GET_MENU_CHILD + this.seeRoleId)
        .then((d) => {
          if (d.code === 0) {
            this.roleMenuTableData = d.data
            this.tableKey = +new Date()
          }
        })
    },
    // 动态加载子级数据
    loadRoleMenuChild(tree, treeNode, resolve) {
      this.$axios
        .$get(API_SYS_ROLE_GET_MENU_CHILD + this.seeRoleId, {
          params: { pid: tree.id }
        })
        .then((d) => {
          if (d.code === 0) {
            resolve(d.data)
          }
        })
    },
    openDoMenu(row) {
      this.doMenuDialogTitle = this.$t(`sys.manage.role.do.menu`, {
        name: row.name
      })
      this.seeRoleId = row.id
      this.loadDoMenuData()
      this.doMenuDialogVisible = true
    },
    // 加载可分配的权限菜单
    loadDoMenuData() {
      this.$axios
        .$get(API_SYS_ROLE_GET_DO_MENU + this.seeRoleId)
        .then((d) => {
          if (d.code === 0) {
            this.doMenuData = d.data.menu
            this.doMenuCheckedData = d.data.cmenu
          }
        })
    },
    // 提交分配的权限表单
    doMenu() {
      var ids = this.$refs['doMenuTree'].getCheckedKeys()
      if (!ids || ids.length === 0) {
        this.$message({
          message: this.$t(`sys.manage.role.do.menu.select`),
          type: 'warning'
        })
        return
      }
      this.btnLoading = true
      this.$axios
        .$post(API_SYS_ROLE_DO_MENU, { roleId: this.seeRoleId, menuIds: ids.toString() })
        .then((d) => {
          this.btnLoading = false
          if (d.code === 0) {
            this.$message({
              message: d.msg,
              type: 'success'
            })
            this.doMenuDialogVisible = false
          }
        })
    },
    // 获取待分配用户分页数据
    listUserPage() {
      this.userListLoading = true
      this.$axios.$post(API_SYS_ROLE_USER_LIST, this.userPageData).then((d) => {
        this.userListLoading = false
        if (d.code === 0) {
          this.userTableData = d.data.list
          this.userPageData.totalCount = d.data.totalCount
        }
      })
    },
    // 打开分配用户窗口
    openDoUser(row) {
      this.userDialogTitle = this.$t(`sys.manage.role.do.user`, {
        name: row.name
      })
      this.seeRoleId = row.id
      this.userPageData.roleId = row.id
      this.userDialogVisible = true
      this.listUserPage()
      this.searchUser('')
    },
    // 可输入框查询待分配用户
    searchUser(query) {
      this.searchUserLoading = true
      this.$axios.$post(API_SYS_ROLE_USER_SEARCH, { query: query, roleId: this.seeRoleId }).then((d) => {
        this.searchUserLoading = false
        if (d.code === 0) {
          this.dbUsers = d.data.list
        }
      })
    },
    // 关联用户到角色
    userAddRole() {
      if (!this.selUsers || this.selUsers.length === 0) {
        this.$message({
          message: this.$t(`sys.manage.role.user.search`),
          type: 'warning'
        })
        return
      }
      var users = []
      var loginnames = []
      this.selUsers.forEach((o) => {
        users.push(o.value)
        loginnames.push(o.label)
      })
      this.$axios.$post(API_SYS_ROLE_USER_ADD, { users: users.toString(), loginnames: loginnames.toString(), roleId: this.seeRoleId }).then((d) => {
        if (d.code === 0) {
          this.selUsers = []
          this.$message({
            message: d.msg,
            type: 'success'
          })
          this.searchUser('')
          this.listUserPage()
        }
      })
    },
    // 从角色移除用户
    userDelRole() {
      if (!this.userSelection || this.userSelection.length === 0) {
        this.$message({
          message: this.$t(`sys.manage.role.user.select`),
          type: 'warning'
        })
        return
      }
      var users = []
      var loginnames = []
      this.userSelection.forEach((o) => {
        users.push(o.id)
        loginnames.push(o.loginname + '(' + o.username + ')')
      })
      this.$axios.$post(API_SYS_ROLE_USER_REMOVE, { users: users.toString(), loginnames: loginnames.toString(), roleId: this.seeRoleId }).then((d) => {
        if (d.code === 0) {
          this.selUsers = []
          this.$message({
            message: d.msg,
            type: 'success'
          })
          this.searchUser('')
          this.listUserPage()
        }
      })
    },
    // 用户选中事件
    userSelectionChange(val) {
      this.userSelection = val
    },
    // 用户列表排序事件
    userPageOrder(column) {
      this.userPageData.pageOrderName = column.prop
      this.userPageData.pageOrderBy = column.order
      this.listUserPage()
    },
    // 用户列表页码变化事件
    userPageNumberChange(val) {
      this.userPageData.pageNumber = val
      this.listUserPage()
    },
    // 用户列表页大小变化事件
    userPageSizeChange(val) {
      this.userPageData.pageSize = val
      this.listUserPage()
    },
    // 点击选择行
    userRowClick(row) {
      this.$refs['userTable'].toggleRowSelection(row)
    },
    // 打开角色修改窗口
    openUpdate(row) {
      this.$axios.$get(API_SYS_ROLE_GET + row.id).then((d) => {
        if (d.code === 0) {
          this.formData = d.data
          this.updateDialogVisible = true
        }
      })
    },
    // 提交修改表单
    doUpdate() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_ROLE_UPDATE, this.formData)
            .then((d) => {
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
    }
  }
}
</script>

<style>
.el-drawer__body {
    overflow-y: auto;
}
.el-drawer__wrapper div,
span,
button,
i {
    outline: none;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>
