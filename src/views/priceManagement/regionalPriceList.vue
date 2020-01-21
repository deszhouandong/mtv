<template>
  <div class="stand">
    <div class="standTitle">区域价格管理</div>
    <div class="contentForm">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="25%"
        status-icon
        ref="formInline"
      >
        <el-form-item label="区域价格批号">
          <el-input v-model="formInline.priceNo" placeholder="请输入标准价格批号" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="业务类型">
          <el-select v-model="formInline.bizType" placeholder="请选择业务类型" style="width:100%">
            <template v-if="frontObj && frontObj.bizType">
              <el-option
                  v-for="(item, index) in frontObj.bizType"
                  :key="index"
                  :label="item.desc"
                  :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>


        <el-form-item label="事业部">
          <el-select v-model="formInline.businessUnitNo" filterable placeholder="请选择事业部" style="width:100%"  @change="organChange">
            <template v-if="organList && organList.length > 0">
              <el-option
                  v-for="(item, index) in organList"
                  :key="index"
                  :label="item.name"
                  :value="item.erpCode"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="营业店">
          <el-select
              v-model="formInline.storeNo"
              placeholder="请选择营业店"
              style="width:100%"
              @focus="checkStore"
              filterable>
            <template v-if="shopList && shopList.length > 0">
              <el-option
                  v-for="(item, index) in shopList"
                  :key="index"
                  :label="item.name"
                  :value="item.erpCode"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="资产类别">
          <el-select v-model="formInline.assetCate" placeholder="请选择资产类别" style="width:100%">
            <template v-if="frontObj && frontObj.assetCate">
              <el-option
                  v-for="(item, index) in frontObj.assetCate"
                  :key="index"
                  :label="item.desc"
                  :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="设备型号">
          <el-input v-model="formInline.deviceModelCode" placeholder="请输入设备型号" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.stateList" multiple placeholder="请选择状态" style="width:100%">
            <template v-if="frontObj && frontObj.status">
              <el-option
                  v-for="(item, index) in frontObj.status"
                  :key="index"
                  :label="item.desc"
                  :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="contentBtn">
      <div class="findbtn">
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onClear">清除</el-button>
      </div>
      <Imp :listData="listData" @callBackImport="importNext"/>
    </div>

    <div class="contentTable">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="priceNo" label="区域价格批号" width="160" align="center"></el-table-column>
          <el-table-column prop="bizTypeDesc" label="业务类型" width="100" align="center"></el-table-column>
          <el-table-column prop="businessUnitName" label="事业部" width="120" align="center"></el-table-column>
          <el-table-column prop="storeName" label="营业店" width="120" align="center"></el-table-column>
          <el-table-column prop="assetCateDesc" label="资产类别" width="100" align="center"></el-table-column>
          <el-table-column label="设备/材料型号" width="120" align="center">
          <template slot-scope="scope">
              {{scope.row.deviceModelCode}}  {{scope.row.deviceModelName}}
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="设备单位" width="100" align="center"></el-table-column>
          <el-table-column prop="currencyDesc" label="币种" width="80" align="center"></el-table-column>
          <el-table-column prop="promTypeDesc" label="活动类型" width="100" align="center"></el-table-column>
          <el-table-column prop="discount" label="折扣率" width="80" align="center"></el-table-column>
          <el-table-column prop="dayPrice" label="日价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="weekPrice" label="周价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="monthPrice" label="月价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="machineTeamPrice" label="台班价格（元）" width="120" align="center"></el-table-column>
          <el-table-column prop="discountPrice" label="设备折扣价格（元）" width="120" align="center"></el-table-column>
          <el-table-column prop="startTime" label="生效日期" width="120" align="center">
            <template slot-scope="scope">
              {{getDate(scope.row.startTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="失效日期" width="120" align="center">
            <template slot-scope="scope">
              {{getDate(scope.row.endTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="statusDesc" label="状态" width="80" align="center"></el-table-column>
          <el-table-column prop="date" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button @click="handleFind(scope.row,scope.$index)" type="primary" size="small" >查看</el-button>
              <el-button @click="handleClick(scope.row, 1)" type="primary" size="small" >复制新增</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="formInline.startPage"
        :page-size="20"
        layout="prev, pager, next, jumper,total"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Imp from "@/components/import"
import Vue from "vue"
import { frontparams, regionQueryPageList, getAllUnitErpCodes, getSubShopsErpCodes } from "@/services/datablock.js";
import { Message } from 'element-ui';
export default {
  name: "Index",
  components: {
    Imp
  },
  data() {
    return {
      storeflag:false,
      frontObj: {}, // 页面选择时所需数据
      organList: [], // 事业部列表
      shopList: [], // 事业部下营业店列表
      listData:{listFlag:"regional"},//组件传参
      orderLineInfo: {}, // 单条数据信息
      formInline: {
        startPage: 1,
        pageSize: 20,
        priceNo: '',
        bizType: '',
        businessUnitNo: '',
        businessUnitName: '',
        storeNo: null,
        assetCate: '',
        deviceModelCode: '',
        stateList: []
      },
      tableData: [],
      total: 0 // 数据总条数
    };
  },
  created() {
    document.title = "区域价格列表";
    // 获取页面所需基础数据
    this.getFrontInfo()
    // 获取列表数据
    this.getRegionQueryPageList()
    // 获取事业部列表、
    this.getAllUnitErpCodeList()
  },
  watch: {
    shopList: function (newValue) {
      this.shopList = newValue;
      Vue.set(this.formInline,"storeNo",null)
    }
  },
  methods: {
    // 导入数据后的回调、
    importNext() {
      this.onClear()
      this.getRegionQueryPageLists()
    },
    // 获取页面所需默认数据
    getFrontInfo() {
      frontparams().then(res => {
        if (res.code === 200) {
          this.frontObj = res.data || {}
          if (this.frontObj.bizType && this.frontObj.bizType.length > 0) {
            this.frontObj.bizType.forEach((item) => {
              if (item.desc === '租赁') {
                this.formInline.bizType = item.code
              }
            })
          }
          // if (this.frontObj.status && this.frontObj.status.length > 0) {
          //   this.frontObj.status.forEach((item) => {
          //     if (item.desc !== '失效') {
          //       this.formInline.stateList = this.formInline.stateList.concat(item.code)
          //     }
          //   })
          // }
        }
      })
    },
    // 获取事业部列表
    getAllUnitErpCodeList() {
      getAllUnitErpCodes().then(res => {
        if (res.code === 200) {
          this.organList = res.data || []
        }
      })
    },
    // 事业部下营业店查询
    getSubShopsList(erpCode) {
      const param = { erpCode }
      getSubShopsErpCodes(param).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.shopList = res.data
        } else {
          this.shopList = []
          Message({
            message: '该事业部下无营业店'
          })
        }
      })
    },
    // 点击选择事业部,获取对应事业部下的营业店
    organChange(erpCode) {
      this.getSubShopsList(erpCode)
    },
    // 如果营业店数据为空时，提示先选择事业部
    checkStore() {
      if (this.shopList && this.shopList.length === 0) {
        Message({
          message: '请先选择事业部',
          type: 'warning'
        })
      }
    },
    // 初始查询加载列表
    getRegionQueryPageList() {
      this.formInline.stateList = [0,1]
      regionQueryPageList(
        this.formInline = {
          startPage: 1,
          pageSize: 20,
          bizType:1,
          stateList: this.formInline.stateList
        }
      ).then(res => {
        if (res.code === 200) {
          this.tableData = res.data || []
          this.total = res.total
        }
      })
    },
    // 查询加载列表
    getRegionQueryPageLists() {
      regionQueryPageList(this.formInline).then(res => {
        if (res.code === 200) {
          this.tableData = res.data || []
          this.total = res.total
        }
      })
    },
   // 分页
    handleCurrentChange(val) {
      this.formInline.startPage = Number(val)
      this.getRegionQueryPageLists()
    },
    //查询
    onSearch() {
      this.formInline.startPage = 1
      this.getRegionQueryPageLists()
    },
    onClear() {//清除
      this.formInline = {
        startPage: 1,
        pageSize: 20,
        priceNo: '',
        bizType: '',
        businessUnitNo: '',
        businessUnitName: '',
        assetCate: '',
        deviceModelCode: '',
        stateList: []
      }
    },
    handleFind(val,index) {//单个查询
    let pageType = null
    console.log(val)
    if(val.status === 0){
      pageType = 'submit'
    } else if(val.status === 1){
      pageType = 'revoke'
    } else if(val.status === 2){
      pageType = 'hasRevoked'
    }
      this.$router.push({
            path:'/regionalPriceDetail',
            query:{id:val.id,pageType}
          })
    },
    // 点击查看 / 复制新增
    handleClick(val, type) {
      let pageType = 'add'
      let id = val.id
      let state = 0
      if (type === 1) { // 1点击的是复制新增  0 点击的是查看
        pageType = 'add'
        // if(val.status === 0){
        //   state =0
        // }else if(val.status === 1){
        //   state = 1
        // }else if(val.status === 2){
        //   state = 2
        // }
      } else {
        pageType = 'view'
      }
      this.$router.push({
        name: 'regionalPriceDetail',
        query: {
          id,
          pageType,
          state
        }
      })
    },
    // 日期转换
    getDate(val){
      if(val !== null){
        return this.$moment(val).format("YYYY-MM-DD")
      }
    }
  }
};
</script>

<style lang='scss' scoped>
// @import "../../assets/sass/index.scss";
.standTitle {
  background: #00bfff;
  height: 52px;
  line-height: 52px;
  font-size: 18px;
  padding-left: 15px;
  text-align: left;
}
.contentForm {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  text-align: left;
}
.demo-form-inline {
  width: 100%;
}
.contentForm ::v-deep.el-form--inline .el-form-item {
  width: 30%;
}
.contentForm ::v-deep.el-form-item__content {
  //输入框宽度
  width: 70%;
}
.contentBtn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 15px 0 20px 0;
}
.contentTable {
  width: 98%;
  margin: 0 auto;
}
.textBtn {
  border-bottom: 1px solid #409eff;
  line-height: 0px;
}
.block {//分页
  text-align: right;
}
.findbtn{
  margin-left: 2rem;
}
</style>
