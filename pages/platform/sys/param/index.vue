<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.manage.param`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.manage.param.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.manage.param.create`) }}
        </el-button>
      </div>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-list">
        <div class="platform-content-list-table">
          <el-table
            v-loading="listLoading"
            :data="listData"
            stripe
            @sort-change="doPageSort"
          >
            <el-table-column
              prop="configKey"
              :label="$t(`sys.manage.param.form.configKey`)"
              sortable
            />
            <el-table-column
              prop="configValue"
              :label="$t(`sys.manage.param.form.configValue`)"
              sortable
            />
            <el-table-column
              prop="note"
              :label="$t(`sys.manage.param.form.note`)"
            />
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              :label="$t(`system.commons.txt.ext`)"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="'sys.manage.param.update'"
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
                  v-permission="'sys.manage.param.delete'"
                  type="text"
                  size="small"
                  class="button-delete-color"
                  :disabled="
                    scope.row.configKey.indexOf('App') === 0
                  "
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
      :title="$t(`sys.manage.param.create`)"
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
          prop="configKey"
          :label="$t(`sys.manage.param.form.configKey`)"
        >
          <el-input
            v-model="formData.configKey"
            maxlength="100"
            :placeholder="$t(`sys.manage.param.form.configKey`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="configValue"
          :label="$t(`sys.manage.param.form.configValue`)"
        >
          <el-input
            v-model="formData.configValue"
            maxlength="100"
            :placeholder="$t(`sys.manage.param.form.configValue`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="note"
          :label="$t(`sys.manage.param.form.note`)"
        >
          <el-input v-model="formData.note" type="textarea" />
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

    <el-dialog
      :title="$t(`sys.manage.param.update`)"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form
        ref="editForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          prop="configKey"
          :label="$t(`sys.manage.param.form.configKey`)"
        >
          <el-input
            v-model="formData.configKey"
            maxlength="100"
            :placeholder="$t(`sys.manage.param.form.configKey`)"
            :disabled="true"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="configValue"
          :label="$t(`sys.manage.param.form.configValue`)"
        >
          <el-input
            v-model="formData.configValue"
            maxlength="100"
            :placeholder="$t(`sys.manage.param.form.configValue`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="note"
          :label="$t(`sys.manage.param.form.note`)"
        >
          <el-input v-model="formData.note" type="textarea" />
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
import {
  API_SYS_PARAM_LIST,
  API_SYS_PARAM_GET,
  API_SYS_PARAM_CREATE,
  API_SYS_PARAM_DELETE,
  API_SYS_PARAM_UPDATE
} from '@/constant/api/platform/sys/param'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    return {
      loading: true,
      btnLoading: false,
      listLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      listData: [],
      pageData: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'createdAt',
        pageOrderBy: 'descending'
      },
      formData: {
        lang_value: {}
      }
    }
  },
  computed: {
    // 表单验证,写在computed里切换多语言才会更新
    formRules() {
      const formRules = {
        configKey: [
          {
            required: true,
            message: this.$t(`sys.manage.param.form.configKey`),
            trigger: 'blur'
          }
        ],
        configValue: [
          {
            required: true,
            message: this.$t(`sys.manage.param.form.configValue`),
            trigger: 'blur'
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
    // 打开字新增窗口
    openAdd() {
      this.formData = {}
      this.addDialogVisible = true
    },
    // 提交表单
    doAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_PARAM_CREATE, this.formData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.addDialogVisible = false
                this.listPage()
              }
            })
        }
      })
    },
    // 打开修改窗口
    openUpdate(row) {
      this.$axios.$get(API_SYS_PARAM_GET + row.configKey).then((d) => {
        if (d.code === 0) {
          this.formData = d.data
          this.updateDialogVisible = true
        }
      })
    },
    // 提交表单
    doUpdate() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_PARAM_UPDATE, this.formData)
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
    },
    // 执行删除
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.manage.param.delete`, { name: row.configKey }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.btnLoading = true
        this.$axios
          .$delete(API_SYS_PARAM_DELETE + row.configKey)
          .then((res) => {
            this.btnLoading = false
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.listPage()
            }
          })
      })
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
      this.$axios.$post(API_SYS_PARAM_LIST, this.pageData).then((res) => {
        this.listLoading = false
        if (res.code === 0) {
          this.listData = res.data.list
          this.pageData.totalCount = res.data.totalCount
        }
      })
    },
    // 条件查询展示第一页内容
    doSearch() {
      this.pageData.pageNumber = 1
      this.listPage()
    }
  }
}
</script>
