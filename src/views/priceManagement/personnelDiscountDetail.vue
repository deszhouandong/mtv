<template>
  <div class="staff">
    <div class="btn">
      <div v-if="saveStatus === 0 ? true :false">
        <el-button type="primary" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
        <el-button type="primary" @click="close()">关闭页面</el-button>
      </div>
      <div v-if="saveStatus === 1 ? true :false">
        <el-button type="primary" @click="deleted()">作废</el-button>
        <el-button type="primary" @click="update()">修改</el-button>
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
        <el-button type="primary" @click="close()">关闭页面</el-button>
      </div>
      <div v-if="saveStatus === 2 ? true :false">
        <el-button type="primary" @click="deleted()">作废</el-button>
        <el-button type="primary" @click="revoke('ruleForm')">撤销确认</el-button>
        <el-button type="primary" @click="close()">关闭页面</el-button>
      </div>
      <div v-if="saveStatus === 3 ? true :false">
        <el-button type="primary" @click="close()">关闭页面</el-button>
      </div>
    </div>
    <div class="contentForm" :class="saveStatus === 1 || saveStatus === 3 || this.$route.query.disabled === true? 'noclick':''">
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
          <el-input v-model="ruleForm.discountNo" disabled></el-input>
        </el-form-item>

        <el-form-item label="事业部" prop="businessUnitNo">
          <el-select
            v-model="ruleForm.businessUnitNo"
            filterable
            placeholder="请选择事业部"
            style="width:100%"
            @change="bindChange()"
          >
            <el-option
              v-for="item in busType"
              :key="item.erpCode"
              :label="item.name "
              :value="item.erpCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="ruleForm.status" style="width:100%" disabled placeholder="">
            <el-option
              v-for="item in prostate"
              :key="item.code"
              :label="item.description"
              :value="item.enumValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人员" prop="staffName">
          <el-select
            v-model="ruleForm.staffName"
            filterable
            placeholder="请选择人员"
            style="width:100%"
            :disabled="disabled"
            @change="staffChange(ruleForm.staffName)"
          >
            <el-option
              v-for="item in staffList"
              :key="item.account"
              :label="item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人员类型" prop="staffType">
          <el-select v-model="ruleForm.staffType" placeholder="请选择人员类型" style="width:100%">
            <el-option
              v-for="item in typeList"
              :key="item.code"
              :label="item.description"
              :value="item.enumValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格折扣率%" prop="discount">
          <el-input v-model="ruleForm.discount" placeholder="请输入价格折扣率"></el-input>
        </el-form-item>

        <el-form-item label="生效日期" prop="startTime">
          <el-date-picker
            @change="timeChange"
            v-model="ruleForm.startTime"
            type="date"
            placeholder="请输入生效日期"
            style="width:100%"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="失效日期">
          <el-date-picker
            @change="endTimeCheck"
            v-model="ruleForm.endTime"
            type="date"
            placeholder="请输入失效日期"
            style="width:100%"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" v-if="this.info.createUser === undefined ?false :true">
      <span>{{`创建人：${this.info.createUser}`}}</span>
      <span>{{`创建时间：${this.info.createTime}`}}</span>
      <span>{{`修改人：${this.info.updateUser}`}}</span>
      <span>{{`修改时间：${this.info.updateTime}`}}</span>
      <!-- <p>{{`创建人：${this.info.createUser} 创建时间：${this.info.createTime} 修改人：${this.info.updateUser} 修改时间：${this.info.updateTime}`}}</p> -->
    </div>
  </div>
</template>

