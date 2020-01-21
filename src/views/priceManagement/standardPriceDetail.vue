<template>
  <div class="detail">
    <div class="header">
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
        <el-button type="primary" @click="revoke()">撤销确认</el-button>
        <el-button type="primary" @click="close()">关闭页面</el-button>
      </div>
      <div v-if="saveStatus === 3 ? true :false">
        <el-button type="primary" @click="close()">关闭页面</el-button>
      </div>
    </div>
    <div class="contentForm" :class="saveStatus === 1 ||saveStatus === 3 || this.$route.query.disabled === true? 'noclick':''">
      <el-form
        :inline="true"
        :model="ruleForm"
        class="demo-form-inline"
        label-width="28%"
        :rules="rules"
        ref="ruleForm"
        :validate-on-rule-change="false"
      >
        <el-form-item label="标准价格批号">
          <el-input v-model="ruleForm.priceNo" style="width:100%" disabled></el-input>
        </el-form-item>

        <el-form-item label="业务类型" prop="bizType">
          <el-select v-model="ruleForm.bizType" placeholder="请选择业务类型" style="width:100%"  @change="typeChange">
            <el-option
              v-for="item in totallist.bizType"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="ruleForm.status" style="width:100%" disabled placeholder="">
            <el-option
              v-for="item in prostate"
              :key="item.code"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="事业部" prop="businessUnitNo">
          <el-select v-model="ruleForm.businessUnitNo" filterable placeholder="请选择事业部" style="width:100%" @change="busChange(ruleForm.businessUnitNo)">
            <el-option
              v-for="item in organList"
              :key="item.erpCode"
              :label="item.name "
              :value="item.erpCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资产类别" prop="assetCate">
           <el-select v-model="ruleForm.assetCate" placeholder="请选择资产类别" style="width:100%" >
            <el-option
              v-for="item in totallist.assetCate"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择设备/材料" >
          <el-input
            v-model="deviceDes"
            placeholder="请输入设备型号"
            style="width:100%"
            readonly
          >
            <el-button slot="append" @click="showDialog">选择</el-button>
            <EM slot="append" :organList="organList" :bindGetDevice="bindGetDevice" :showDialog="showDialogBox" @closeDialog="bindCloseDialog"/>
          </el-input>
        </el-form-item>

        <el-form-item label="单位" prop="unit">
          <el-select v-model="ruleForm.unit" placeholder="请选择单位" style="width:100%" disabled>
            <el-option
              v-for="item in totallist.unit"
              :key="item.code"
              :label="item.desc "
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="币种" prop="currency">
          <el-select v-model="ruleForm.currency" placeholder="请选择币种" style="width:100%">
            <el-option
              v-for="item in totallist.currency"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日价格（元）"  v-if="!epflag">
          <el-input v-model="ruleForm.dayPrice" placeholder="请输入日价格（元）" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="周价格（元）"  v-if="weekDis">
          <el-input v-model="ruleForm.weekPrice" placeholder="请输入周价格（元）" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="月价格（元）"  v-if="!epflag">
          <el-input v-model="ruleForm.monthPrice" placeholder="请输入月价格（元）" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="台班价格（元）"  v-if="machineDis">
          <el-input v-model="ruleForm.machineTeamPrice" placeholder="请输入台班价格（元）" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="生效日期" prop="startTime">
          <el-date-picker
          @change="startTimeChange"
            v-model="ruleForm.startTime"
            type="date"
            placeholder="请输入生效日期"
            style="width:100%"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="失效日期" >
          <el-date-picker
          @change="endTimeChange"
            v-model="ruleForm.endTime"
            type="date"
            placeholder="请输入失效日期"
            style="width:100%"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="设备标准价格（元）" v-if="epflag" prop="basePrice">
          <el-input v-model="ruleForm.basePrice" placeholder="请输入设备标准价格（元）" style="width:100%"></el-input>
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
import EM from "../../components/equipmentMaterials";
import { MessageBox,Message } from "element-ui";
import 
{ standListFind, perListStateFind, getAllUnitErpCodes,frontparams,updateDarfts,standSelectKey,standSave,getDefaultPriceInfo,submitStandardPrice,standadInvalidPrice  } 
from "@/services/datablock.js";
export default {
  components: {
    EM
  },
  name: "Index",
  computed: {},
  data() {
    let rag = /^((-?[1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$/; //可以为负数两位小数
    let validateDay = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入日价格（元）"));
      } else if (!rag.test(value)) {
        callback(new Error("价格格式错误"));
      }else{
        callback();
      }
    };
    let validateWeek = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入周价格（元）"));
      } else if (!rag.test(value)) {
        callback(new Error("价格格式错误"));
      }else{
        callback();
      }
    };
    let validateMonth = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入月价格（元）"));
      } else if (!rag.test(value)) {
        callback(new Error("价格格式错误"));
      }else{
        callback();
      }
    };
    let validateBase = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入标准价格（元）"));
      } else if (!rag.test(value)) {
        callback(new Error("标准价格格式错误"));
      }else{
        callback();
      }
    };
    let validateClass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入台班价格（元）"));
      } else if (!rag.test(value)) {
        callback(new Error("价格格式错误"));
      }else{
        callback();
      }
    };
    let validateStart = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("请选择生效日期"));
      } else if (value >= this.ruleForm.endTime && this.ruleForm.endTime !==null && this.ruleForm.endTime !=="") {
        callback(new Error("生效时间须小于失效日期"));
      } else {
        callback();
      }
    };
    let validateEnd = (rule, value, callback) => {
      if (value <= this.ruleForm.startTime) {
        callback(new Error("失效时间须大于生效日期"));
      } else {
        callback();
      }
    };
    return {
      updateId:null,//修改时id
      weekDis:true,
      machineDis:true,
      deviceDes:"",
      info:{},//底部信息
      pickerOptions: {//时间限制
          disabledDate(time) {
            return time.getTime() < Date.now()- 8.64e7;
          }},
      saveId:null,
      listStatus:'',//判断是否可编辑
      totallist:[],//枚举
      prostate:[],//状态枚举
      organList:[],//事业部枚举
      saveStatus:5,
      formInline: {
        d: "",
        user: "",
        region: ""
      },
      epflag: false, //设备标准价格
      popFlag: false, //弹框
      ruleForm: {
        bizType:1,//业务类型
        businessUnitNo: null,
        assetCate: "",
        unit: "",
        endTime: null,
        startTime: null,
        currency: "",
        dayPrice: "",
        weekPrice: "",
        monthPrice: "",
        machineTeamPrice:"",
        basePrice:"",
      },
      rules: {
        bizType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        assetCate: [
          { required: true, message: "请选择资产类别", trigger: "change" }
        ],
        unit: [{ required: true, message: "请选择单位", trigger: "change" }],
        dayPrice: [{ required: true, trigger: "blur", validator: validateDay }],
        weekPrice: [{ required: true, validator: validateWeek, trigger: "blur" }],
        monthPrice: [{ required: true, validator: validateMonth, trigger: "blur" }],
        basePrice:[{ required: true, validator: validateBase, trigger: "blur" }],
        // endTime: [{ trigger: "change", validator: validateEnd }],
        startTime: [
          { required: true, validator: validateStart, trigger: "blur" }
        ],
        machineTeamPrice: [{ required: true, validator: validateClass, trigger: "blur" }],
        currency: [
          { required: true, message: "请选择币种", trigger: "change" }
        ],
        equipmentType: [
          { required: true, message: "请输入设备型号", trigger: "change" }
        ],
        businessUnitNo:[
          { required: true, message: "请选择事业部", trigger: "change" }
        ],
        deviceDes:[
          { required: true, message: "请选择设备材料", trigger: "blur" }
        ],
      },
      showDialogBox: false
    };
  },
  created() {
    document.title = "标准价格详情";
    this.init()
  },
  methods: {
    init(){
      perListStateFind({}).then(res => {//状态枚举
        this.prostate = eval(res.enumVal.ResultStatusEnum);
      });
      getAllUnitErpCodes({}).then(res =>{
        //事业部列表查询
        this.organList = res.data;
      })
      frontparams({}).then(res =>{//枚举
        this.totallist = res.data
      })
      this.ruleForm.currency = 1
      if (this.$route.query.listStatus === 0) {
        this.ruleForm.bizType = this.$route.query.data.bizType
        this.ruleForm.businessUnitNo = this.$route.query.data.businessUnitNo
        this.ruleForm.assetCate = this.$route.query.data.assetCate
        this.ruleForm.deviceModelNo = this.$route.query.data.deviceModelNo
        this.ruleForm.businessUnitName = this.$route.query.data.businessUnitName
        this.ruleForm.deviceModelCode = this.$route.query.data.deviceModelCode  
        this.ruleForm.deviceModelName = this.$route.query.data.deviceModelName
        this.deviceDes = `${this.ruleForm.deviceModelNo} ${this.ruleForm.deviceModelCode} ${this.ruleForm.deviceModelName}`
        this.ruleForm.unit = this.$route.query.data.unit
        this.ruleForm.currency = this.$route.query.data.currency
        if(this.$route.query.data.endTime !== null ){
          this.ruleForm.endTime = this.$set(this.ruleForm,"startTime", this.$moment(this.$route.query.data.endTime).format("YYYY-MM-DD"))
        }else{
          this.ruleForm.endTime =null
        }
        if(this.$route.query.data.startTime !== null){
          this.ruleForm.startTime = this.$set(this.ruleForm,"startTime", this.$moment(this.$route.query.data.startTime).format("YYYY-MM-DD"))
        }
        if(this.$route.query.data.bizType === 1){
          this.ruleForm.dayPrice = this.$route.query.data.dayPrice
          this.ruleForm.weekPrice = this.$route.query.data.weekPrice
          this.ruleForm.monthPrice = this.$route.query.data.monthPrice
          this.ruleForm.machineTeamPrice =this.$set(this.ruleForm,'machineTeamPrice',this.$route.query.data.machineTeamPrice)
        }else if(this.$route.query.data.bizType === 2){
          this.ruleForm.basePrice = this.$route.query.data.basePrice
        }
        frontparams({}).then(res =>{//枚举
        this.totallist = res.data
        this.checkPrice(this.ruleForm.businessUnitNo)
      })
      }
      if (this.$route.query.id > 0) {
        standSelectKey({ id: this.$route.query.id }).then(res =>{//id查询
        this.ruleForm = res.data;
        // this.seldata()
          if(res.data.status === 0){
            this.saveStatus = 1
          }else if(res.data.status === 1){
            this.saveStatus = 2
          }else if(res.data.status === 2){
            this.saveStatus = 3
          }
          if(this.ruleForm.startTime !== null){
            this.ruleForm.startTime = this.$moment(
            this.ruleForm.startTime
          ).format("YYYY-MM-DD");
          }
          if(this.ruleForm.endTime !== null){
            this.ruleForm.endTime = this.$moment(
            this.ruleForm.endTime
          ).format("YYYY-MM-DD");
          } else{
            this.ruleForm.endTime =null
          }
          
          this.deviceDes = `${this.ruleForm.deviceModelNo} ${this.ruleForm.deviceModelCode} ${this.ruleForm.deviceModelName}`
          this.info.createTime = this.$moment(this.ruleForm.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.info.updateTime = this.$moment(this.ruleForm.updateTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.info.createUser = this.ruleForm.createUser;
          this.info.updateUser = this.ruleForm.updateUser;
          frontparams({}).then(res =>{//枚举
        this.totallist = res.data
        this.checkPrice(this.ruleForm.businessUnitNo)
      })
      })
      }else{
        this.saveStatus = 0
      }
    },
    
    choice() {
      //设备材料选择
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    typeChange(val) {//业务类型改变事件
      this.$refs["ruleForm"].clearValidate();
      this.ruleForm.businessUnitNo = null
      this.checkPrice(this.ruleForm.businessUnitNo)
    },
    busChange(val) {//事业部改变
    this.$refs["ruleForm"].clearValidate();
      for(let i =0;i<this.organList.length; i++){
        const item =this.organList[i]
        if(item.erpCode === val){
          this.ruleForm.businessUnitName = item.name
        }
      }
      this.checkPrice(val)
    },
    checkPrice(val){
      if(this.ruleForm.bizType === 1){
        if(this.totallist.notShowPriceDept.teamPrice.indexOf(val) !== -1){
        this.machineDis = false
        this.epflag = false
      }else{
        this.machineDis = true
        this.epflag = false
      }
      if(this.totallist.notShowPriceDept.weekPrice.indexOf(val) !== -1){
        this.weekDis = false
      }else{
        this.weekDis = true
      }
      } else if(this.ruleForm.bizType === 2){
        this.epflag = true;
        this.weekDis = false;
        this.machineDis = false;
      }
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
          this.$router.push("/standardPriceList");
        })
        .catch(() => {});
    },

    startTimeChange(val) {
      //时间改变
      if(this.ruleForm.startTime !== null){
        this.ruleForm.startTime = this.$moment(val).format("YYYY-MM-DD");
      }
    },
    endTimeChange(val) {
      //时间改变
      if(this.ruleForm.endTime !== null){
        this.ruleForm.endTime = this.$moment(val).format("YYYY-MM-DD");
      } else{
        this.ruleForm.endTime = null
      }
      
    },
    // 点击选择设备材料
    showDialog() {
      this.showDialogBox = true
    },
    // 关闭选择材料
    bindCloseDialog() {
      this.showDialogBox = false
    },
    // 根据设备型号及时间查询标准价
    bindGetDefaultPriceInfo() {
       const param = {
         deviceModelNo: this.ruleForm.deviceModelNo,
         start_time: this.ruleForm.start_time,
         end_time: this.ruleForm.end_time
       }
      getDefaultPriceInfo(param).then(res => {
        if (res.code === 200) {
          this.ruleForm.defaultDayPrice = ''
          this.ruleForm.defaultweekPrice = ''
          this.ruleForm.defaultMonthPrice = ''
          this.ruleForm.machineTeamPrice = ''
          this.ruleForm.basePrice = ''
        }
      })
    },

    // 获取设备选择之后的返回信息  同时给设备单位及标准价格赋值
    bindGetDevice(param) {
      this.ruleForm.deviceModelNo = param.itemCode || ''
      this.ruleForm.deviceModelCode = param.modelCode || ''
      this.ruleForm.deviceModelName = param.name || ''
      this.ruleForm.unit = param.uinitType || ''
      this.deviceDes = `${this.ruleForm.deviceModelNo} ${this.ruleForm.deviceModelCode} ${this.ruleForm.deviceModelName}`
      console.log(this.deviceDes,23)
      // 根据设备信息获取标准价格信息
      this.bindGetDefaultPriceInfo()
    },
    close() {
      //关闭按钮
      this.$router.push("/standardPriceList");
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
      
      if(this.deviceDes === ""){
        Message.error({
          message: '设备/材料不能为空',
        });
      }else{
        let par = {...this.ruleForm};
        console.log(par,'par')
        if(this.$route.query.listStatus === 0 || !this.$route.query.listStatus){
        par.id = this.updateId
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          standSave(par).then(res => {
        if (res.success === true) {
           Message.success({
          message: '保存成功',
        });
        this.saveId = res.data.id
            this.saveStatus = 1;
            this.ruleForm.priceNo = res.data.priceNo;
            this.ruleForm.status = res.data.status;
      this.getdata(res.data)
        } else{
          Message.error(res.msg || '保存失败');
        }
      });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      }
      
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
          standadInvalidPrice({id:par}).then(res => {
            if (res.success === true) {
              Message.success({
              message: '作废成功',
            });
            this.getdata(res.data)
            this.saveStatus =3
            this.ruleForm.status = res.data.status
            }else {
          Message.error(res.msg || '作废失败');
        }
          });
        });
    },
    update(){//修改
      this.$route.query.disabled = false
      this.saveStatus = 0;
      this.updateId = this.saveId
    },
    submit(formName) {
      //提交按钮
      let par = {};
      this.$refs[formName].validate((valid) => {
        if (valid) {
           if (this.$route.query.id >0){
            par = this.$route.query.id 
          }else{
            par  = this.saveId
          }
          submitStandardPrice({id:par}).then(res =>{
        if (res.success === true) {
           Message.success({
          message: '提交成功',
        });
        this.getdata(res.data)
          this.saveStatus = 2;
          this.ruleForm.status = res.data.status
          console.log(this.saveStatus)
        }else {
          Message.error(res.msg || '提交失败');
        }
      })
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
      updateDarfts({id:par}).then(res =>{
        console.log(res.msg)
        if (res.success === true) {
           Message.success({
          message: '撤销成功',
        });
        this.getdata(res.data)
          this.saveStatus = 1;
          this.ruleForm.status = res.data.status
        }else {
          Message.error(res.msg || '撤销失败');
        }
      })
    }
  }
};
</script>

<style lang='scss' scoped>
.detail {
  margin-top: 20px;
  text-align: left;
}

.contentForm {
  width: 96%;
  
  margin: 15px auto 0;
}
.demo-form-inline {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.contentForm .el-form--inline .el-form-item {
  width: 30%;
}
.contentForm ::v-deep.el-form-item__label {
  text-align: center;
}
.contentForm ::v-deep.el-form-item__content {
  //输入框宽度
  width: 70%;
}

.header {
  width: 96%;
  margin: 0 4rem;
  text-align: left;
  .btn {
    margin: 1rem 1rem;
    width: 96px;
  }
}
//时间
.contentForm ::v-deep.el-input__prefix {
  display: none;
}
//禁用
.noclick{
  pointer-events: none;
}
.noclick ::v-deep.el-input__suffix{
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
