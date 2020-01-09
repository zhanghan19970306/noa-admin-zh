<template>
  <div class="platform-content">
    <h4 class="platform-content-title">
      <span>{{ $t(`sys.manage.msg`) }}</span>
      <div class="platform-list-op">
        <el-button
          v-permission="'sys.manage.msg.create'"
          size="small"
          type="primary"
          @click="openAdd"
        >
          {{ $t(`sys.manage.msg.create`) }}
        </el-button>
      </div>
    </h4>
    <div class="platform-content-info">
      <div class="platform-content-search">
        <el-form
          :inline="true"
          :model="pageData"
          size="small"
          class="platform-content-search-form"
        >
          <el-form-item>
            <el-radio-group
              v-model="pageData.type"
              @change="typeChange"
            >
              <el-radio-button label="">{{
                $t(`sys.manage.msg.form.type.all`)
              }}</el-radio-button>
              <el-radio-button
                v-for="type in msgType"
                :key="type.value"
                :label="type.value"
              >{{ $t(type.text) }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t(`sys.manage.msg.form.title`)">
            <el-input
              v-model="pageData.title"
              :placeholder="$t(`sys.manage.msg.form.title`)"
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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                  size="mini"
                >
                  <el-form-item
                    :label="$t(`sys.manage.msg.form.url`)"
                  >
                    <span>{{ scope.row.url }}</span>
                  </el-form-item>
                  <el-form-item
                    :label="$t(`sys.manage.msg.form.note`)"
                    :show-overflow-tooltip="true"
                  >
                    <span v-html="scope.row.note" />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t(`sys.manage.msg.form.type`)"
              sortable
            >
              <template slot-scope="scope">
                {{ $t(scope.row.type.text) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              :label="$t(`sys.manage.msg.form.title`)"
              header-align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="all_num"
              :label="$t(`sys.manage.msg.form.all_num`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  @click="viewUserList('all', scope.row.id)"
                >{{ scope.row.all_num }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="unread_num"
              :label="$t(`sys.manage.msg.form.unread_num`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  @click="
                    viewUserList('unread', scope.row.id)
                  "
                >{{ scope.row.unread_num }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="sendAt"
              :label="$t(`sys.manage.msg.form.sendAt`)"
              header-align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.sendAt | moment("datetime") }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="delFlag"
              :label="$t(`sys.manage.msg.form.status`)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.delFlag"
                  type="danger"
                >{{
                  $t(`sys.manage.msg.form.status.delete`)
                }}</el-tag>
                <el-tag
                  v-if="!scope.row.delFlag"
                  type="success"
                >{{
                  $t(`sys.manage.msg.form.status.send`)
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              :label="$t(`system.commons.txt.ext`)"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="'sys.manage.msg.delete'"
                  type="text"
                  size="small"
                  class="button-delete-color"
                  :disabled="scope.row.delFlag"
                  @click.native.prevent="deleteRow(scope.row)"
                >
                  {{
                    $t(`system.commons.button.delete.mini`)
                  }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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

    <!-- 发送消息 -->
    <el-dialog
      :title="$t(`sys.manage.msg.create`)"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="75%"
    >
      <el-form
        ref="addForm"
        :model="formData"
        :rules="formRules"
        size="small"
        label-width="80px"
      >
        <el-form-item prop="title" :label="$t(`sys.manage.msg.form.title`)">
          <el-input
            v-model="formData.title"
            maxlength="255"
            :placeholder="$t(`sys.manage.msg.form.title`)"
            auto-complete="off"
            tabindex="1"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="url" :label="$t(`sys.manage.msg.form.url`)">
          <el-input
            v-model="formData.url"
            :placeholder="$t(`sys.manage.msg.form.url`)"
            auto-complete="off"
            tabindex="2"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="type" :label="$t(`sys.manage.msg.form.type`)">
          <el-radio-group
            v-model="formData.type"
          >
            <el-radio-button
              v-for="type in msgType"
              :key="type.value"
              :label="type.value"
            >{{ $t(type.text) }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="'user' == formData.type" :label="$t(`sys.manage.msg.form.user.list`)">
          <el-row>
            <el-button
              icon="el-icon-search"
              @click="openSelect"
            >{{ $t(`sys.manage.msg.form.user.select`) }}</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              @click="clearSelect"
            >{{ $t(`sys.manage.msg.form.user.clear`) }}</el-button>
          </el-row>
          <el-table
            :data="userTableData"
            style="width: 100%;margin-top:5px;"
            size="small"
            height="200"
          >
            <el-table-column
              fixed
              prop="loginname"
              :label="$t(`sys.manage.user.form.loginname`)"
            >
              <template slot-scope="scope">
                {{ scope.row.loginname }} ({{ scope.row.username }})
              </template>
            </el-table-column>
            <el-table-column
              prop="email"
              :label="$t(`sys.manage.user.form.email`)"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="mobile"
              :label="$t(`sys.manage.user.form.mobile`)"
            />
            <el-table-column prop="unit" :label="$t(`sys.manage.user.form.unitid`)">
              <template slot-scope="scope">
                <span v-if="scope.row.unit != null">
                  {{ scope.row.unit.name }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item prop="note" :label="$t(`sys.manage.msg.form.note`)">
          <div class="ck-div">
            <QuillEditor
              ref="myQuillEditor"
              :uploadurl="uploadurl"
              :filedomain="filedomain"
            />
          </div>
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

    <!-- 选择发送用户 -->
    <el-dialog
      :title="$t(`sys.manage.msg.form.user.select`)"
      :visible.sync="selectDialogVisible"
      :close-on-click-modal="false"
      width="65%"
    >
      <div class="btn-group tool-button mt5">
        <el-input v-model="selectPageForm.searchKeyword" :placeholder="$t(`system.commons.txt.query.keyword`)" @keyup.enter.native="doSelectSearch">
          <el-select slot="prepend" v-model="selectPageForm.searchName" size="mini" :placeholder="$t(`sys.manage.msg.form.field`)" style="width: 120px;">
            <el-option :label="$t(`sys.manage.user.form.loginname`)" value="loginname" />
            <el-option :label="$t(`sys.manage.user.form.username`)" value="username" />
            <el-option :label="$t(`sys.manage.user.form.mobile`)" value="mobile" />
            <el-option :label="$t(`sys.manage.user.form.email`)" value="email" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSelectSearch" />

        </el-input>
      </div>
      <el-table
        :data="selectTableData"
        size="mini"
        style="width: 100%;margin-top: 10px;margin-bottom: 10px;"
        header-align="center"
        :default-sort="{prop: 'createdAt', order: 'descending'}"
        @sort-change="selectPageOrder"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
        />
        <el-table-column
          fixed
          prop="loginname"
          :label="$t(`sys.manage.user.form.loginname`)"
        >
          <template slot-scope="scope">
            {{ scope.row.loginname }} ({{ scope.row.username }})
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          :label="$t(`sys.manage.user.form.email`)"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="mobile"
          :label="$t(`sys.manage.user.form.mobile`)"
        />
        <el-table-column prop="unit" :label="$t(`sys.manage.user.form.unitid`)">
          <template slot-scope="scope">
            <span v-if="scope.row.unit != null">
              {{ scope.row.unit.name }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="selectPageForm.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="selectPageForm.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :current-page="selectPageForm.pageNo"
        @size-change="selectPageSizeChange"
        @current-change="selectPageNumberChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectDialogVisible = false">{{
          $t(`system.commons.button.cancel`)
        }}</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="doSelect"
        >{{ $t(`system.commons.button.ok`) }}</el-button>
      </span>
    </el-dialog>

    <el-drawer
      :title="viewUserTitle"
      :visible.sync="viewDialogVisible"
      :size="'50%'"
    >
      <el-table
        v-loading="viewListLoading"
        :data="viewTableData"
        header-align="center"
        style="width: 100%;margin-top: 10px;margin-bottom: 10px;"
        :default-sort="{ prop: 'createdAt', order: 'descending' }"
        size="small"
        @sort-change="viewPageOrder"
      >
        <el-table-column
          fixed
          prop="loginname"
          :label="$t(`sys.manage.user.form.loginname`)"
          width="150"
        />
        <el-table-column
          prop="username"
          :label="$t(`sys.manage.user.form.username`)"
          width="120"
        />
        <el-table-column
          prop="mobile"
          :label="$t(`sys.manage.user.form.mobile`)"
        />
        <el-table-column
          prop="email"
          :label="$t(`sys.manage.user.form.email`)"
        />
        <el-table-column
          prop="unitname"
          :label="$t(`sys.manage.user.form.unitid`)"
        />
      </el-table>
      <el-pagination
        :current-page="viewPageForm.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="viewPageForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="viewPageForm.totalCount"
        @size-change="viewPageSizeChange"
        @current-change="viewPageNumberChange"
      />
    </el-drawer>
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
import { API_UPLOAD_IMAGE } from '@/constant/api/platform/pub/upload'
import { mapState } from 'vuex'
import {
  API_SYS_MSG_LIST,
  API_SYS_MSG_DELETE,
  API_SYS_MSG_GET_TYPE,
  API_SYS_MSG_GET_USER_VIEW_LIST,
  API_SYS_MSG_SELECT_USER_LIST,
  API_SYS_MSG_CREATE
} from '@/constant/api/platform/sys/msg'
export default {
  middleware: ['authenticated', 'check_permissions'],
  components: {
    QuillEditor
  },
  data() {
    return {
      loading: true,
      btnLoading: false,
      addDialogVisible: false,
      listLoading: false,
      viewListLoading: false,
      selectDialogVisible: false,
      listData: [],
      msgType: [],
      pageData: {
        title: '',
        type: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'createdAt',
        pageOrderBy: 'descending'
      },
      viewDialogVisible: false,
      viewTableData: [],
      viewUserTitle: '',
      viewPageForm: {
        id: '',
        type: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'loginname',
        pageOrderBy: 'descending'
      },
      selectPageForm: {
        searchKeyword: '',
        searchName: '',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: 'loginname',
        pageOrderBy: 'descending'
      },
      formData: { type: 'system' },
      userTableData: [],
      selectUsers: [],
      selectTableData: [],
      filedomain: '',
      uploadurl: ''
    }
  },
  computed: {
    ...mapState({
      conf: (state) => state.conf
    }),
    formRules() {
      const formRules = {
        title: [
          {
            required: true,
            message: this.$t(`sys.manage.msg.form.title`),
            trigger: ['blur', 'change']
          }
        ]
      }
      return formRules
    }
  },
  created() {
    if (process.browser) {
      this.getType()
      this.listPage()
      this.filedomain = this.conf.AppFileDomain
      this.uploadurl = process.env.API + API_UPLOAD_IMAGE
    }
  },
  methods: {
    // 获取消息类型
    async getType() {
      const { data } = await this.$axios.$get(API_SYS_MSG_GET_TYPE, {})
      if (data) {
        this.msgType = data
      }
    },
    // 查询条件消息类型变化事件
    typeChange(val) {
      this.pageData.pageNo = 1
      this.pageData.type = val
      this.listPage()
    },
    // 打开选择用户
    openSelect() {
      this.selectDialogVisible = true
      this.selectPageLoad()
    },
    // 清空已选用户
    clearSelect() {
      this.userTableData = []
    },
    // 执行选择用户
    doSelect() {
      this.selectDialogVisible = false
      this.selectUsers.forEach((o) => {
        this.userTableData.push(o)
      })
    },
    // 选择用户时事件
    handleSelectionChange(val) {
      this.selectUsers = val
    },
    // 页排序事件
    selectPageOrder(column) {
      this.selectPageForm.pageOrderName = column.prop
      this.selectPageForm.pageOrderBy = column.order
      this.selectPageLoad()
    },
    // 页码变动事件
    selectPageNumberChange(val) {
      this.selectPageForm.pageNo = val
      this.selectPageLoad()
    },
    // 页大小变动事件
    selectPageSizeChange(val) {
      this.selectPageForm.pageSize = val
      this.selectPageLoad()
    },
    // 搜索符合条件的用户
    doSelectSearch() {
      this.selectPageForm.pageNo = 1
      this.selectPageLoad()
    },
    // 查询用户
    selectPageLoad() {
      this.$axios.$post(API_SYS_MSG_SELECT_USER_LIST, this.selectPageForm).then((res) => {
        if (res.code === 0) {
          this.selectTableData = res.data.list
          this.selectPageForm.totalCount = res.data.totalCount
        }
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
      this.$axios.$post(API_SYS_MSG_LIST, this.pageData).then((res) => {
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
    // 页排序事件
    viewPageOrder(column) {
      this.viewPageForm.pageOrderName = column.prop
      this.viewPageForm.pageOrderBy = column.order
      this.viewPageLoad()
    },
    // 页码变动事件
    viewPageNumberChange(val) {
      this.viewPageForm.pageNo = val
      this.viewPageLoad()
    },
    // 页大小变动事件
    viewPageSizeChange(val) {
      this.viewPageForm.pageSize = val
      this.viewPageLoad()
    },
    // 用户列表
    viewPageLoad() {
      this.viewListLoading = true
      this.$axios
        .$post(API_SYS_MSG_GET_USER_VIEW_LIST, this.viewPageForm)
        .then((res) => {
          this.viewListLoading = false
          if (res.code === 0) {
            this.viewTableData = res.data.list
            this.viewPageForm.totalCount = res.data.totalCount
          }
        })
    },
    // 打开用户侧边栏
    viewUserList(type, id) {
      if (type === 'all') {
        this.viewUserTitle = this.$t(`sys.manage.msg.alluser`)
      }
      if (type === 'unread') {
        this.viewUserTitle = this.$t(`sys.manage.msg.unreaduser`)
      }
      this.viewDialogVisible = true
      this.viewPageForm.type = type
      this.viewPageForm.id = id
      this.viewPageLoad()
    },
    // 发送消息
    openAdd() {
      if (this.$refs['addForm']) { // 表单初始化,消除上次操作残留
        this.$refs['addForm'].resetFields()
      }
      this.clearSelect()
      this.addDialogVisible = true
    },
    // 执行发送消息
    doAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          var users = []
          if (this.selectUsers) {
            this.selectUsers.forEach((o) => {
              users.push(o.loginname)
            })
          }
          if (this.formData.type === 'user' && users.length === 0) {
            this.$message({
              message: this.$t(`sys.manage.msg.form.please.select`),
              type: 'error'
            })
            return false
          }
          this.$set(this.formData, 'note', this.$refs.myQuillEditor.content)
          this.$set(this.formData, 'users', users.toString())
          this.btnLoading = true
          this.$axios
            .$post(API_SYS_MSG_CREATE, this.formData)
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
    // 执行删除字符串
    deleteRow(row) {
      this.$confirm(
        this.$t(`sys.manage.msg.delete`, { name: row.title }),
        this.$t(`system.commons.txt.notice`),
        {
          confirmButtonText: this.$t(`system.commons.button.ok`),
          cancelButtonText: this.$t(`system.commons.button.cancel`),
          type: 'warning'
        }
      ).then(() => {
        this.$axios.$delete(API_SYS_MSG_DELETE + row.id).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.listPage()
          }
        })
      })
    }
  }
}
</script>

<style>
/* 表格扩展 */
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
}
.demo-table-expand .el-form-item .el-form-item__label {
    font-size: 12px;
}
.demo-table-expand .el-form-item .el-form-item__content {
    font-size: 12px;
}
.el-drawer__body {
    overflow-y: auto;
}
.el-drawer__wrapper div,
span,
button,
i {
    outline: none;
}
</style>
