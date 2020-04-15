<template>
    <el-container>
      <el-header>
        <el-form
          :inline="true"
          :model="form"
          ref="form"
          size="mini">

          <el-form-item prop="dateStr">
            <el-date-picker
              type="date"
              size="mini"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 150px"
              placeholder="根据日期查询"
              v-model="form.dateStr">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-search"
              :disabled="loading"
              @click="handleFormSubmit(true)">
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            :disabled="loading"
            @click="handleDelete(selectionChange)">
            删除
          </el-button>
          </el-form-item>
          <el-form-item>
            <download-excel
              class = "export-excel-wrapper"
              :data = "newsList_data"
              :fields = "newsList_fields"
              :before-generate = "beforeDownload"
              name = "票池详情.xls">
              <el-button type="danger" size="mini">导出EXCEL</el-button>
            </download-excel>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          :data="newsList"
          v-model="tableNewlist"
          @row-click="tableCheck"
          @selection-change="handleSelectionChange"
          stripe>
          <el-table-column
            type="selection"
            width="80"
            prop="ID"
            align="center">
          </el-table-column>
          <el-table-column
            label="编号"
            prop="ID"
            sortable
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            label="日期"
            prop="DateStr"
            :show-overflow-tooltip="true"
            width="200">
          </el-table-column>
          <el-table-column
            label="票池名称"
            prop="Name"
            :show-overflow-tooltip="true"
            width="250">
          </el-table-column>
          <el-table-column
            label="总盈利"
            prop="Total"
            sortable
            :show-overflow-tooltip="true"
            width="200">
            <template slot-scope="scope">
              <span>{{scope.row.Total*100 | rounding}}%</span>
            </template>
          </el-table-column>
          <el-table-column
            label="平均盈利"
            prop="AVG"
            sortable
            :show-overflow-tooltip="true"
            width="200">
            <template slot-scope="scope">
              <span>{{scope.row.AVG*100 | rounding}}%</span>
            </template>
          </el-table-column>
          <el-table-column
            label="未卖出数量"
            prop="NoSell"
            width="200"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="票池总数"
            width="200"
            prop="Number"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <el-dialog title="票池详情" :visible.sync="dialogTableCheck" width="90%">
          <el-table
            :data="tablecheckData"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="80"
              prop="ID"
              align="center">
            </el-table-column>
            <el-table-column
              label="日期"
              prop="BuyDateStr"
              :show-overflow-tooltip="true"
              width="150">
            </el-table-column>
            <el-table-column
              label="股票代码"
              prop="StockCode"
              :show-overflow-tooltip="true"
              width="120">
            </el-table-column>
            <el-table-column
              label="买入时间"
              sortable
              prop="BuyTimeStr"
              :show-overflow-tooltip="true"
              width="180">
            </el-table-column>
            <el-table-column
              label="买入价格"
              sortable
              prop="BuyPrice"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.BuyPrice | rounding}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="卖出时间"
              sortable
              prop="SellTimeStr"
              :show-overflow-tooltip="true"
              width="180">
            </el-table-column>
            <el-table-column
              label="卖出价格"
              sortable
              prop="SellPrice"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.SellPrice | rounding}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="利润"
              sortable
              prop="Income"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.Income*100 | rounding}}%</span>
              </template>
            </el-table-column>
            <el-table-column
              label="前三破五"
              prop="ThreeZf"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="statusThreezf[scope.row.ThreeZf].type">
                  {{statusThreezf[scope.row.ThreeZf].text}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="2000w/min"
              prop="TwoQW"
              :show-overflow-tooltip="true"
              width="120">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="statusTwoqw[scope.row.TwoQW].type">
                  {{statusTwoqw[scope.row.TwoQW].text}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-form
            :model="formTablecheck"
            :inline="true"
            size="small">
            <el-form-item
              label="总计">
              {{formTablecheck.total}}
            </el-form-item>
            <el-form-item
              label="平均利润">
              {{formTablecheck.avgtotal*100 | rounding}}%
            </el-form-item>
            <el-form-item
              label="盈利数量">
              {{formTablecheck.profit}}
            </el-form-item>
            <el-form-item
              label="亏损数量">
              {{formTablecheck.loss}}
            </el-form-item>
            <el-form-item
              label="不盈不亏">
              {{formTablecheck.flat}}
            </el-form-item>
            <el-form-item>
              <download-excel
                class = "export-excel-wrapper"
                :data = "json_data"
                :fields = "json_fields"
                :before-generate = "startDownload"
                name = "票池详情.xls">
                <el-button type="danger" size="mini">导出EXCEL</el-button>
              </download-excel>
            </el-form-item>
          </el-form>
<!--          <el-input type="textarea" v-model="dialogText"></el-input>-->
        </el-dialog>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
</template>
<style>
  .el-container{
    width: 100%;
    height: 700px;
    padding-top: 15px;
  }
</style>
<script>
  import api from '../api'
  export default {
    props: {
    },
    watch: {
      selectionChange: {
        handler (val) {
          let profit = 0
          let loss = 0
          let flat = 0
          let avgtotal = 0
          val.forEach(function (item, index, array) {
            if (item.Income > 0) {
              profit++
            } else if (item.Income < 0) {
              loss++
            } else {
              flat++
            }
          })
          val.forEach(function (item, index, array) {
            avgtotal += item.Income
          }, 0)
          this.formTablecheck.total = val.length
          this.formTablecheck.profit = profit
          this.formTablecheck.loss = loss
          this.formTablecheck.flat = flat
          this.formTablecheck.avgtotal = avgtotal / val.length
        },
        immediate: true
      }
    },
    data () {
      return {
        json_data: [],
        newsList_data: [],
        newsList_fields: {
          '日期': 'DateStr',
          '票池名称': 'Name',
          '总盈利': 'Total',
          '平均盈利': 'AVG',
          '未卖出数量': 'NoSell',
          '票池总数': 'SellCount'
        },
        json_fields: {
          '日期': 'BuyDateStr',
          '股票代码': 'StockCode',
          '买入时间': 'BuyTimeStr',
          '买入价格': 'BuyPrice',
          '卖出时间': 'SellTimeStr',
          '卖出价格': 'SellPrice',
          '利润': 'Income',
          '前三破五': 'ThreeZf',
          '2000W/Min': 'TwoQW'
        },
        newsList: [],
        tableNewlist: {
          total: 0
        },
        tablecheckData: [],
        deletePoollist: [],
        dialogText: '',
        selectionChange: [],
        dialogTableCheck: false,
        loading: false,
        form: {
          dateStr: undefined
        },
        formTablecheck: {
          total: 0,
          profit: 0,
          loss: 0,
          flat: 0,
          avgtotal: 0
        },
        statusTwoqw: {
          0: {
            text: '不满足',
            type: 'danger'
          },
          1: {
            text: '满足',
            type: 'success'
          }
        },
        statusThreezf: {
          0: {
            text: '不满足',
            type: 'danger'
          },
          1: {
            text: '满足',
            type: 'success'
          }
        },
        ID: undefined
      }
    },
    created () {
      this.get()
    },
    methods: {
      get () {
        this.loading = true
        this.$http.get(api.getPoolResLog(this.form.dateStr)).then((response) => {
          this.newsList = response.data
          let number = 0
          this.newsList.forEach(function (item, index, arr) {
            number = item.SellCount + item.NoSell
            item.Number = number
          })
        })
          .catch((response) => {
          })
          .finally(() => {
            this.loading = false
          })
      },
      getTablecheck () {
        this.loading = true
        this.$http.get(api.getPoolResList(this.ID)).then((checkdata) => {
          this.tablecheckData = checkdata.data.buylist
          this.dialogText = checkdata.data.notin
        })
          .catch((checkdata) => {
          })
          .finally(() => {
            this.loading = false
          })
      },
      // table弹出dialog
      tableCheck (row, column, event) {
        this.ID = row.ID
        this.dialogTableCheck = true
        this.getTablecheck()
      },
      handleFormSubmit () {
        this.get()
      },
      handleSelectionChange (val) {
        this.selectionChange = val
      },
      // 获取ID
      _getClientIdList (val) {
        let clients = []
        if (Array.isArray(val)) {
          val.forEach(value => {
            clients.push(value.ID)
          })
        } else {
          clients.push(this.newsList[val].ID)
        }

        return clients
      },
      // 批量删除
      handleDelete (val) {
        let clients = this._getClientIdList(val)
        if (clients.length === 0) {
          this.$message.error('请选择要操作的数据')
          return
        }
        this.$http.post(api.delPoolResList(), {'ID': clients})
        .then(() => {
          this.$router.go(0)
        })
          .catch(() => {
          })
      },
      // 导出Excel
      startDownload () {
        let aaa = []
        aaa = this.tablecheckData
        aaa.forEach(item => {
          item.StockCode = '\'' + item.StockCode
          item.BuyTimeStr = '\'' + item.BuyTimeStr
          item.SellTimeStr = '\'' + item.SellTimeStr
        })
        this.json_data = aaa
      },
      beforeDownload () {
        let aaa = []
        aaa = this.newsList
        aaa.forEach(item => {
          item.DateStr = '\'' + item.DateStr
        })
        this.newsList_data = aaa
      }
    },
    // 保留两位有效小数
    filters: {
      rounding (value) {
        return value.toFixed(2)
      }
    }
  }
</script>
