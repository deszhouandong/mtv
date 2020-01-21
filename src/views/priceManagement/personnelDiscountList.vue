<template>
  <div class="stand">
    <div class="standTitle">人员折扣管理</div>
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
        <el-form-item label="人员折扣批号">
          <el-input v-model="ruleForm.discountNo" placeholder="请输入人员折扣批号"></el-input>
        </el-form-item>

        <el-form-item label="人员">
          <el-input v-model="ruleForm.staffName" placeholder="请输入人员"></el-input>
        </el-form-item>

        <el-form-item label="人员类型">
          <el-select
            v-model="ruleForm.staffType"
            placeholder="请选择人员类型"
            style="width:100%"
            @change="staffChange"
          >
            <el-option
              v-for="item in typeList"
              :key="item.code"
              :label="item.description"
              :value="item.enumValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="ruleForm.stateList" multiple placeholder="请选择状态" style="width:100%">
            <el-option
              v-for="item in prostate"
              :key="item.code"
              :label="item.description"
              :value="item.enumValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="contentBtn">
      <div class="findbtn">
        <el-button type="primary" @click="onFind('ruleForm')">查询</el-button>
        <el-button type="primary" @click="onDelete('ruleForm')">清除</el-button>
      </div>
      <Imp :listData="listData" @callBackImport="importNext"/>
    </div>

    <div class="contentTable">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="discountNo" label="人员折扣批号" width="190" align="center"></el-table-column>
          <el-table-column prop="staffName" label="人员姓名" width="150" align="center"></el-table-column>
          <el-table-column prop="staffType" label="人员类型" width="150" align="center"></el-table-column>
          <el-table-column prop="discount" label="价格折扣率" width="150" align="center"></el-table-column>
          <el-table-column prop="startTime" label="生效日期" width="150" align="center"></el-table-column>
          <el-table-column prop="endTime" label="失效日期" width="150" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="150" align="center"></el-table-column>
          <el-table-column label="复制新增" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click="handleFind(scope.row,scope.$index)" type="primary" size="small">查看</el-button>
              <el-button @click="handleClick(scope.row)" type="primary" size="small">复制新增</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="20"
        layout="prev, pager, next, jumper,total"
        :total="this.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Imp from "@/components/import.vue";
import { personListFind, perListStateFind, perListIdFind } from "@/services/datablock.js";
import { Message } from "element-ui";
export default {
  components: {
    Imp
  },
  data() {
    return {
      listData: { listFlag: "person" }, //组件传参
      formInline: {
        user: "",
        region: ""
      },
      typeList: [], //人员类型
      prostate: [], //状态
      tableData: [],
      total:0,
      ruleForm: {
        discountNo: "",
        staffName: "",
        staffType: null,
        stateList: null
      },
      rules: {},
      currentPage1: 0 //分页
    };
  },
  created() {
    document.title = "人员折扣列表";
    this.init();
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
    init() {
      perListStateFind({}).then(res => {
        this.typeList = eval(res.enumVal.ResultPersonnelTypeEnum);
        this.prostate = eval(res.enumVal.ResultStatusEnum);
      });
      this.ruleForm.stateList = ["DRAFT","TAKE_EFFECT",];
      let par =this.ruleForm
          this.currentPage1 = 1
          par.startPage = this.currentPage1,
            par.pageSize = 20
            par.stateList = this.ruleForm.stateList
        this.find(par)
    },
    find(par){
      personListFind(par).then(res => {
        if(res.success === true){
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
              if(item.staffType === 'MANAGER'){
              item.staffType = '店长'
            } else if(item.staffType === 'DIRECTOR'){
              item.staffType = '总监'
            }
            if(item.status === 'DRAFT'){
              item.status = '草稿'
            } else if(item.status === 'TAKE_EFFECT'){
              item.status = '生效'
            } else if(item.status === 'INVALID'){
              item.status = '失效'
            } 
            }
        }else{
              Message.error('查询失败' + res.msg);
            }
      })
    },
    onFind(formName) {
      //分页查询
      // this.$refs[formName].validate(valid => {
        let par =this.ruleForm
          this.currentPage1 = 1
          par.startPage = this.currentPage1,
            par.pageSize = 20
        this.find(par)
    },

    onDelete(formName) {
      //清除
      // this.$refs[formName].resetFields();
      this.ruleForm = {
        discountNo:null,
        staffName:null,
        staffType:null,
        stateList:null,
      }
    },

    staffChange(val){
      // this.ruleForm.staffType = val
    },

    add() {
      //新增
      this.$router.push("/personnelDiscountDetail");
    },

    handleClick(val) {
      let par ={}
      if(val.staffType === '店长'){
              val.staffType = 'MANAGER'
            } else if(val.staffType === '总监'){
              val.staffType = 'DIRECTOR'
            }
      par.businessUnitNo = val.businessUnitNo
      par.businessUnitName = val.businessUnitName
      par.staffName = val.staffName
      par.staffNo = val.staffNo
      par.staffType = val.staffType
      par.discount = val.discount
      par.startTime = val.startTime
      par.endTime = val.endTime
      //复制新增
      this.$router.push({
            path:'/personnelDiscountDetail',
            query:{data:par,listStatus:0}
          })
    },

    handleFind(val,index) {//单个查询
    let state = null
    if(val.status === "草稿"){
      state = 1
    } else if(val.status === "生效"){
      state = 2
    } else if(val.status === "失效"){
      state = 3
    }
      this.$router.push({
            path:'/personnelDiscountDetail',
            query:{id:val.id,listStatus:state,disabled:true}
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
}
.demo-form-inline {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
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
.textBtn {
  //模板下载
  border-bottom: 1px solid #409eff;
  line-height: 0px;
}
.block {
  //分页
  text-align: right;
}
.findbtn{
  margin-left: 2rem;
}
</style>
