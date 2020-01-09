<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.manage.task`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.manage.task.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.manage.task.create`) }}
        </el-button>
      </div>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-list">
        <div class="platform-content-list-table">
          <el-table
            v-loading="listLoading"
            :data="listData"
            :default-sort="{
              prop: 'createdAt',
              order: 'descending'
            }"
            stripe
            @sort-change="doPageSort"
          >
            <el-table-column
              prop="name"
              :label="$t(`sys.manage.task.form.name`)"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="jobClass"
              :show-overflow-tooltip="true"
              :label="$t(`sys.manage.task.form.jobClass`)"
              header-align="center"
              align="left"
            />
            <el-table-column
              prop="data"
              :show-overflow-tooltip="true"
              :label="$t(`sys.manage.task.form.data`)"
              header-align="center"
              align="left"
            />
            <el-table-column
              prop="cron"
              :label="$t(`sys.manage.task.form.cron`)"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="exeAt"
              :label="$t(`sys.manage.task.form.exeAt`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.exeAt | moment("datetime") }}
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
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="'sys.manage.task.update'"
                  type="text"
                  size="small"
                  @click.native.prevent="updateRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.update.mini`)
                  }}
                </el-button>
                <el-button
                  v-permission="'sys.manage.task.delete'"
                  type="text"
                  size="small"
                  class="button-delete-color"
                  :disabled="
                    scope.row.jobClass &&
                      listData.length === 1 &&
                      scope.row.jobClass.indexOf(
                        'TestJob'
                      ) > 0
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
      :title="$t(`sys.manage.task.create`)"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="addForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.task.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="50"
            :placeholder="$t(`sys.manage.task.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="jobClass"
          :label="$t(`sys.manage.task.form.jobClass`)"
        >
          <el-input
            v-model="formData.jobClass"
            maxlength="255"
            :placeholder="$t(`sys.manage.task.form.jobClass`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="cron"
          :label="$t(`sys.manage.task.form.cron`)"
        >
          <cron-input v-model="formData.cron" />
        </el-form-item>
        <el-form-item
          prop="data"
          :label="$t(`sys.manage.task.form.data`) + '(Json)'"
        >
          <el-input
            v-model="formData.data"
            type="textarea"
            placeholder="{}"
            tabindex="4"
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
      :title="$t(`sys.manage.task.update`)"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="updateForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          prop="name"
          :label="$t(`sys.manage.task.form.name`)"
        >
          <el-input
            v-model="formData.name"
            maxlength="50"
            :placeholder="$t(`sys.manage.task.form.name`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="jobClass"
          :label="$t(`sys.manage.task.form.jobClass`)"
        >
          <el-input
            v-model="formData.jobClass"
            maxlength="50"
            :placeholder="$t(`sys.manage.task.form.jobClass`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="cron"
          :label="$t(`sys.manage.task.form.cron`)"
        >
          <cron-input v-model="formData.cron" />
        </el-form-item>
        <el-form-item
          prop="data"
          :label="$t(`sys.manage.task.form.data`) + '(Json)'"
        >
          <el-input
            v-model="formData.data"
            type="textarea"
            placeholder="{}"
            tabindex="4"
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
  </div>
</template>

<script>
import CronInput from './CronInput'
import {
  API_SYS_TASK_LIST,
  API_SYS_TASK_UPDATE,
  API_SYS_TASK_DELETE,
  API_SYS_TASK_CREATE,
  API_SYS_TASK_GET,
  API_SYS_TASK_DISABLED
} from '@/constant/api/platform/sys/task'
export default {
  components: {
    CronInput
  },
  data() {
    return {
      loading: true,
      btnLoading: false,
      listLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      listData: [],
      formData: {
        cron: ''
      },
      pageData: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'createdAt',
        pageOrderBy: 'descending'
      }
    }
  },
  computed: {
    getLocale() {
      return this.$i18n.locale
    },
    // 表单验证,写在computed里切换多语言才会更新
    formRules() {
      const formRules = {
        name: [
          {
            required: true,
            message: this.$t(`sys.manage.task.form.name`),
            trigger: 'blur'
          }
        ],
        jobClass: [
          {
            required: true,
            message: this.$t(`sys.manage.task.form.jobClass`),
            trigger: 'blur'
          }
        ],
        cron: [
          {
            required: true,
            message: this.$t(`sys.manage.task.form.cron`),
            trigger: 'blur'
          }
        ]
      }
      return formRules
    }
  },
  watch: {
    // 监听语言变化,为data重新赋值,解决语言切换不更新的问题
    getLocale(newval, oldval) {
      if (newval === 'zh-CN') {
        this.cronLocale = 'cn'
      }
      if (newval === 'en-US') {
        this.cronLocale = 'en'
      }
    }
  },
  created() {
    if (process.browser) {
      this.listPage()
    }
  },
  methods: {
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
      this.$axios.$post(API_SYS_TASK_LIST, this.pageData).then((res) => {
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
    },
    // 打开新增窗口
    openAdd() {
      this.formData = {}
      this.addDialogVisible = true
    },
    // 提交新增数据
    doAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_TASK_CREATE, this.formData)
            .then((d) => {
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
    // 打开修改窗口
    updateRow(row) {
      this.$axios.$get(API_SYS_TASK_GET + row.id).then((d) => {
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
            .$post(API_SYS_TASK_UPDATE, this.formData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.listPage()
                this.updateDialogVisible = false
              }
            })
        }
      })
    },
    // 执行删除操作
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.manage.task.delete`, { name: row.name }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_TASK_DELETE + row.id).then((d) => {
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
    // 启用禁用
    disabledChange(row) {
      this.$axios.$post(API_SYS_TASK_DISABLED, row).then((d) => {
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
    }
  },
  middleware: ['authenticated', 'check_permissions']
}
</script>
