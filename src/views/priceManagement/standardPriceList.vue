<template>
  <div class="stand">
    <div class="standTitle">标准价格管理</div>
    <div class="contentForm">
      <el-form
        :inline="true"
        :model="ruleForm"
        class="demo-form-inline"
        label-width="25%"
        status-icon
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="标准价格批号" prop="priceNo">
          <el-input v-model="ruleForm.priceNo" placeholder="请输入标准价格批号" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="业务类型" prop="bizType">
          <el-select
            v-model="ruleForm.bizType"
            placeholder="请选择业务类型"
            style="width:100%"
            @change="change"
          >
            <el-option
              v-for="item in typeData.bizType"
              :key="item.code"
              :label="item.desc "
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="事业部" prop="businessUnitNo">
          <el-select v-model="ruleForm.businessUnitNo" filterable placeholder="请选择事业部" style="width:100%" @change="busChange">
            <el-option
              v-for="item in busType"
              :key="item.erpCode"
              :label="item.name "
              :value="item.erpCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资产类别" prop="assetCate">
          <el-select v-model="ruleForm.assetCate" placeholder="请选择资产类别" style="width:100%">
            <el-option
              v-for="item in typeData.assetCate"
              :key="item.code"
              :label="item.desc "
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备型号" prop="deviceModelCode">
          <el-input v-model="ruleForm.deviceModelCode" placeholder="请输入设备型号" style="width:100%"></el-input>
        </el-form-item>


        <el-form-item label="状态">
          <el-select v-model="ruleForm.stateList" multiple placeholder="请选择状态" style="width:100%">
            <el-option
              v-for="item in prostate"
              :key="item.code"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="contentBtn">
      <div class="findbtn">
        <!-- <Btn :btn="this.btn"  /> -->
        <el-button type="primary" @click="onFind('ruleForm')" >查询</el-button>
        <el-button type="primary" @click="onDelete('ruleForm')">清除</el-button>
      </div>
      <Imp :listData="listData"  @callBackImport="importNext"/>
    </div>

    <div class="contentTable">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="priceNo" label="标准价格批号" width="180" align="center"></el-table-column>
          <el-table-column prop="bizTypeDesc" label="业务类型" width="100" align="center"></el-table-column>
          <el-table-column prop="businessUnitName" label="事业部" width="140" align="center"></el-table-column>
          <el-table-column prop="assetCateDesc" label="资产类别" width="100" align="center"></el-table-column>
          <el-table-column label="设备/材料型号" width="180" align="center">
            <template slot-scope="scope">
              {{scope.row.deviceModelCode}}  {{scope.row.deviceModelName}}
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="设备单位" width="100" align="center"></el-table-column>
          <el-table-column prop="currencyDesc" label="币种" width="80" align="center"></el-table-column>
          <el-table-column prop="dayPrice" label="日价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="weekPrice" label="周价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="monthPrice" label="月价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="machineTeamPrice" label="台班价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="basePrice" label="设备标准价格（元）" width="100" align="center"></el-table-column>
          <el-table-column prop="startTime" label="生效日期" width="100" align="center"></el-table-column>
          <el-table-column prop="endTime" label="失效日期" width="100" align="center"></el-table-column>
          <el-table-column prop="statusDesc" label="状态" width="80" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click="handleFind(scope.row,scope.$index)" type="primary" size="small">查看</el-button>
              <el-button @click="handleClick(scope.row)" type="primary" size="small">复制新增</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="20"
          layout="prev, pager, next, jumper,total"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Imp from "@/components/import";
