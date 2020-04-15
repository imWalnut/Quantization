<template>
  <el-container>
    <el-header>
      <el-form
        :inline="true"
        :model="form"
        ref="form"
        size="mini">
        <!--日期筛选框-->
        <el-form-item prop="dateStr">
          <el-date-picker
            type="date"
            size="mini"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 150px"
            v-model="form.dateStr">
          </el-date-picker>
        </el-form-item>
        <!--查询按钮-->
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
        <!--输入票池-->
        <el-form-item>
          <el-button type="danger" @click="handleCreate">
            输入票池
          </el-button>
          <el-dialog title="输入票池" :show-close="false" :visible.sync="dialogFormVisible">
            <el-form
              :model="formDialog"
              ref="formDialog"
              label-width="150px">
              <el-form-item label="    ">
                  <el-button size="mini" @click="handleCancel">取 消</el-button>
                  <el-button size="mini" type="primary" @click="createTicketpool" :loading="dialogLoading">确 定</el-button>
              </el-form-item>
              <el-form-item label="票池名称" prop="name">
                <el-input
                  v-model="formDialog.name"
                  type="textarea"
                  style="width: 300px"
                  autosize
                  autocomplete="off">
                </el-input>
              </el-form-item>
              <el-form-item label="输入日期" prop="pd">
                <el-input
                  v-model="formDialog.pd"
                  type="textarea"
                  style="width: 300px"
                  autosize
                  @input="handlePdinput"
                  autocomplete="off">
                </el-input>
              </el-form-item>
              <el-form-item label="股票代码" prop="pool">
                <el-input
                  type="textarea"
                  v-model="formDialog.pool"
                  style="width: 300px"
                  autosize>
                </el-input>
              </el-form-item>

              <input class="input-file" type="file" @change="exportData" accept=".txt, text/plain"/>
              <el-form-item label="选择文件">
                <el-button @click="btnClick" type="primary" size="mini">选择文件</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-form-item>
<!--        导出Excel-->
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
<!--        日期段查询-->
        <el-form-item>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-search"
            @click="dialogTimebucket = true">
            日期段查询
          </el-button>
          <el-dialog
            title="日期段查询"
            width="90%"
            :visible.sync="dialogTimebucket">
<!--            查询栏-->
            <el-form
              :model="formTimebucket"
              ref="formTimebucket">
              <el-form-item>
                <el-date-picker
                  v-model="formTimebucket.sd"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  size="mini"
                  style="width: 150px"
                  placeholder="开始日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至">
                <el-date-picker
                  v-model="formTimebucket.ed"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  size="mini"
                  style="width: 150px"
                  placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <!--查询按钮-->
              <el-form-item>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-search"
                  :disabled="loading"
                  @click="handleFormtimebucket(true)">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
