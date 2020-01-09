<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.manage.log`) }}</span>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-search">
        <el-form
          :inline="true"
          :model="pageData"
          class="platform-content-search-form"
        >
          <el-form-item :label="$t(`sys.manage.log.form.type`)">
            <el-select
              v-model="pageData.searchType"
              :placeholder="$t(`sys.manage.log.form.type`)"
              size="medium"
            >
              <el-option
                v-for="item in logType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t(`sys.manage.log.form.date`)">
            <el-date-picker
              v-model="searchDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              :range-separator="$t(`el.datepicker.to`)"
              :start-placeholder="$t(`el.datepicker.startDate`)"
              :end-placeholder="$t(`el.datepicker.endDate`)"
              align="right"
              size="medium"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
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
            :default-sort="{
              prop: 'createdAt',
              order: 'descending'
            }"
            stripe
            @sort-change="doPageSort"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                  size="mini"
                >
                  <el-form-item
                    :label="$t(`sys.manage.log.form.param`)"
                  >
                    <span>
                      {{
                        scope.row.param ||
                          $t(`el.table.emptyText`)
                      }}</span>
                  </el-form-item>
                  <el-form-item
                    :label="
                      $t(`sys.manage.log.form.result`)
                    "
                  >
                    <span>
                      {{
                        scope.row.result ||
                          $t(`el.table.emptyText`)
                      }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginname"
              :label="$t(`system.commons.txt.createdBy`)"
              sortable
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.loginname }}({{
                  scope.row.username
                }})
              </template>
            </el-table-column>
            <el-table-column
              prop="createdAt"
              :label="$t(`system.commons.txt.createdAt`)"
              sortable
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.createdat">{{
                  scope.row.createdat | moment("datetime")
                }}</span>
                <span v-if="scope.row.createdAt">{{
                  scope.row.createdAt | moment("datetime")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t(`sys.manage.log.form.type`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'platform'">
                  {{
                    $t(`sys.manage.log.form.type.platform`)
                  }}
                </span>
                <span v-if="scope.row.type == 'info'">
                  {{ $t(`sys.manage.log.form.type.info`) }}
                </span>
                <span v-if="scope.row.type == 'api'">
                  {{ $t(`sys.manage.log.form.type.api`) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="tag"
              :label="$t(`sys.manage.log.form.tag`)"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="src"
              :label="$t(`sys.manage.log.form.src`)"
              header-align="left"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="msg"
              :label="$t(`sys.manage.log.form.msg`)"
              header-align="left"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              prop="ip"
              label="IP"
              header-align="left"
              :show-overflow-tooltip="true"
            />
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
  </div>
</template>

<script>
import moment from 'moment'
import { API_SYS_LOG_LIST } from '@/constant/api/platform/sys/log'
export default {
  middleware: ['authenticated', 'check_permissions'],
  data() {
    return {
      loading: true,
      btnLoading: false,
      listLoading: false,
      listData: [],
      searchDate: [],
      pageData: {
        searchType: '',
        searchDate: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'createdAt',
        pageOrderBy: 'descending'
      },
      logType: [
        {
          value: '',
          label: this.$t(`sys.manage.log.form.type.all`)
        },
        {
          value: 'platform',
          label: this.$t(`sys.manage.log.form.type.platform`)
        },
        {
          value: 'info',
          label: this.$t(`sys.manage.log.form.type.info`)
        },
        {
          value: 'api',
          label: this.$t(`sys.manage.log.form.type.api`)
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          var threeMonths = moment()
            .add(-3, 'months')
            .valueOf()
          return (
            time.getTime() > Date.now() ||
                        time.getTime() < threeMonths
          )
        },
        shortcuts: [
          {
            text: this.$t(`sys.manage.log.oneweek`),
            onClick(picker) {
              var end = new Date()
              var start = new Date()
              var temp = moment()
                .add(-1, 'weeks')
                .valueOf()
              start.setTime(temp)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t(`sys.manage.log.onemonth`),
            onClick(picker) {
              var end = new Date()
              var start = new Date()
              var temp = moment()
                .add(-1, 'months')
                .valueOf()
              start.setTime(temp)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t(`sys.manage.log.threemonth`),
            onClick(picker) {
              var end = new Date()
              var start = new Date()
              var temp = moment()
                .add(-3, 'months')
                .valueOf()
              start.setTime(temp)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    // 监听语言变化,为data重新赋值,解决语言切换不更新的问题
    getLocale() {
      return this.$i18n.locale
    }
  },
  watch: {
    // 监听语言变化,为data重新赋值,解决语言切换不更新的问题
    getLocale(newval, oldval) {
      this.logType = [
        {
          value: '',
          label: this.$t(`sys.manage.log.form.type.all`)
        },
        {
          value: 'platform',
          label: this.$t(`sys.manage.log.form.type.platform`)
        },
        {
          value: 'info',
          label: this.$t(`sys.manage.log.form.type.info`)
        },
        {
          value: 'api',
          label: this.$t(`sys.manage.log.form.type.api`)
        }
      ]
      this.pickerOptions.shortcuts = [
        {
          text: this.$t(`sys.manage.log.oneweek`),
          onClick(picker) {
            var end = new Date()
            var start = new Date()
            var temp = moment()
              .add(-1, 'weeks')
              .valueOf()
            start.setTime(temp)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: this.$t(`sys.manage.log.onemonth`),
          onClick(picker) {
            var end = new Date()
            var start = new Date()
            var temp = moment()
              .add(-1, 'months')
              .valueOf()
            start.setTime(temp)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: this.$t(`sys.manage.log.threemonth`),
          onClick(picker) {
            var end = new Date()
            var start = new Date()
            var temp = moment()
              .add(-3, 'months')
              .valueOf()
            start.setTime(temp)
            picker.$emit('pick', [start, end])
          }
        }
      ]
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
      if (this.searchDate) {
        this.pageData.searchDate = this.searchDate.toString()
      } else {
        this.pageData.searchDate = ''
      }
      this.$axios.$post(API_SYS_LOG_LIST, this.pageData).then((res) => {
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

<style>
/* 表格 */
.demo-table-expand {
    font-size: 0px;
    padding-left: 115px;
}
.demo-table-expand label {
    width: 120px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    font-size: 12px;
}
.demo-table-expand .el-form-item .el-form-item__label {
    font-size: 12px;
}
.demo-table-expand .el-form-item .el-form-item__content {
    font-size: 12px;
}
</style>
