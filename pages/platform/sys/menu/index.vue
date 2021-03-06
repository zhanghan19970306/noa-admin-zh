<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.manage.menu`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.manage.menu.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.manage.menu.create`) }}
        </el-button>

        <el-button
          v-permission="'sys.manage.menu.update'"
          size="small"
          @click="openSort"
        >
          {{ $t(`sys.manage.menu.sort`) }}
        </el-button>
      </div>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-list">
        <div class="platform-content-list-table">
          <el-table
            :key="tableKey"
            :data="tableData"
            style="width: 100%"
            size="small"
            :highlight-current-row="true"
            row-key="id"
            lazy
            :load="loadChild"
          >
            <el-table-column
              :label="$t(`sys.manage.menu.form.name`)"
              header-align="center"
              prop="name"
              width="200px"
              :show-overflow-tooltip="true"
              align="left"
            />

            <el-table-column
              :label="$t(`sys.manage.menu.form.href`)"
              header-align="left"
              prop="href"
              :show-overflow-tooltip="true"
              align="left"
            />

            <el-table-column
              :label="$t(`sys.manage.menu.form.type`)"
              header-align="left"
              prop="type"
              width="80px"
              :show-overflow-tooltip="true"
              align="left"
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
              :label="$t(`sys.manage.menu.form.permission`)+' | '+$t(`sys.manage.menu.form.alias`)"
              header-align="left"
              prop="permission"
              :show-overflow-tooltip="true"
              align="left"
            />
            <el-table-column
              :label="$t(`sys.manage.menu.form.showit`)"
              header-align="left"
              prop="showit"
              align="left"
              width="120px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.showit"
                  class="fa fa-circle"
                  style="color:green"
                />
                <i
                  v-if="!scope.row.showit"
                  class="fa fa-circle"
                  style="color:red"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t(`sys.manage.menu.form.disabled`)"
              header-align="left"
              prop="disabled"
              align="left"
              width="120px"
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
              :label="$t(`system.commons.txt.ext`)"
              header-align="center"
              :show-overflow-tooltip="true"
              align="right"
              width="180px"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.type==='menu'"
                  v-permission="'sys.manage.menu.create'"
                  type="text"
                  size="small"
                  @click.native.prevent="addSubRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.addsub.mini`)
                  }}
                </el-button>
                <el-button
                  v-if="scope.row.type==='menu'"
                  v-permission="'sys.manage.menu.update'"
                  type="text"
                  size="small"
                  @click.native.prevent="updateRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
                  v-if="scope.row.type==='data'"
                  v-permission="'sys.manage.menu.update'"
                  type="text"
                  size="small"
                  @click.native.prevent="updateData(scope.row)"
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
                  v-permission="'sys.manage.menu.delete'"
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
      </div>
    </div>

    <el-dialog
      v-permission="'sys.manage.menu.create'"
      :title="$t(`sys.manage.menu.create`)"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form
        ref="addForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          prop="parentId"
          :label="$t(`sys.manage.menu.form.parentId`)"
        >
          <el-cascader
            v-if="!isAddFromSub"
            v-model="formData.parentId"
            :options="menuOptions"
            :props="props"
            :placeholder="$t(`sys.manage.menu.form.parentRoot`)"
            style="width: 100%"
          />
          <el-input
            v-if="isAddFromSub"
            v-model="formData.parentName"
            type="text"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.menu.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.name`)"
            auto-complete="off"
            tabindex="1"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="permission"
          :label="$t(`sys.manage.menu.form.permission`)"
        >
          <el-input
            v-model="formData.permission"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.permission`)"
            auto-complete="off"
            tabindex="5"
            type="text"
            @keyup.native="inputChange"
          />
        </el-form-item>
        <el-form-item
          prop="alias"
          :label="$t(`sys.manage.menu.form.alias`)"
        >
          <el-input
            v-model="formData.alias"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.alias`)"
            auto-complete="off"
            tabindex="2"
            type="text"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          prop="href"
          :label="$t(`sys.manage.menu.form.href`)"
        >
          <el-input
            v-model="formData.href"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.href`)"
            auto-complete="off"
            tabindex="6"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="icon"
          :label="$t(`sys.manage.menu.form.icon`)"
        >
          <el-input
            v-model="formData.icon"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.icon`)"
            auto-complete="off"
            tabindex="7"
            type="text"
          />
          <span :class="formData.icon" />
        </el-form-item>
        <el-form-item
          prop="showit"
          :label="$t(`sys.manage.menu.form.showit`)"
        >
          <el-switch
            v-model="formData.showit"
            size="small"
            :active-value="true"
            :inactive-value="false"
            active-color="green"
            inactive-color="red"
          />
        </el-form-item>
        <el-form-item
          prop="disabled"
          :label="$t(`sys.manage.menu.form.disabled`)"
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
          prop="type"
          :label="$t(`sys.manage.menu.form.type.data`)"
        >
          <el-radio-group
            v-model="formData.children"
            size="mini"
            @change="formRadioChange"
          >
            <el-radio label="false">{{
              $t(`system.commons.txt.no`)
            }}</el-radio>
            <el-radio label="true">{{
              $t(`system.commons.txt.yes`)
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-for="(menu, index) in formData.buttons"
          :key="menu.key"
          :label="$t(`sys.manage.menu.form.type.data`) + (index + 1)"
          :prop="'buttons[' + index + ']'"
          :rules="{
            required: true,
            validator: validateMenu,
            trigger: ['blur', 'change']
          }"
        >
          <el-row v-if="formData.children == 'true'" :gutter="2">
            <el-col :span="6">
              <el-input
                v-model="menu.name"
                :placeholder="
                  $t(`sys.manage.menu.form.permissionName`)
                "
              />
            </el-col>
            <el-col :span="13">
              <el-input
                v-model="menu.permission"
                :placeholder="
                  $t(`sys.manage.menu.form.permission`)
                "
              />
            </el-col>
            <el-col :span="4">
              <el-button
                icon="el-icon-delete"
                size="small"
                @click.prevent="formRemoveMenu(menu)"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-row
          v-if="formData.children == 'true'"
          style="text-align: right;padding-right: 17px;"
        >
          <el-button
            size="small"
            icon="el-icon-circle-plus"
            @click="formAddMenu"
          >{{ $t(`system.commons.button.add.mini`) }}</el-button>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="doAdd">{{
          $t(`system.commons.button.ok`)
        }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t(`sys.manage.menu.sort`)"
      :visible.sync="sortDialogVisible"
      width="50%"
    >
      <el-tree
        ref="sortMenuTree"
        :data="sortMenuData"
        draggable
        :allow-drop="sortAllowDrop"
        node-key="id"
        :props="treeProps"
      >
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{ scope.node.label }}</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sortDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doSort"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-permission="'sys.manage.menu.update'"
      :title="$t(`sys.manage.menu.update`)"
      :visible.sync="editMenuDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="editMenuForm" :model="formData" :rules="formRules" size="small" label-width="120px">
        <el-form-item prop="parentId" :label="$t(`sys.manage.menu.form.parentId`)">
          <el-input v-model="formData.parentName" :disabled="true" />
        </el-form-item>
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.menu.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.name`)"
            auto-complete="off"
            tabindex="1"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="permission"
          :label="$t(`sys.manage.menu.form.permission`)"
        >
          <el-input
            v-model="formData.permission"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.permission`)"
            auto-complete="off"
            tabindex="5"
            type="text"
            @keyup.native="inputChange"
          />
        </el-form-item>
        <el-form-item
          prop="alias"
          :label="$t(`sys.manage.menu.form.alias`)"
        >
          <el-input
            v-model="formData.alias"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.alias`)"
            auto-complete="off"
            tabindex="2"
            type="text"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          prop="href"
          :label="$t(`sys.manage.menu.form.href`)"
        >
          <el-input
            v-model="formData.href"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.href`)"
            auto-complete="off"
            tabindex="6"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="icon"
          :label="$t(`sys.manage.menu.form.icon`)"
        >
          <el-input
            v-model="formData.icon"
            maxlength="100"
            :placeholder="$t(`sys.manage.menu.form.icon`)"
            auto-complete="off"
            tabindex="7"
            type="text"
          />
          <span :class="formData.icon" />
        </el-form-item>
        <el-form-item
          prop="showit"
          :label="$t(`sys.manage.menu.form.showit`)"
        >
          <el-switch
            v-model="formData.showit"
            size="small"
            :active-value="true"
            :inactive-value="false"
            active-color="green"
            inactive-color="red"
          />
        </el-form-item>
        <el-form-item
          prop="disabled"
          :label="$t(`sys.manage.menu.form.disabled`)"
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
          prop="type"
          :label="$t(`sys.manage.menu.form.type.data`)"
        >
          <el-radio-group
            v-model="formData.children"
            size="mini"
            @change="formRadioChange"
          >
            <el-radio label="false">{{
              $t(`system.commons.txt.no`)
            }}</el-radio>
            <el-radio label="true">{{
              $t(`system.commons.txt.yes`)
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-for="(menu, index) in formData.buttons"
          :key="menu.key"
          :label="$t(`sys.manage.menu.form.type.data`) + (index + 1)"
          :prop="'buttons[' + index + ']'"
          :rules="{
            required: true,
            validator: validateMenu,
            trigger: ['blur', 'change']
          }"
        >
          <el-row v-if="formData.children == 'true'" :gutter="2">
            <el-col :span="6">
              <el-input
                v-model="menu.name"
                :placeholder="
                  $t(`sys.manage.menu.form.permissionName`)
                "
              />
            </el-col>
            <el-col :span="13">
              <el-input
                v-model="menu.permission"
                :placeholder="
                  $t(`sys.manage.menu.form.permission`)
                "
              />
            </el-col>
            <el-col :span="4">
              <el-button
                icon="el-icon-delete"
                size="small"
                @click.prevent="formRemoveMenu(menu)"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-row
          v-if="formData.children == 'true'"
          style="text-align: right;padding-right: 17px;"
        >
          <el-button
            size="small"
            icon="el-icon-circle-plus"
            @click="formAddMenu"
          >{{ $t(`system.commons.button.add.mini`) }}</el-button>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMenuDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="doEditMenu">{{
          $t(`system.commons.button.ok`)
        }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-permission="'sys.manage.menu.update'"
      :title="$t(`sys.manage.menu.editdata`)"
      :visible.sync="editDataDialogVisible"
      width="50%"
    >
      <el-form ref="editDataForm" :model="formData_data" :rules="formRules_data" size="small" label-width="120px">
        <el-form-item prop="name" :label="$t(`sys.manage.menu.form.name`)">
          <el-input
            v-model="formData_data.name"
            :placeholder="$t(`sys.manage.menu.form.name`)"
            maxlength="100"
            auto-complete="off"
            tabindex="1"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="permission" :label="$t(`sys.manage.menu.form.permission`)">
          <el-input
            v-model="formData_data.permission"
            :placeholder="$t(`sys.manage.menu.form.permission`)"
            maxlength="100"
            auto-complete="off"
            tabindex="1"
            type="text"
            @keyup.native="inputChange_data"
          />
        </el-form-item>
        <el-form-item prop="alias" :label="$t(`sys.manage.menu.form.alias`)">
          <el-input
            v-model="formData_data.alias"
            :placeholder="$t(`sys.manage.menu.form.alias`)"
            maxlength="100"
            auto-complete="off"
            tabindex="1"
            type="text"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item prop="disabled" :label="$t(`sys.manage.menu.form.disabled`)">
          <el-switch
            v-model="formData_data.disabled"
            size="small"
            :active-value="false"
            :inactive-value="true"
            active-color="green"
            inactive-color="red"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDataDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="doEditData">{{
          $t(`system.commons.button.ok`)
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  API_SYS_MENU_CHILD,
  API_SYS_MENU_TREE,
  API_SYS_MENU_DISABLED,
  API_SYS_MENU_CREATE,
  API_SYS_MENU_DELETE,
  API_SYS_MENU_SORT_TREE,
  API_SYS_MENU_SORT,
  API_SYS_MENU_GET_MENU,
  API_SYS_MENU_UPDATE_MENU,
  API_SYS_MENU_GET_DATA,
  API_SYS_MENU_UPDATE_DATA
} from '@/constant/api/platform/sys/menu'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    const _self = this
    return {
      btnLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      editMenuDialogVisible: false,
      editDataDialogVisible: false,
      sortDialogVisible: false,
      tableData: [],
      tableKey: '',
      isAddFromSub: false,
      formData: {
        id: '',
        parentId: '',
        parentName: '',
        type: 'menu',
        showit: true,
        disabled: false,
        children: 'false',
        buttons: []
      },
      formData_data: {},
      menuOptions: [],
      sortMenuData: [],
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
            .$get(API_SYS_MENU_TREE, {
              params: { pid: node.value }
            })
            .then((d) => {
              if (d.code === 0) {
                resolve(d.data)
              }
            })
        }
      }
    }
  },
  computed: {
    // 表单验证,写在computed里切换多语言才会更新
    formRules() {
      const formRules = {
        name: [
          {
            required: true,
            message: this.$t(`sys.manage.menu.form.name`),
            trigger: 'blur'
          }
        ],
        permission: [
          {
            required: true,
            message: this.$t(`sys.manage.menu.form.permission`),
            trigger: ['blur', 'change']
          }
        ],
        alias: [
          {
            required: true,
            message: this.$t(`sys.manage.menu.form.alias`),
            trigger: ['blur', 'change']
          }
        ]
      }
      return formRules
    },
    formRules_data() {
      const formRules_data = {
        name: [
          { required: true, message: this.$t(`sys.manage.menu.form.name`), trigger: 'blur' }
        ],
        permission: [
          { required: true, message: this.$t(`sys.manage.menu.form.permission`), trigger: ['blur', 'change'] }
        ],
        alias: [
          { required: true, message: this.$t(`sys.manage.menu.form.alias`), trigger: ['blur', 'change'] }
        ]
      }
      return formRules_data
    }
  },
  created() {
    if (process.browser) {
      this.loadData()
    }
  },
  methods: {
    // 权限标识与多语言字符串数据联动
    inputChange(item) {
      this.$set(this.formData, 'alias', this.formData.permission)
    },
    // 权限标识与多语言字符串数据联动
    inputChange_data(item) {
      this.$set(this.formData_data, 'alias', this.formData_data.permission)
    },
    // 初始化加载第一级数据
    loadData() {
      this.listLoading = true
      this.$axios.$get(API_SYS_MENU_CHILD).then((d) => {
        this.listLoading = false
        if (d.code === 0) {
          this.tableData = d.data
          this.tableKey = +new Date()
        }
      })
    },
    // 动态加载子级数据
    loadChild(tree, treeNode, resolve) {
      this.$axios
        .$get(API_SYS_MENU_CHILD, { params: { pid: tree.id }})
        .then((d) => {
          if (d.code === 0) {
            resolve(d.data)
          }
        })
    },
    // 启用禁用
    disabledChange(row) {
      this.$axios.$post(API_SYS_MENU_DISABLED, row).then((d) => {
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
    // 验证动态添加行数据
    validateMenu(rule, row, callback) {
      if (typeof row.name === undefined || row.name === '') {
        callback(new Error(this.$t(`sys.manage.menu.form.permissionName`)))
      } else if (typeof row.permission === undefined || row.permission === '') {
        callback(new Error(this.$t(`sys.manage.menu.form.permission`)))
      } else {
        callback()
      }
    },
    // 打开新增窗口
    openAdd() {
      this.isAddFromSub = false
      this.addDialogVisible = true
      this.menuOptions = []
      // 表单还原为初始值
      this.formData = {
        id: '',
        parentId: '',
        parentName: '',
        type: 'menu',
        showit: true,
        disabled: false,
        children: 'false',
        buttons: []
      }
      if (this.$refs['addForm']) this.$refs['addForm'].resetFields()
    },
    // 提交新增表单数据
    doAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_MENU_CREATE, {
              menu: JSON.stringify(this.formData),
              buttons: JSON.stringify(this.formData.buttons)
            })
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.loadData()
                this.addDialogVisible = false
              }
            })
        }
      })
    },
    // 是否有权限的操作
    formRadioChange(val) {
      this.formData.children = val
      if (val === 'true') {
        this.formData.buttons = [
          {
            name: '',
            permission: '',
            key: Date.now()
          }
        ]
      } else {
        this.formData.buttons = []
      }
    },
    // 动态添加行的删除
    formRemoveMenu: function(menu) {
      var index = this.formData.buttons.indexOf(menu)
      if (index !== -1) {
        this.formData.buttons.splice(index, 1)
      }
    },
    // 动态添加一行
    formAddMenu() {
      this.formData.buttons.push({
        name: '',
        permission: '',
        key: Date.now()
      })
    },
    // 执行删除
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.manage.menu.delete`, { name: row.name }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_MENU_DELETE + row.id).then((d) => {
          if (d.code === 0) {
            this.$message({
              message: d.msg,
              type: 'success'
            })
            this.loadData()
          }
        })
      })
    },
    // 打开排序窗口
    openSort() {
      this.$axios.$get(API_SYS_MENU_SORT_TREE).then((d) => {
        if (d.code === 0) {
          this.sortMenuData = d.data
        }
      })
      this.sortDialogVisible = true
    },
    // 排序树控制不可跨级拖拽
    sortAllowDrop(moveNode, inNode, type) {
      if (moveNode.data.parentId === inNode.data.parentId) {
        return type === 'prev'
      }
    },
    // 组装树结构
    getTreeIds(ids, data) {
      const _self = this
      data.forEach(function(obj) {
        ids.push(obj.id)
        if (obj.children && obj.children.length > 0) {
          _self.getTreeIds(ids, obj.children)
        }
      })
    },
    // 提交排序数据
    doSort() {
      this.btnLoading = true
      var ids = []
      this.getTreeIds(ids, this.sortMenuData)
      this.$axios
        .$post(API_SYS_MENU_SORT, { ids: ids.toString() })
        .then((d) => {
          this.btnLoading = false
          if (d.code === 0) {
            this.sortDialogVisible = false
            this.loadData()
          }
        })
    },
    // 新增子菜单
    addSubRow(row) {
      this.formData = {
        id: '',
        parentId: row.id,
        parentName: row.name,
        type: 'menu',
        showit: true,
        disabled: false,
        children: 'false',
        buttons: []
      }
      this.isAddFromSub = true
      if (this.$refs['addForm']) this.$refs['addForm'].resetFields()
      this.addDialogVisible = true
    },
    // 打开修改菜单窗口
    updateRow(row) {
      this.$axios.$get(API_SYS_MENU_GET_MENU + row.id).then((d) => {
        if (d.code === 0) {
          this.formData = d.data
          this.editMenuDialogVisible = true
        }
      })
    },
    // 提交修改菜单表单
    doEditMenu() {
      this.$refs['editMenuForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_MENU_UPDATE_MENU, {
              menu: JSON.stringify(this.formData),
              buttons: JSON.stringify(this.formData.buttons)
            })
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.editMenuDialogVisible = false
                this.loadData()
              }
            })
        }
      })
    },
    // 打开修改权限窗口
    updateData(row) {
      this.$axios.$get(API_SYS_MENU_GET_DATA + row.id).then((d) => {
        if (d.code === 0) {
          this.formData_data = d.data
          this.editDataDialogVisible = true
        }
      })
    },
    // 提交修改权限表单
    doEditData() {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_MENU_UPDATE_DATA, this.formData_data)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.editDataDialogVisible = false
                this.loadData()
              }
            })
        }
      })
    }
  }
}
</script>
