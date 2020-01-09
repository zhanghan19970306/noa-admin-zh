<template>


  <el-card class="f-margin-10 f-flex-1">
        <el-button
          v-permission="'sys.manage.unit.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.manage.unit.create`) }}
        </el-button>

        <el-button
          v-permission="'sys.manage.unit.update'"
          size="small"
          @click="openSort"
        >
          {{ $t(`sys.manage.unit.sort`) }}
        </el-button>
  
   
          <el-table
            :key="tableKey"
            :data="tableData"
            style="width: 100%"
            :highlight-current-row="true"
            row-key="id"
            lazy
            :load="loadChild"
          >
            <el-table-column
              :label="$t(`sys.manage.unit.form.name`)"
              
              prop="name"
              width="200px"
              :show-overflow-tooltip="true"
              
            />

            <el-table-column
              :label="$t(`sys.manage.unit.form.address`)"
              header-
              prop="address"
              :show-overflow-tooltip="true"
              
            />

            <el-table-column
              :label="$t(`sys.manage.unit.form.telephone`)"
              header-
              prop="telephone"
              :show-overflow-tooltip="true"
              
            />

            <el-table-column
              :label="$t(`sys.manage.unit.form.website`)"
              header-
              prop="website"
              :show-overflow-tooltip="true"
              
            />

            <el-table-column
              :label="$t(`system.commons.txt.ext`)"
              :show-overflow-tooltip="true"
              width="150px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="'sys.manage.unit.update'"
                  type="text"
                  size="small"
                  @click.native.prevent="updateRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
                  v-permission="'sys.manage.unit.delete'"
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

    <el-dialog
      v-permission="'sys.manage.unit.create'"
      :title="$t(`sys.manage.unit.create`)"
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
          :label="$t(`sys.manage.unit.form.parentId`)"
        >
          <el-cascader
            v-model="formData.parentId"
            :props="props"
            :options="options"
            :placeholder="$t(`sys.manage.unit.form.parentRoot`)"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.unit.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="aliasName"
          :label="$t(`sys.manage.unit.form.aliasName`)"
        >
          <el-input
            v-model="formData.aliasName"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.aliasName`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="unitcode"
          :label="$t(`sys.manage.unit.form.unitcode`)"
        >
          <el-input
            v-model="formData.unitcode"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.unitcode`)"
            auto-complete="off"
            tabindex="4"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="address"
          :label="$t(`sys.manage.unit.form.address`)"
        >
          <el-input
            v-model="formData.address"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.address`)"
            auto-complete="off"
            tabindex="5"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="telephone"
          :label="$t(`sys.manage.unit.form.telephone`)"
        >
          <el-input
            v-model="formData.telephone"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.telephone`)"
            auto-complete="off"
            tabindex="6"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="email"
          :label="$t(`sys.manage.unit.form.email`)"
        >
          <el-input
            v-model="formData.email"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.email`)"
            auto-complete="off"
            tabindex="7"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="website"
          :label="$t(`sys.manage.unit.form.website`)"
        >
          <el-input
            v-model="formData.website"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.website`)"
            auto-complete="off"
            tabindex="8"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="note"
          :label="$t(`sys.manage.unit.form.note`)"
        >
          <el-input v-model="formData.note" type="textarea" />
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
      v-permission="'sys.manage.unit.update'"
      :title="$t(`sys.manage.unit.update`)"
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
          :label="$t(`sys.manage.unit.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="aliasName"
          :label="$t(`sys.manage.unit.form.aliasName`)"
        >
          <el-input
            v-model="formData.aliasName"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.aliasName`)"
            auto-complete="off"
            tabindex="3"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="unitcode"
          :label="$t(`sys.manage.unit.form.unitcode`)"
        >
          <el-input
            v-model="formData.unitcode"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.unitcode`)"
            auto-complete="off"
            tabindex="4"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="address"
          :label="$t(`sys.manage.unit.form.address`)"
        >
          <el-input
            v-model="formData.address"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.address`)"
            auto-complete="off"
            tabindex="5"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="telephone"
          :label="$t(`sys.manage.unit.form.telephone`)"
        >
          <el-input
            v-model="formData.telephone"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.telephone`)"
            auto-complete="off"
            tabindex="6"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="email"
          :label="$t(`sys.manage.unit.form.email`)"
        >
          <el-input
            v-model="formData.email"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.email`)"
            auto-complete="off"
            tabindex="7"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="website"
          :label="$t(`sys.manage.unit.form.website`)"
        >
          <el-input
            v-model="formData.website"
            maxlength="100"
            :placeholder="$t(`sys.manage.unit.form.website`)"
            auto-complete="off"
            tabindex="8"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="note"
          :label="$t(`sys.manage.unit.form.note`)"
        >
          <el-input v-model="formData.note" type="textarea" />
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
      v-permission="'sys.manage.unit.update'"
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
  </el-card>
</template>

<script>
import {
  API_SYS_UNIT_CHILD,
  API_SYS_UNIT_TREE,
  API_SYS_UNIT_CREATE,
  API_SYS_UNIT_DELETE,
  API_SYS_UNIT_GET,
  API_SYS_UNIT_UPDATE,
  API_SYS_UNIT_SORT_TREE,
  API_SYS_UNIT_SORT
} from '@/constant/api/platform/sys/unit'
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
            .$get(API_SYS_UNIT_TREE, {
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
            message: this.$t(`sys.manage.unit.form.name`),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: false,
            message: this.$t(`sys.manage.unit.form.email`),
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t(`sys.manage.unit.form.emailCheck`),
            trigger: ['blur', 'change']
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
      this.$axios.$get(API_SYS_UNIT_CHILD).then((d) => {
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
        .$get(API_SYS_UNIT_CHILD, { params: { pid: tree.id }})
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
            .$post(API_SYS_UNIT_CREATE, this.formData)
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
    // 打开修改窗口
    updateRow(row) {
      this.$axios.$get(API_SYS_UNIT_GET + row.id).then((d) => {
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
            .$post(API_SYS_UNIT_UPDATE, this.formData)
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
        this.$t(`sys.manage.unit.delete`, { name: row.name }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_UNIT_DELETE + row.id).then((d) => {
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
      this.$axios.$get(API_SYS_UNIT_SORT_TREE).then((d) => {
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
    // 提交排序数据
    doSort() {
      this.btnLoading = true
      var ids = []
      this.getTreeIds(ids, this.sortMenuData)
      this.$axios
        .$post(API_SYS_UNIT_SORT, { ids: ids.toString() })
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

