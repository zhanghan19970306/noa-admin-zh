<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.config.lang`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.config.lang.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.lang.form.add`) }}
        </el-button>

        <el-button
          v-permission="'sys.config.lang.create'"
          size="small"
          @click="openLocale"
        >
          {{ $t(`sys.lang.form.locale.manage`) }}
        </el-button>
      </div>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-search">
        <el-form
          :inline="true"
          :model="pageData"
          class="platform-content-search-form"
        ><el-form-item :label="$t(`sys.lang.form.selectLang`)">
           <el-select
             v-model="pageData.locale"
             :placeholder="$t(`sys.lang.form.selectLang`)"
           >
             <el-option
               v-for="item in localeData"
               :key="item.locale"
               :label="item.name"
               :value="item.locale"
             /> </el-select></el-form-item>
          <el-form-item label="Key">
            <el-input
              v-model="pageData.lang_key"
              placeholder="Key"
              class="platform-content-search-input"
              @keyup.enter.native="doSearch"
            />
          </el-form-item>
          <el-form-item label="Value">
            <el-input
              v-model="pageData.lang_value"
              placeholder="Value"
              class="platform-content-search-input"
              @keyup.enter.native="doSearch"
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
            <el-table-column prop="lang_key" label="Key" sortable />
            <el-table-column
              prop="lang_value"
              label="Value"
              sortable
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
                  v-permission="'sys.config.lang.update'"
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
                  v-permission="'sys.config.lang.delete'"
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="saveForm"
        :model="formData"
        :rules="saveRules"
        label-width="120px"
      >
        <el-form-item
          :label="$t(`sys.lang.form.lang_key`)"
          prop="lang_key"
        >
          <el-input
            v-model="formData.lang_key"
            tabindex="1"
            autofocus="autofocus"
          />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in localeData"
          :key="item.locale"
          :label="item.name"
        >
          <el-input
            v-model="formData.lang_value[item.locale]"
            :tabindex="'' + (index + 2)"
            autofocus="autofocus"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doSave"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t(`sys.lang.form.locale.manage`)"
      :visible.sync="dialgeLocale"
      :close-on-click-modal="false"
    >
      <div style="float:right;padding-right:15px;">
        <el-button type="text" @click="addLocale">{{
          $t(`system.commons.button.add`)
        }}</el-button>
      </div>
      <el-form ref="localeForm" :model="localeModel" size="small">
        <el-table :data="localeModel.localeManageData" stripe>
          <el-table-column
            class="el-form-item"
            :label="$t(`sys.lang.form.name`)"
            sortable
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isEdit">
                <el-form-item
                  :prop="
                    'localeManageData.' +
                      scope.$index +
                      '.name'
                  "
                  :rules="localeRules.name"
                >
                  <el-input
                    v-model="scope.row.name"
                    size="mini"
                    maxlength="20"
                  />
                </el-form-item>
              </span>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class="el-form-item"
            :label="$t(`sys.lang.form.locale`)"
            sortable
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isEdit">
                <el-form-item
                  :prop="
                    'localeManageData.' +
                      scope.$index +
                      '.locale'
                  "
                  :rules="localeRules.locale"
                >
                  <el-input
                    v-model="scope.row.locale"
                    size="mini"
                    maxlength="20"
                  />
                </el-form-item>
              </span>
              <span v-else>{{ scope.row.locale }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$t(`system.commons.txt.ext`)"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isEdit">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="
                    saveLocale(scope.row)
                  "
                >
                  {{ $t(`system.commons.button.save.mini`) }}
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="
                    cancelLocale(scope.$index)
                  "
                >
                  {{
                    $t(`system.commons.button.cancel.mini`)
                  }}
                </el-button>
              </span>
              <span v-else>
                <el-button
                  type="text"
                  size="small"
                  class="button-delete-color"
                  @click.native.prevent="
                    deleteLocale(scope.$index, scope.row)
                  "
                >
                  {{
                    $t(`system.commons.button.delete.mini`)
                  }}
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialgeLocale = false">{{
          $t(`system.commons.button.close`)
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  API_SYS_LANG_LIST,
  API_SYS_LANG_LOCALE,
  API_SYS_LANG_CREATE_OR_UPDATE,
  API_SYS_LANG_LOCALE_CREATE,
  API_SYS_LANG_LOCALE_DELETE,
  API_SYS_LANG_GET,
  API_SYS_LANG_DELETE
} from '@/constant/api/platform/sys/lang'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    return {
      loading: true,
      btnLoading: false,
      listLoading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialgeLocale: false,
      listData: [],
      localeData: [],
      localeModel: {
        localeManageData: []
      },
      pageData: {
        locale: 'zh-CN',
        lang_key: '',
        lang_value: '',
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
    saveRules() {
      const saveRules = {
        lang_key: [
          {
            required: true,
            message: this.$t(`sys.lang.form.lang_key`),
            trigger: 'blur'
          }
        ]
      }
      return saveRules
    },
    // 新增语言表单验证
    localeRules() {
      const localeRules = {
        name: [
          {
            required: true,
            message: this.$t(`sys.lang.form.name`),
            trigger: 'blur'
          }
        ],
        locale: [
          {
            required: true,
            message: this.$t(`sys.lang.form.locale`),
            trigger: 'blur'
          }
        ]
      }
      return localeRules
    }
  },
  created() {
    if (process.browser) {
      // 先查询语言,后查询语言下的字符串
      this.listLocale()
      this.listPage()
    }
  },
  methods: {
    // 打开新增窗口
    async openLocale() {
      const { data } = await this.$axios.$get(API_SYS_LANG_LOCALE, {})
      if (data) {
        this.localeModel.localeManageData = data
      }
      this.dialgeLocale = true
    },
    // 添加新语言
    addLocale() {
      this.localeModel.localeManageData.push({ isEdit: true })
    },
    // 取消添加新语言
    cancelLocale(index) {
      this.localeModel.localeManageData.splice(index, 1)
    },
    // 保持新语言
    saveLocale(row) {
      this.$refs['localeForm'].validate((valid) => {
        if (valid) {
          this.$axios
            .$post(API_SYS_LANG_LOCALE_CREATE, row)
            .then((res) => {
              this.btnLoading = false
              if (res.code === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                row.isEdit = false
                this.listLocale()
              }
            })
        }
      })
    },
    // 删除语言
    deleteLocale(index, row) {
      this.$confirm(
        this.$t(`sys.lang.form.locale.delete`, { name: row.name }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios
          .$post(API_SYS_LANG_LOCALE_DELETE, row)
          .then((res) => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.localeModel.localeManageData.splice(index, 1)
              this.listLocale()
            }
          })
      })
    },
    // 打开字符串新增窗口
    openAdd() {
      this.formData = { lang_value: {}}
      this.dialogTitle = this.$t(`sys.lang.form.title.add`)
      this.dialogVisible = true
    },
    // 提交字符串表单,若lang_key相同为修改,不同为新增
    doSave() {
      this.$refs['saveForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_LANG_CREATE_OR_UPDATE, this.formData)
            .then((d) => {
              this.btnLoading = false
              if (d.code === 0) {
                this.$message({
                  message: d.msg,
                  type: 'success'
                })
                this.dialogVisible = false
                this.listPage()
              }
            })
        }
      })
    },
    // 打开修改字符串窗口
    openUpdate(row) {
      this.$axios.$post(API_SYS_LANG_GET, row).then((d) => {
        if (d.code === 0) {
          this.formData = d.data
          this.dialogTitle = this.$t(`sys.lang.update`)
          this.dialogVisible = true
        }
      })
    },
    // 执行删除字符串
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.lang.lang_key.delete`, { lang_key: row.lang_key }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.btnLoading = true
        this.$axios.$post(API_SYS_LANG_DELETE, row).then((res) => {
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
    // 下拉框展示语言
    async listLocale() {
      const { data } = await this.$axios.$get(API_SYS_LANG_LOCALE, {})
      if (data) {
        this.localeData = data
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
      this.$axios.$post(API_SYS_LANG_LIST, this.pageData).then((res) => {
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