import { standListFind, perListStateFind, getAllUnitErpCodes,frontparams,getSubShopsErpCodes,standpagingFind  } from "@/services/datablock.js";
export default {
  name: "Index",
  components: {
    Imp,
  },
  data() {
    return {
      shopList: [], // 事业部下营业店列表
      total:0,//分页数据
      typeData:[],//数据枚举
      prostate:[],//状态枚举
      busType:[],//事业部枚举
      listData: { listFlag: "stand" }, //组件传参
      formInline: {
        user: "",
        region: ""
      },
      tableData: [],
      ruleForm: {
        bizType:null,
        stateList:null
      },
      rules: {
      },
      currentPage1: 1 //分页
    };
  },
  created() {
    document.title = "标准价格列表";
    this.init()
  },
   computed: {
    disabled: function() {
      //禁用营业店
      if (this.ruleForm.businessUnitNo === "") {
        return this.disflag
      }
    },
  },
  watch:{
  },
  methods: {
    // 导入数据后的回调、
    importNext() {
      this.onDelete()
      const param = {
        startPage: 1,
        pageSize: 20
      }
      this.find(param)
    },
    init(){
      perListStateFind({}).then(res => {//状态枚举
        this.prostate = eval(res.enumVal.ResultStatusEnum);
      });
      getAllUnitErpCodes({}).then(res =>{
        //事业部列表查询
        this.busType = res.data;
      })
      frontparams({}).then(res =>{
        this.typeData = res.data
        if(res.success === true){
          
        }
      })
      this.ruleForm.bizType = 1
      this.ruleForm.stateList = [0,1];
      let par =this.ruleForm
          this.currentPage1 = 1
          par.startPage = this.currentPage1,
            par.pageSize = 20
      this.find(par)
    },
    find(par){
          standpagingFind(par).then(res =>{
            this.tableData = res.data
            this.total = res.total
            for(let i = 0; i< this.tableData.length; i++){
              let item = this.tableData[i]
              item.startTime = this.$moment(item.startTime).format("YYYY-MM-DD")
              if(item.endTime !== null){
              item.endTime = this.$moment(item.endTime).format(
                "YYYY-MM-DD"
              );
              }
            }
          })
    },
    onFind(formName) {
      //分页查询
      let par =this.ruleForm
          this.currentPage1 = 1
          par.startPage = this.currentPage1,
            par.pageSize = 20
      this.find(par)
    },
    onDelete(formName) { //清除
      // this.$refs[formName].resetFields();
      this.ruleForm = {
        priceNo:null,
        bizType:null,
        businessUnitNo:null,
        storeNo:null,
        assetCate:null,
        deviceModelCode:null,
        stateList:null,
      }
    },
    handleFind(val) {//单个查询
    let state = null
    console.log(val.status,'val')
    if(val.status === 0){
      state = 1
    } else if(val.status === 1){
      state = 2
    } else if(val.status === 2){
      state = 3
    }
      this.$router.push({
            path:'/standardPriceDetail',
            query:{id:val.id,listStatus:state,disabled:true}
          })
    },
    handleClick(val) {//复制新增
    let par ={}
            par.bizType = val.bizType
            par.currency  = val.currency
            par.assetCate = val.assetCate
            par.businessUnitNo = val.businessUnitNo
            par.businessUnitName = val.businessUnitName
            par.deviceModelCode = val.deviceModelCode
            par.deviceModelCode = val.deviceModelCode  
            par.deviceModelNo = val.deviceModelNo 
            par.deviceModelName = val.deviceModelName
            par.unit = val.unit
            par.dayPrice = val.dayPrice
            par.weekPrice = val.weekPrice
            par.monthPrice = val.monthPrice
            par.machineTeamPrice =val.machineTeamPrice
            par.basePrice = val.basePrice
            par.startTime = val.startTime
            par.endTime = val.endTime
            this.$router.push({
                  path:'/standardPriceDetail',
                  query:{data:par,listStatus:0}
                })
    },
    change(val) { //业务类型
      
      // this.ruleForm.bizType = val
      console.log(val,this.ruleForm.bizType)
    },
    busChange(val) {//事业部改变事件
      this.getSubShopsList(val)
      if(this.ruleForm.storeNo !== undefined){
        this.ruleForm.storeNo = undefined
      }
    },
    // 事业部下营业店查询
    getSubShopsList(erpCode) {
      const param = { erpCode }
      getSubShopsErpCodes(param).then(res => {
        if (res.code === 200) {
          this.shopList = res.data
        }
      })
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage1 = val;
      let par =this.ruleForm
      par.startPage = this.currentPage1,
      par.pageSize = 20
      this.find(par)
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
  margin-top: 15px;
}
.demo-form-inline {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.contentForm .el-form--inline .el-form-item {
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
.block {
  //分页
  text-align: right;
}
.findbtn{
  margin-left: 2rem;
}
</style>