<!--            日期查询表单-->
            <el-table
              :data="timebucketList"
              stripe>
              <el-table-column
                label="日期"
                prop="datestr"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="数量"
                prop="count"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="盈利数量"
                prop="profitcount"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="亏损数量"
                prop="losscount"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="持平数量"
                prop="noprofitcount"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="没有卖出数量"
                prop="nosell"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="卖出平均盈利"
                prop="profitaverage"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{scope.row.profitaverage*100 | rounding}}%</span>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogTimebucket = false">取 消</el-button>
              <el-button type="primary" @click="dialogTimebucket = false">确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <!--    表单-->
      <el-table
        :data="newsList"
        stripe>
        <el-table-column
          label="日期"
          prop="BuyDateStr"
          :show-overflow-tooltip="true"
          width="200">
        </el-table-column>
        <el-table-column
          label="股票代码"
          prop="StockCode"
          :show-overflow-tooltip="true"
          width="200">
        </el-table-column>
        <el-table-column
          label="买入时间"
          prop="BuyTimeStr"
          sortable
          :show-overflow-tooltip="true"
          width="200">
        </el-table-column>
        <el-table-column
          label="买入价格"
          prop="BuyPrice"
          sortable
          :show-overflow-tooltip="true"
          width="200">
          <template slot-scope="scope">
            <span>{{scope.row.BuyPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="卖出时间"
          prop="SellTimeStr"
          sortable
          :show-overflow-tooltip="true"
          width="250">
        </el-table-column>
        <el-table-column
          label="卖出价格"
          sortable
          prop="SellPrice"
          :show-overflow-tooltip="true"
          width="200">
          <template slot-scope="scope">
            <span>{{scope.row.SellPrice | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="利润"
          prop="Income"
          sortable
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.Income*100 | rounding}}%</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-form
        :model="formFooter"
        :inline="true"
        size="small">
        <el-form-item
          label="总计">
          {{newsList.length}}
        </el-form-item>
        <el-form-item
          label="平均盈利">
          {{avgtotal | rounding}}%
        </el-form-item>
        <el-form-item
          label="盈利数量">
          {{profit}}
        </el-form-item>
        <el-form-item
          label="亏损数量">
          {{loss}}
        </el-form-item>
        <el-form-item
          label="不盈不亏">
          {{avg}}
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
  // var FileReader = require('filereader')
  export default {
    props: {},
    watch: {
      newsList: {
        handler (val) {
          let profit = 0
          let loss = 0
          let avg = 0
          let avgtotal = 0
          val.forEach(function (item, index, array) {
            if (item.Income > 0) {
              profit++
            } else if (item.Income < 0) {
              loss++
            } else {
              avg++
            }
          })
          val.forEach(function (item, index, array) {
            avgtotal += item.Income
          }, 0)
          this.profit = profit
          this.loss = loss
          this.avg = avg
          this.avgtotal = avgtotal
        },
        immediate: true
      }
    },
    data () {
      return {
        newsList: [],
        json_data: [],
        timebucketList: [],
        fileText: '',
        dialogFormVisible: false,
        dialogTimebucket: false,
        dialogUploadVisible: false,
        dialogLoading: false,
        defaultpd: undefined,
        loading: false,
        json_fields: {
          '日期': 'BuyDateStr',
          '股票代码': 'StockCode',
          '买入时间': 'BuyTimeStr',
          '买入价格': 'BuyPrice',
          '卖出时间': 'SellTimeStr',
          '卖出价格': 'SellPrice',
          '利润': 'Income'
        },
        form: {
          dateStr: ''
        },
        formDialog: {
          name: undefined,
          pd: undefined,
          pool: undefined
        },
        formTimebucket: {
          ed: undefined,
          sd: undefined
        },
        formFooter: {
          profit: 0,
          loss: 0,
          avgtotal: 0,
          avg: 0
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        }
      }
    },
    created () {
      this.get()
    },
    methods: {
      get () {
        this.loading = true
        this.$http.get(api.getQuantMA(this.form.dateStr)).then((response) => {
          this.newsList = response.data
        })
          .catch((response) => {
            console.log(response)
          })
          .finally(() => {
            this.loading = false
          })
      },
      handleFormSubmit () {
        this.get()
      },
      handleFormtimebucket () {
        this.$http.get(api.getTimebucket(this.formTimebucket.sd, this.formTimebucket.ed))
          .then(timebucket => {
            this.timebucketList = timebucket.data
          })
          .catch((timebucket) => {
            console.log(timebucket)
          })
      },
      handleCreate () {
        this.dialogFormVisible = true
        this.formDialog = {
          name: undefined,
          pd: this.defaultpd,
          pool: undefined
        }
      },
      handlePdinput (val) {
        if (val.length == 8) {
          this.formDialog.pd = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8)
        }
      },
      Notification () {
        const h = this.$createElement
        this.$notify({
          title: '提示',
          message: h('i', {style: 'color: teal'}, '上传成功')
        })
      },
      createTicketpool () {
        this.defaultpd = this.formDialog.pd
        this.$refs.formDialog.validate(valid => {
          if (valid) {
            this.dialogLoading = false
            this.$http.post(api.addTicketpool(), {...this.formDialog})
              .then(res => {
                this.dialogFormVisible = false
                this.Notification()
                this.handleFormSubmit()
              })
              .catch(() => {
                this.dialogLoading = false
                this.handleFormSubmit()
              })
          }
        })
      },
      handleCancel () {
        this.dialogFormVisible = false
        this.handleFormSubmit()
      },
      btnClick () {
        document.querySelector('.input-file').click()
      },
      exportData (event) {
        if (!event.currentTarget.files.length) {
          return
        }
        let reader = new FileReader()
        let file = event.target.files[0]
        let filename = file.name
        let num = filename.indexOf(2020, 0)
        let name = filename.substring(0, num)
        console.log(name)
        this.formDialog.name = name
        reader.readAsText(file, 'gb2312')
        let that = this
        reader.onload = function () {
          let outData = []
          console.log('加载成功')
          if (reader.result) {
            let dataArr = reader.result.split(/[\n]/)
            if (dataArr) {
              let count = dataArr.length
              let exclude = []
              exclude.push(count - 2)
              exclude.push(count - 1)
              dataArr.forEach(function (item, index) {
                if (index != 0 && !exclude.includes(index)) {
                  let smdataArr = item.split(/[\s]/)
                  outData.push(smdataArr[0])
                }
              })
            }
          }
          that.fileText = outData.join(',')
          that.formDialog.pool = that.fileText
        }
      },
      startDownload () {
        let aaa = []
        aaa = this.newsList
        aaa.forEach(item => {
          item.StockCode = '\'' + item.StockCode
          item.BuyTimeStr = '\'' + item.BuyTimeStr
          item.SellTimeStr = '\'' + item.SellTimeStr
        })
        this.json_data = aaa
      }
    },
    filters: {
      rounding (value) {
        return value.toFixed(2)
      }
    }
  }
</script>
<style scoped>
  .input-file {
    display: none;
  }
</style>
