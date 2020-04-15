<template>
  <el-container>
    <el-header>
      <el-form
        :inline="true"
        ref="form"
        :model="form">
        <el-form-item prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入 票池名称"
            style="width: 150px"
            size="mini"
            @keyup.enter.native="handleFormSubmit"
            >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-search"
            @click="handleFormSubmit(true)">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-search"
            :disabled="loading"
            @click="handleChecksearch(multipleSelection)">
            勾选查询
          </el-button>
          <el-dialog
            title="勾选查询"
            width="90%"
            :visible.sync="dialogChecksearch">
            <el-table
              :data="checksearchList">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand">
                    <el-form-item label="股票代码:" style="width: 150px">
                      <span>{{props.row.stockCode}}</span>
                    </el-form-item>
                    <el-form-item label="买入时间:">
                      <span>{{props.row.buyDateStr}}</span>
                    </el-form-item>
                    <el-form-item label="买入价格:">
                      <span>{{props.row.buyPrice}}</span>
                    </el-form-item>
                    <el-form-item label="卖出时间:">
                      <span>{{props.row.sellDateStr}}</span>
                    </el-form-item>
                    <el-form-item label="卖出价格:">
                      <span>{{props.row.sellPrice}}</span>
                    </el-form-item>
                    <el-form-item label="利润:">
                      <span>{{props.row.income*100 | rounding}}%</span>
                    </el-form-item>
                    <el-form-item label="前三破五:">
                      <span>{{props.row.threeZf}}</span>
                    </el-form-item>
                    <el-form-item label="2000w/min:">
                      <span>{{props.row.twoQW}}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="日期"
                prop="DateStr">
              </el-table-column>
              <el-table-column
                label="票池名称"
                prop="Name">
              </el-table-column>
              <el-table-column
                label="平均盈利"
                prop="avgtotal">
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="newsList"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        stripe>
        <el-table-column
          type="selection"
          width="80"
          prop="ID"
          align="center">
        </el-table-column>
        <el-table-column
          label="编号"
          :show-overflow-tooltip="true"
          align="center"
          prop="ID"
          width="300">
        </el-table-column>
        <el-table-column
          label="日期"
          prop="DateStr"
          :show-overflow-tooltip="true"
          align="center"
          width="400">
        </el-table-column>
        <el-table-column
        label="票池名称"
        prop="Name"
        :show-overflow-tooltip="true"
        align="center">
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-form
        :inline="true"
        size="small">npm
        <el-form-item
          label="总计">
          {{newsList.length}}
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<style>
  .el-container {
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
    data () {
      return {
        multipleSelection: [],
        checksearchList: [],
        buyList: [],
        StockCode: [],
        selectionChange: [],
        dialogChecksearch: false,
        loading: false,
        newsList: [],
        form: {
          name: ''
        }
      }
    },
    created () {
      this.get()
    },
    methods: {
      get () {
        this.loading = true
        this.$http.get(api.getPoolLogList(this.form.name)).then((response) => {
          this.newsList = response.data
        })
          .catch((response) => {
            console.log(response)
          })
          .finally(() => {
            this.loading = false
          })
      },
      // 获取列表中的票池名称编号
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
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleChecksearch (val) {
        let clients = this._getClientIdList(val)
        if (clients.length === 0) {
          this.$message.error('请选择要操作的数据')
          return
        }
        this.dialogChecksearch = true
        this.$http.get(api.getSamePoolLogRes(clients))
          .then(checksearch => {
            this.checksearchList = checksearch.data
            this.checksearchList.forEach(function (item, index, array) {
              let avgtotal = 0
              let StockCode = 0
              let BuyDateStr = 0
              let BuyPrice = 0
              let SellDateStr = 0
              let SellPrice = 0
              let Income = 0
              let ThreeZf = 0
              let TwoQW = 0
              item.buylist.forEach(function (item1, index, array) {
                StockCode = item1.StockCode
                BuyDateStr = item1.BuyDateStr
                BuyPrice = item1.BuyPrice
                SellDateStr = item1.SellDateStr
                SellPrice = item1.SellPrice
                Income = item1.Income
                ThreeZf = item1.ThreeZf
                TwoQW = item1.TwoQW
                Income += item1.Income
              }, 0)
              item.avgtotal = (avgtotal / item.buylist.length * 100).toFixed(2) + '%'
              item.stockCode = StockCode
              item.buyDateStr = BuyDateStr
              item.buyPrice = BuyPrice
              item.sellDateStr = SellDateStr
              item.sellPrice = SellPrice
              item.income = Income
              item.threeZf = ThreeZf
              item.twoQW = TwoQW
            })
          })
          .catch((checksearch) => {
            console.log(checksearch)
          })
      },
      handleFormSubmit () {
        this.get()
      },
      handleSearch (val) {
      }
    },
    filters: {
      rounding (value) {
        return value.toFixed(2)
      }
    }
  }
</script>
