<template>
  <el-dialog
      title="设置设备/材料"
      width="1100px"
      :visible.sync="showDialog"
      :before-close="bindClose"  >
    <el-form :model="formInline" class="form-box">
      <el-form-item label="事业部" style="width:28%" label-width="30px">
        <el-select v-model="formInline.businessUnitCode" placeholder="请选择事业部" style="width:95%; height: 35px;border: solid 1px #DCDFE6" @change="choice">
          <template v-if="organList && organList.length > 0">
            <el-option
                v-for="item in organList"
                :key="item.erpCode"
                :label="item.name"
                :value="item.erpCode"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="设备/材料型号"  style="width:28%">
        <el-input v-model="formInline.modelCode" placeholder="请输入设备/材料型号" style="width:95%;"></el-input>
      </el-form-item>

      <el-form-item label="设备/材料名称"  style="width:28%">
        <el-input v-model="formInline.name" placeholder="请输入设备/材料名称" style="width:95%;"></el-input>
      </el-form-item>
      <div class="search-btn">
        <el-button type="primary" @click="onSearch" >查询</el-button>
      </div>
    </el-form>
    <el-table :data="gridData" border @row-click="checkLine">
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          {{scope.row.itemCode}} {{scope.row.modelCode}} {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column width="250" align="center" property="uinitType" label="计量单位"></el-table-column>
      <el-table-column width="200" align="center" label="事业部">
        <template slot-scope="scope">
          {{tabBusinessUnitName}}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper,total"
        :total="total"
      ></el-pagination>
    </div>
<!--    <el-button slot="reference">选择</el-button>-->
  </el-dialog>
</template>
<script>
import { getStandardUnit } from "@/services/datablock.js";
import {Message} from "element-ui";
export default {
  name: "Index",
  data() {
    return {
      formInline: {
        name: "",
        businessUnitCode: "",
        businessUnitName: '',
        modelCode: ''
      },
      tabBusinessUnitName: '',
      currentPage: 1,
      pageSize:10,
      gridData: [], // 设备/材料列表
      total: 0 // 数据总条数
    };
  },
  props: {
    organList: {
      type: Array,
      default: []
    },
    bindGetDevice: {
      type: Function
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    closeDialog: {
      type: Function,
      default: function () {}
    }
  },
  mounted() {
  },
  methods: {
    // 获取事业部下的设备列表
    getStandardUnitList() {
      const param = {
        businessUnitCode: this.formInline.businessUnitCode,
        name: this.formInline.name,
        modelCode: this.formInline.modelCode,
        startPage: this.currentPage,
        pageSize: this.pageSize
      }
      getStandardUnit(param).then(res => {
        if (res.code === 200) {
          this.gridData = res.data && res.data.data || []
          this.tabBusinessUnitName = this.formInline.businessUnitName
          this.total = res.data.total
        } else {
          Message({
            message: '未搜索到该事业部下的设备信息'
          })
        }
      })
    },
    //设备材料选择
    choice(val) {
      this.organList.forEach((item) => {
        if (item.erpCode === this.formInline.businessUnitCode) {
          this.formInline.businessUnitName = item.name
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = Number(val)
      this.getStandardUnitList()
    },
    //设备查询
    onSearch() {
      this.currentPage = 1
      if(this.formInline.businessUnitCode ==='') {
        Message({
          message: '请先选择事业部'
        })
        return false
      }
      this.getStandardUnitList()
    },
    // 点击单行选中其数据
    checkLine(val) {
      this.bindGetDevice(val)
      this.$emit('closeDialog')
    },
    // 关闭
    bindClose() {
      this.$emit('closeDialog')
    }
  }
};
</script>

<style lang="scss" scoped>
.contentForm .el-popover {
  padding: 0;
}
// 弹框
.block {
  text-align: right;
}
.form-box {
  padding-bottom: 30px;
  border-bottom: solid 1px #DCDFE6;
}
.search-btn {
  width: 100px;
  height: 40px;
  padding-top: 10px;
  text-align: center;
  display: inline-block;
  background: #409eff;
  color: #ffffff;
  border-radius: 4px;
}
.border {
  border-top: solid 1px #DCDFE6;
}
</style>