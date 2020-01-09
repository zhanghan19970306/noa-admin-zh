<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.config.dict`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.config.dict.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.config.dict.create`) }}
        </el-button>

        <el-button
          v-permission="'sys.config.dict.update'"
          size="small"
          @click="openSort"
        >
          {{ $t(`sys.config.dict.sort`) }}
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
              :label="$t(`sys.config.dict.form.name`)"
              header-align="center"
              prop="name"
              width="230px"
              :show-overflow-tooltip="true"
              align="left"
            />

            <el-table-column
              :label="$t(`sys.config.dict.form.code`)"
              header-align="left"
              prop="code"
              :show-overflow-tooltip="true"
              align="left"
            />

            <el-table-column
              :label="$t(`sys.config.dict.form.disabled`)"
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
                  type="text"
                  size="small"
                  @click.native.prevent="addSubRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.addsub.mini`)
                  }}
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="updateRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
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
      :title="$t(`sys.config.dict.create`)"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="addForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="100px"
      >
        <el-form-item
          prop="parentId"
          :label="$t(`sys.config.dict.form.parentId`)"
        >
          <el-cascader
            v-if="!isAddFromSub"
            v-model="formData.parentId"
            :props="props"
            :options="options"
            :placeholder="$t(`sys.config.dict.form.parentRoot`)"
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
          :label="$t(`sys.config.dict.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="100"
            :placeholder="$t(`sys.config.dict.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="code"
          :label="$t(`sys.config.dict.form.code`)"
        >
          <el-input
            v-model="formData.code"
            maxlength="100"
            :placeholder="$t(`sys.config.dict.form.code`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="disabled"
          :label="$t(`sys.config.dict.form.disabled`)"
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
        <el-button @click="addDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button
          :loading="btnLoading"
          type="primary"
          @click="doAdd"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t(`sys.config.dict.update`)"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="updateForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="100px"
      >
        <el-form-item
          prop="name"
          :label="$t(`sys.config.dict.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="100"
            :placeholder="$t(`sys.config.dict.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="code"
          :label="$t(`sys.config.dict.form.code`)"
        >
          <el-input
            v-model="formData.code"
            maxlength="100"
            :placeholder="$t(`sys.config.dict.form.code`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="disabled"
          :label="$t(`sys.config.dict.form.disabled`)"
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
          :loading="btnLoading"
          type="primary"
          @click="doUpdate"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t(`sys.manage.unit.sort`)"
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
  </div>
</template>

<script>
import {
  API_SYS_DICT_CHILD,
  API_SYS_DICT_TREE,
  API_SYS_DICT_CREATE,
  API_SYS_DICT_DELETE,
  API_SYS_DICT_GET,
  API_SYS_DICT_UPDATE,
  API_SYS_DICT_SORT_TREE,
  API_SYS_DICT_SORT,
  API_SYS_DICT_DISABLED
} from '@/constant/api/platform/sys/dict'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    const _self = this
    return {
      loading: true,
      btnLoading: false,
      listLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      sortDialogVisible: false,
      tableData: [],
      tableKey: '',
      isAddFromSub: false,
      options: [],
      sortMenuData: [],
      formData: {
        id: '',
        parentId: ''
      },
      props: {
        lazy: true,
        checkStrictly: true,
        multiple: false,
        emitPath: false,
        // expandTrigger: 'hover'
        // 级联选择器bug::level of null,坐等升级 2.13.0 版本
        lazyLoad(node, resolve) {
          _self.$axios
            .$get(API_SYS_DICT_TREE, {
              params: { pid: node.value }
            })
            .then((d) => {
              if (d.code === 0) {
                resolve(d.data)
              }
            })
        }
      },
      treeProps: {
        children: 'children',
        label: 'label'
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
            message: this.$t(`sys.config.dict.form.name`),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: this.$t(`sys.config.dict.form.code`),
            trigger: 'blur'
          }
        ]
      }
      return formRules
    }
  },
  created() {
    if (process.browser) {
      this.loadData()
    }
  },
  methods: {
    // 初始化加载第一级数据
    loadData() {
      this.listLoading = true
      this.$axios.$get(API_SYS_DICT_CHILD).then((d) => {
        this.listLoading = false
        if (d.code === 0) {
          this.tableData = d.data
          this.tableKey = +new Date()
        }
      })
    },
    // 动态加载子级
    loadChild(tree, treeNode, resolve) {
      this.$axios
        .$get(API_SYS_DICT_CHILD, { params: { pid: tree.id }})
        .then((d) => {
          if (d.code === 0) {
            resolve(d.data)
          }
        })
    },
    // 打开新增窗口
    openAdd() {
      this.formData = {}
      this.options = [] // 清空级联选择器的数据,使其数据动态更新
      this.addDialogVisible = true
    },
    // 提交新增数据
    doAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_DICT_CREATE, this.formData)
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
    // 新增子菜单
    addSubRow(row) {
      this.formData = {
        id: '',
        parentId: row.id,
        parentName: row.name,
        disabled: false
      }
      this.isAddFromSub = true
      if (this.$refs['addForm']) this.$refs['addForm'].resetFields()
      this.addDialogVisible = true
    },
    // 打开修改窗口
    updateRow(row) {
      this.$axios.$get(API_SYS_DICT_GET + row.id).then((d) => {
        if (d.code === 0) {
          this.formData = d.data
          this.updateDialogVisible = true
        }
      })
    },
    // 提交修改数据
    doUpdate() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_DICT_UPDATE, this.formData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.loadData()
                this.updateDialogVisible = false
              }
            })
        }
      })
    },
    // 执行删除操作
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.config.dict.delete`, { name: row.name }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_DICT_DELETE + row.id).then((d) => {
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
      this.$axios.$get(API_SYS_DICT_SORT_TREE).then((d) => {
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
    // 组装树形数据
    getTreeIds(ids, data) {
      const _self = this
      data.forEach(function(obj) {
        ids.push(obj.id)
        if (obj.children && obj.children.length > 0) {
          _self.getTreeIds(ids, obj.children)
        }
      })
    },
    // 启用禁用
    disabledChange(row) {
      this.$axios.$post(API_SYS_DICT_DISABLED, row).then((d) => {
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
    // 提交排序数据
    doSort() {
      this.btnLoading = true
      var ids = []
      this.getTreeIds(ids, this.sortMenuData)
      this.$axios
        .$post(API_SYS_DICT_SORT, { ids: ids.toString() })
        .then((d) => {
          this.btnLoading = false
          if (d.code === 0) {
            this.sortDialogVisible = false
            this.loadData()
          }
        })
    }
  }
}
</script>