<script>
import {
  getAllUnitErpCodes,
  getSubPersonByErpCodes,
  perListStateFind,
  perListIdFind,
  perListSave,
  submitPer,
  failDiscountPer,
  revokeStaffDiscount
} from "@/services/datablock.js";
import { MessageBox, Message } from "element-ui";
export default {
  name: "Index",
  data() {
    let rag = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;//0-100
    let validateDiscount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入价格折扣率%"));
      } else if (!rag.test(value)) {
        callback(new Error("价格折扣率%格式错误"));
      } else {
        callback();
      }
    };
    let validateEnd = (rule, value, callback) => {
      console.log(value)
      if(value >"0000-00-00"){
        if (value <= this.ruleForm.startTime) {
        callback(new Error("失效日期须大于生效日期"));
      } else {
        callback();
      }
      }
    };
    let validateStart = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请选择生效日期"));
      } else if (value >= this.ruleForm.endTime && this.ruleForm.endTime !== null) {
        callback(new Error("生效日期须小于失效日期"));
      } else {
        callback();
      }
    };
    return {
      storeflag:false,
      updateId:'',//修改时id
      info:{},
      saveId:null,//保存后id

      pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now()- 8.64e7;
          }},
      listStatus: "", //判断是否可编辑
      statustype: false,
      saveStatus: 5,
      disabled: false, //人员禁用
      typeList: [], //人员类型
      busType: [], //事业部类型枚举
      staffList: [], //人员枚举
      prostate: [], //状态枚举
      timeout: null,
      restaurants: [],
      formInline: {
        user: "",
        region: ""
      },
      radio: "1",
      ruleForm: {
        businessUnitNo: "",
        // status: [],
        staffType: "", //人员类型
        discount: "", //折扣率
        staffName: null, //人员
        endTime: null,
        startTime: ""
      },
      rules: {
        staffName: [
          { required: true, message: "请选择人员", trigger: "change" }
        ],
        staffType: [
          { required: true, message: "请选择人员类型", trigger: "change" }
        ],
        businessUnitNo: [
          { required: true, message: "请选择事业部", trigger: "change" }
        ],
        discount: [
          { required: true, trigger: "blur", validator: validateDiscount }
        ],
        startTime: [
          { required: true, validator: validateStart, trigger: "change" }
        ],
        endTime: [{ trigger: "change", validator: validateEnd }]
      }
    };
  },
  created() {
    document.title = "人员折扣详情";
    this.init();
  },
  mounted() {
    // this.restaurants = this.loadAll();
  },
  methods: {
    init() {
      // this.info = `创建人：${this.info.createUser} 创建时间：${this.info.createTime} 修改人：${this.info.updateUser} 修改时间：${this.info.updateTime}`;
      getAllUnitErpCodes({}).then(res => {
        //事业部列表查询
        this.busType = res.data;
      });
      perListStateFind({}).then(res => {
        //人员状态，类型查询
        this.typeList = eval(res.enumVal.ResultPersonnelTypeEnum);
        // this.ruleForm.status = "TAKE_EFFECT";
        this.prostate = eval(res.enumVal.ResultStatusEnum);
      });
      
      if (this.$route.query.id > 0) {
        let that = this
        let par ={}
        this.find(this.$route.query.id,function(data) {
          if(that.ruleForm.status === "DRAFT"){
            that.saveStatus = 1
          }else if(that.ruleForm.status === "TAKE_EFFECT"){
            that.saveStatus = 2
          }else if(that.ruleForm.status === "INVALID"){
            that.saveStatus = 3
          }
          that.ruleForm.startTime = that.$moment(
            that.ruleForm.startTime
          ).format("YYYY-MM-DD");
          that.info.createTime = that.$moment(that.ruleForm.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          that.info.updateTime = that.$moment(that.ruleForm.updateTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          that.info.createUser = that.ruleForm.createUser;
          that.info.updateUser = that.ruleForm.updateUser;
          console.log(data,'data')
          par.erpCode = data.businessUnitNo
          that.staffFind(par)
        })
      }else{
        this.saveStatus = 0
      }

      if (this.$route.query.listStatus === 0) {
        this.ruleForm.businessUnitNo = this.$route.query.data.businessUnitNo;
        this.ruleForm.businessUnitName = this.$route.query.data.businessUnitName;
        this.ruleForm.staffName = this.$route.query.data.staffName;
        this.ruleForm.staffNo = this.$route.query.data.staffNo;
        this.ruleForm.staffType = this.$route.query.data.staffType;
        this.ruleForm.discount = this.$route.query.data.discount;
        console.log(this.$route.query.data.startTime,'this.$route.query.data.startTime')
        this.ruleForm.startTime = this.$set(this.ruleForm,'startTime', this.$route.query.data.startTime)
        this.ruleForm.endTime = this.$set(this.ruleForm,'endTime', this.$route.query.data.endTime)
        this.staffFind({erpCode: this.ruleForm.businessUnitNo})
      }
      
      // if(this.ruleForm.endTime !== null){
      //       this.ruleForm.endTime = this.$moment(this.ruleForm.endTime).format(
      //       "YYYY-MM-DD"
      //     );
      //     }
    },
    find(Id,callback){
      perListIdFind({ id: Id }).then(res => {
        //根据id查询
      this.ruleForm = res.data;
      callback(res.data)
      })
      },
    bindChange(val) {//事业部改变
      if (this.ruleForm.businessUnitNo === "" || this.ruleForm.businessUnitNo === undefined) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      for (let i = 0; i < this.busType.length; i++) {
        const item = this.busType[i];
        if (item.erpCode === this.ruleForm.businessUnitNo) {
          this.ruleForm.businessUnitName = item.name;
        }
      }
      this.staffFind({
        erpCode: this.ruleForm.businessUnitNo
      })
      if(this.ruleForm.staffName !== null){
        this.ruleForm.staffName = null
      }
      if (
        this.ruleForm.businessUnitNo === "" ||
        this.ruleForm.businessUnitNo === undefined
      ) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    staffFind(erpCode){//事业部下人员查询
      getSubPersonByErpCodes(erpCode).then(res => {
        this.staffList = res.data;
      });
    },
    staffChange(val) {
      for(let i =0;i<this.staffList.length; i++){
        const item =this.staffList[i]
        if(item.name === val){
        this.ruleForm.staffNo = item.account
      }
      }
    },
    timeChange() {
      //时间改变
      this.ruleForm.startTime = this.$moment(this.ruleForm.startTime).format("YYYY-MM-DD");
    },
    cancel() {
      //取消按钮
      MessageBox.confirm("确定要取消操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$router.push("/personnelDiscountList");
        })
        .catch(() => {});
    },

    close() {
      //关闭按钮
      this.$router.push("/personnelDiscountList");
    },
    check() {
      //校验
      if (this.ruleForm.status === "") {
      } else if (
        this.ruleForm.startTime === "" ||
        this.ruleForm.startTime === undefined
      ) {
      } else if (
        this.ruleForm.endTime === null ||
        this.ruleForm.endTime === undefined
      ) {
      } else if (this.ruleForm.staffType === "") {
      } else if (this.ruleForm.discount === "") {
      } else {
        return true;
      }
    },
    // 失效日期跟生效日期匹配校验 startDay 是否早于endDay
    comparedMonth(startDay, endDay) {
      return this.$moment(startDay).isBefore(endDay);
    },
    // 失效时间校验，失效时间必须大于生效时间
    endTimeCheck(val) {
      console.log('end时间---', val)
      if (this.ruleForm.startTime === '') {
        Message('请先选择生效日期')
      } else if (!this.comparedMonth(this.ruleForm.startTime, val)) {
        Message('失效日期必须晚于生效日期')
      }
      if(val !== null){
        this.ruleForm.endTime = this.$moment(val).format("YYYY-MM-DD")
      }else{
        this.ruleForm.endTime = null
      }
    },
    // 计算失效日期是否晚于当前日期
    endTimeBefore() {
      const currentDay =  Date.now()
      let isBefore = true
      if (this.formInline.end_time !=='' && this.formInline.end_time !== undefined && this.formInline.end_time !== null) {
        isBefore = this.comparedMonth(currentDay, this.formInline.end_time)
      }
      return isBefore
    },
    getdata(data){
      this.info={
                createTime: this.$moment(data.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                updateTime: this.$moment(data.updateTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                createUser: data.createUser,
                updateUser: data.updateUser
              }
    },
    save(formName) {
      //保存按钮
      let par = { ...this.ruleForm };
      if(this.$route.query.listStatus === 0 || !this.$route.query.listStatus){
        par.id = this.updateId
      }
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          const isBefore = this.endTimeBefore()
          if (this.ruleForm.startTime>this.ruleForm.endTime && this.ruleForm.endTime >"2000-00-00") {
            return false
          }else{
            perListSave(par).then(res => {
            if (res.success === true) {
              this.saveId = res.data.id
              Message.success({
                title: "成功",
                message: "保存成功"
              });
              this.saveStatus = 1;
              this.listStatus = 1;
              this.ruleForm.status = res.data.status
              this.ruleForm.discountNo = res.data.discountNo
              this.getdata(res.data)
            } else {
          Message.error(res.msg || '保存失败');
        }
          });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleted() {//作废
      MessageBox.confirm("确定废除此条单据", {
        confirmButtonText: "确定",
        cancelButtonText: "",
        type: "warning",
        center: true
      }).then(() => {
        let par = {}
          if (this.$route.query.id >0){
            par = this.$route.query.id 
          }else{
            par  = this.saveId
          }
        failDiscountPer({ id:par}).then(res => {
          if (res.msg === "success") {
            Message.success({
              title: "成功",
              message: "作废成功"
            });
            this.saveStatus = 3;
            this.ruleForm.status = res.data.status
            this.getdata(res.data)
          }else {
            Message.error(res.msg || '作废失败');
        }
        });
      });
    },
    update() {
      //修改
      this.$route.query.disabled =false
      this.saveStatus = 0;
      this.updateId = this.saveId
    },
    submit(formName) {
      //提交按钮
      let par = this.ruleForm;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let par = {}
          if (this.$route.query.id >0){
            par = this.$route.query.id 
          }else{
            par  = this.saveId
          }
          console.log(par)
          submitPer({ id: par }).then(res => {
            if (res.msg === "success") {
              Message.success({
                title: "成功",
                message: "提交成功",
              });
              this.getdata(res.data)
              this.saveStatus = 2;
              this.ruleForm.status = res.data.status
            } else {
              Message.error(res.msg || '提交失败');
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    revoke() {
      //撤销
      let par = {}
          if (this.$route.query.id >0){
            par = this.$route.query.id 
          }else{
            par  = this.saveId
          }
      revokeStaffDiscount({ id: par }).then(res => {
        console.log(res.msg);
        if (res.msg === "success") {
          Message.success({
                title: "成功",
                message: "撤销成功",
              });
              this.getdata(res.data)
          this.saveStatus = 1;
          this.ruleForm.status = res.data.status
        } else {
          Message.error(res.msg || '撤销失败');
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.staff{
  margin-top: 20px;
}
.contentForm {
  width: 100%;
}
.demo-form-inline {
  width: 100%;
  display: flex;
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

.btn {
  width: 96%;
  text-align: left;
  margin: 0 4rem;
}
//时间
.contentForm ::v-deep.el-input__prefix {
  display: none;
}
//禁用
.noclick {
  pointer-events: none;
}
.noclick ::v-deep.el-input__suffix {
  z-index: -1;
}
.footer{
  width: 100%;
  text-align: left;
  color:#999;
  padding: 2rem 2rem;
  font-size: 14px;
  span{
    padding-left: 2rem;
  }
}
</style>
