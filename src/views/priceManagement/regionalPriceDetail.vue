<template>
  <div class="detail">
    <div class="btn">
      <template v-if="pageType === 'add'">
        <el-button type="primary" class="btn-w" @click="clear">取消</el-button>
        <el-button type="primary" class="btn-w" @click="bindSave('formInline')">保存</el-button>
        <el-button type="primary" class="btn-w" @click="close">关闭页面</el-button>
      </template>
      <template v-else-if="pageType === 'submit'">
        <el-button type="primary" class="btn-w" @click="bindVoid(0)">作废</el-button>
        <el-button type="primary" class="btn-w" @click="update">修改</el-button>
        <el-button type="primary" class="btn-w" @click="submitForm">提交</el-button>
        <el-button type="primary" class="btn-w" @click="close">关闭页面</el-button>
      </template>
      <div v-else-if="pageType === 'revoke'">
        <el-button type="primary" class="btn-w" @click="bindVoid(1)">作废</el-button>
        <el-button type="primary" class="btn-w" @click="bindRevoke">撤销确认</el-button>
        <el-button type="primary" class="btn-w" @click="close">关闭页面</el-button>
      </div>
      <div v-else-if="pageType === 'hasRevoked'">
        <el-button type="primary" class="btn-w" @click="close">关闭页面</el-button>
      </div>
    </div>
    <div
      class="contentForm"
      :class="pageType === 'submit' ||pageType === 'revoke' ||pageType === 'hasRevoked'? 'noclick':''"
    >
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="28%"
        :rules="rules"
        ref="formInline"
        :validate-on-rule-change="false"
      >
        <el-form-item label="区域价格批号">
          <el-input v-model="formInline.priceNo" disabled style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select
            v-model="formInline.bizType"
            placeholder="请选择业务类型"
            style="width:100%"
            @change="typeChange"
            :disabled="pageDisabled"
          >
            <template v-if="frontObj && frontObj.bizType">
              <el-option
                v-for="item in frontObj.bizType"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.status" filterable style="width:100%" disabled placeholder>
            <template v-if="frontObj && frontObj.status">
              <el-option
                v-for="item in frontObj.status"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="事业部" prop="businessUnitNo">
          <el-select
            v-model="formInline.businessUnitNo"
            filterable
            placeholder="请选择事业部"
            style="width:100%"
            :disabled="pageDisabled"
            @change="organChange"
          >
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

        <el-form-item label="营业店" prop="storeName">
          <el-select
            v-model="formInline.storeName"
            placeholder="请选择营业店"
            style="width:100%"
            :disabled="monthDisabled && pageDisabled"
            filterable
            @change="storeChange"
          >
            <template v-if="shopList && shopList.length > 0">
              <el-option
                v-for="(item, index) in shopList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="资产类别" prop="assetCate">
          <el-select
            v-model="formInline.assetCate"
            placeholder="请选择资产类别"
            style="width:100%"
            :disabled="pageDisabled"
          >
            <template v-if="frontObj && frontObj.assetCate">
              <el-option
                v-for="item in frontObj.assetCate"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="选择设备/材料">
          <el-input
            v-model="deviceDes"
            placeholder="请输入设备/材料型号"
            style="width:100%"
            :disabled="pageDisabled"
          >
            <el-button slot="append" @click="showDialog">选择</el-button>
            <EM slot="append" :organList="organList" :bindGetDevice="bindGetDevice" :showDialog="showDialogBox" @closeDialog="bindCloseDialog"/>
          </el-input>
        </el-form-item>

        <el-form-item label="设备单位">
          <el-select v-model="formInline.unit" placeholder="请选择设备单位" style="width:100%" disabled>
            <el-option label="台" value="tai"></el-option>
            <el-option label="辆" value="liang"></el-option>
            <template v-if="frontObj && frontObj.unit">
              <el-option
                v-for="item in frontObj.unit"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="设置月价格">
          <el-radio-group v-model="formInline.isMonths" @change="monthChange">
            <el-radio :label="1" :disabled="pageDisabled">是</el-radio>
            <el-radio :label="0" :disabled="pageDisabled">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="月份">
          <el-date-picker
            v-model="formInline.months"
            type="month"
            placeholder="请选择月"
            style="width:100%"
            :disabled="disMonth || pageDisabled"
            :picker-options="pickerOptions"
            @change="setMonth"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="活动类型" prop="promType">
          <el-select
            v-model="formInline.promType"
            placeholder="请选择活动类型"
            style="width:100%"
            :disabled="pageDisabled"
          >
            <template v-if="frontObj && frontObj.promType">
              <el-option
                v-for="item in frontObj.promType"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="区域型号折扣率%" prop="discount">
          <el-input
            v-model="formInline.discount"
            placeholder="请输入区域型号折扣率"
            style="width:100%"
            :disabled="pageDisabled"
            @blur="setAreaPrice"
          ></el-input>
        </el-form-item>

        <el-form-item label="币种" prop="currency">
          <el-select
            v-model="formInline.currency"
            placeholder="请选择币种"
            style="width:100%"
            :disabled="pageDisabled"
          >
            <template v-if="frontObj && frontObj.currency">
              <el-option
                v-for="item in frontObj.currency"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="生效日期" prop="start_time">
          <el-date-picker
            v-model="formInline.start_time"
            type="date"
            placeholder="请输入生效日期"
            style="width:100%"
            :picker-options="pickerOptions"
            :disabled="pageDisabled"
            @change="startTimeCheck"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="失效日期">
          <el-date-picker
            v-model="formInline.end_time"
            type="date"
            placeholder="请输入失效日期"
            style="width:100%"
            :picker-options="pickerOptions"
            :disabled="pageDisabled"
            @change="endTimeCheck"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="标准日价格（元）" v-show="epflag && hideDayPrice">
          <el-input v-model="standpc.dayPrice" style="width:100%" readonly disabled></el-input>
        </el-form-item>

        <el-form-item label="标准周价格（元）" v-show="epflag && hideWeekPrice">
          <el-input v-model="standpc.weekPrice" style="width:100%" readonly disabled></el-input>
        </el-form-item>

        <el-form-item label="标准月价格（元）" v-show="epflag && hideMonthPrice">
          <el-input v-model="standpc.monthPrice" style="width:100%" readonly disabled></el-input>
        </el-form-item>

        <el-form-item label="标准台班价格（元）" v-show="epflag && hideTeamPrice">
          <el-input v-model="standpc.machineTeamPrice" style="width:100%" readonly disabled></el-input>
        </el-form-item>

        <el-form-item label="设备标准价格（元）" v-show="!epflag">
          <el-input v-model="standpc.basePrice" style="width:100%" disabled></el-input>
        </el-form-item>

        <el-form-item label="区域日价格（元）" v-show="epflag && hideDayPrice">
          <el-input
            v-model="formInline.dayPrice"
            placeholder="请输入区域日价格（元）"
            style="width:100%"
            :disabled="pageDisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="区域周价格（元）" v-show="epflag && hideWeekPrice">
          <el-input
            v-model="formInline.weekPrice"
            placeholder="请输入区域周价格（元）"
            style="width:100%"
            :disabled="pageDisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="区域月价格（元）" v-show="epflag && hideMonthPrice">
          <el-input
            v-model="formInline.monthPrice"
            placeholder="请输入区域月价格（元）"
            style="width:100%"
            :disabled="pageDisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="区域台班价格（元）" v-show="epflag && hideTeamPrice">
          <el-input
            v-model="formInline.machineTeamPrice"
            placeholder="请输入区域台班价格（元）"
            style="width:100%"
            :disabled="pageDisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="设备折扣价格（元）" v-show="!epflag" prop="discountPrice">
          <el-input
            v-model="formInline.discountPrice"
            placeholder="请输设备折扣价格（元）"
            style="width:100%"
            :disabled="pageDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="update-info" v-if="updateHistoryInfo && updateHistoryInfo.createUser !== ''">
      <span>创建人：{{updateHistoryInfo.createUser}}</span>
      <span>创建时间：{{updateHistoryInfo.createTime}}</span>
      <span>修改人：{{updateHistoryInfo.updateUser}}</span>
      <span>修改时间：{{updateHistoryInfo.updateTime}}</span>
    </div>
  </div>
</template>

<script>
import EM from "../../components/equipmentMaterials";
import {
  frontparams,
  bindRegionSave,
  getAllUnitErpCodes,
  getSubShopsErpCodes,
  regionPriceSubmit,
  regionUpdateInValid,
  revokeOrderInfo,
  regionSelectByPrimaryKey,
  getDefaultPriceInfo
} from "@/services/datablock.js";
import { MessageBox, Message } from "element-ui";
const rag = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/; //0-100百分数
const regNum = /^[0-9]+\.?[0-9]*$/;
const validateAreaPrice = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入区域价格"));
  } else if (!regNum.test(value)) {
    callback(new Error("区域价格必须为数字"));
  } else {
    callback();
  }
};
const validateDiscountPrice = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入设备折扣价格"));
  } else if (!regNum.test(value)) {
    callback(new Error("设备折扣价格必须为数字"));
  } else {
    callback();
  }
};
const validateDiscount = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入区域型号折扣率%"));
  } else if (!rag.test(value)) {
    callback(new Error("区域型号折扣率格式错误"));
  } else {
    callback();
  }
};
const validateDateTime = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入失效日期"));
  } else if (!this.comparedMonth(this.formInline.start_time, value)) {
    callback(new Error("失效日期必须晚于生效日期"));
  } else {
    callback();
  }
};
export default {
  components: {
    EM
  },
  name: "RegionalPriceDetail",
  data() {
    return {
      storeflag:false,
      updateId:null,//修改时id
      standpc: {},
      pageType: "",
      pageTyped:"",//新按钮状态
      orderId: null, // 保存之后的记录编号
      pageDisabled: false, //  页面是否可编辑
      monthDisabled: true,
      pageStatus: 0, // 表单状态 0草稿，1 生效，2 失效
      frontObj: {}, // 页面默认数据
      organList: [], // 事业部列表
      shopList: [], // 事业部下营业店列表
      deviceDes: "", // 设备编号，厂家型号，设备名称组成的值
      notShowPriceDept: {
        dayPrice: [],
        teamPrice: [],
        monthPrice: [],
        weekPrice: []
      },
      hideDayPrice: true,
      hideMonthPrice: true,
      hideTeamPrice: true,
      hideWeekPrice: true,
      updateHistoryInfo: {
        createUser: "",
        createTime: "",
        updateUser: "",
        updateTime: ""
      },
      pickerOptions: {
        //生效日期限制
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      epflag: true,
      formInline: {
        assetCate: "",
        businessUnitNo: "",
        storeName: null,
        bizType: null,
        status: "",
        promType: "",
        discount: 100,
        currency: "",
        start_time: "",
        end_time: "",
        basePrice: "",
        discountPrice: null,
        isMonths: 0,
        dayPrice: null,
        weekPrice: null,
        monthPrice: null,
        defaultMonthPrice: null,
        machineTeamPrice: null
      },
      ruleForm: {
        num: ""
      },
      disMonth: true,
      showDialogBox: false // 选择设备弹框是否显示
    };
  },
  computed: {
    rules() {
      const defaultRules = {
        assetCate: [
          { required: true, message: "请选择资产类别", trigger: "change" }
        ],
        businessUnitNo: [
          { required: true, message: "请选择事业部", trigger: "change" }
        ],
        storeName: [
          { required: true, message: "请选择营业店", trigger: "change" }
        ],
        promType: [
          { required: true, message: "请选择活动类型", trigger: "change" }
        ],
        discount: [
          { required: true, trigger: "blur", validator: validateDiscount }
        ],
        currency: [
          { required: true, message: "请选择币种", trigger: "change" }
        ],
        start_time: [
          { required: true, message: "请输入生效日期", trigger: "change" }
        ],
      }
      let rulesParam = defaultRules
      const dayPrice = {
        dayPrice: [
          { required: true, trigger: "blur", validator: validateAreaPrice }
        ]
      }
      const weekPrice = {
        weekPrice: [
          { required: true, trigger: "blur", validator: validateAreaPrice }
        ]
      }
      const monthPrice = {
        monthPrice: [
          { required: true, trigger: "blur", validator: validateAreaPrice }
        ]
      }
      const discountPrice = {
        discountPrice: [
          { required: true, trigger: "blur", validator: validateDiscountPrice }
        ]
      }
      const machineTeamPrice = {
        machineTeamPrice: [
          { required: true, trigger: "blur", validator: validateAreaPrice }
        ]
      }
      let addRules = {}
      if (this.epflag && this.hideDayPrice) {
        addRules = Object.assign(addRules, dayPrice)
      }
      if (this.epflag && this.hideWeekPrice) {
        addRules = Object.assign(addRules, weekPrice)
      }
      if (this.epflag && this.hideMonthPrice) {
        addRules = Object.assign(addRules, monthPrice)
      }
      if (this.epflag && this.hideTeamPrice) {
        addRules = Object.assign(addRules, machineTeamPrice)
      }
      if (!this.epflag) {
        addRules = Object.assign(addRules, discountPrice)
      }
      rulesParam = {...defaultRules, ...addRules}
      return rulesParam
    },
  },
  created() {
    document.title = "区域价格详情";
    // 获取事业部列表
    this.getAllUnitErpCodeList();
    // 获取页面默认数据
    this.getFrontInfo();
  },
  watch: {
    shopList: function(newValue) {
      if(this.storeflag === true){
          this.shopList = newValue;
        this.formInline.storeName = null;
      }
    },
    "formInline.end_time": function(newValue) {
      setTimeout(() => {
        if (this.formInline.start_time === "") {
          this.formInline.end_time = "";
        }
      }, 100);
    }
  },
  methods: {
    typeChange(val) {
      this.formInline.bizType = val;
      //业务类型改变事件
      if (val === 1) {
        this.epflag = true;
      } else {
        this.epflag = false;
      }
      this.bindHideForm();
      // this.formInline.businessUnitNo = ""
    },
    monthChange(val) {
      //单选框
      if (val === 1) {
        this.disMonth = false;
      } else if (val === 0) {
        this.disMonth = true;
        this.formInline.months = "";
      }
    },
    // 输入月份之后给生效日期，失效日期附上相应的值
    setMonth(value) {
      this.formInline.start_time = this.getStartDay(value);
      this.formInline.end_time = this.getNextMonthStart(value);
    },
    // 日期转换
    getDate(val) {
      return this.$moment(val).format("YYYY-MM");
    },
    // 根据月份计算当月第一天
    getStartDay(val) {
      return this.$moment(val)
        .startOf("month")
        .format("YYYY-MM-DD");
    },
    // 根据月份计算下个月第一天
    getNextMonthStart(val) {
      return this.$moment(val).add(1, 'months').date(1).format("YYYY-MM-DD");
    },
    // 失效日期跟生效日期匹配校验 startDay 是否早于endDay
    comparedMonth(startDay, endDay) {
      return this.$moment(startDay).isBefore(endDay);
    },
    // 计算失效日期是否晚于当前日期
    endTimeBefore() {
      const currentDay = Date.now();
      let isBefore = true;
      if (
        this.formInline.end_time !== "" &&
        this.formInline.end_time !== undefined &&
        this.formInline.end_time !== null
      ) {
        isBefore = this.comparedMonth(currentDay, this.formInline.end_time);
      }
      return isBefore;
    },
    // 获取事业部列表
    getAllUnitErpCodeList() {
      getAllUnitErpCodes().then(res => {
        if (res.code === 200 && res.data && res.data.length > 0) {
          this.organList = res.data || [];
        } else {
          Message.error(res.msg || ' 获取事业部列表失败');
        }
      });
    },
    // 事业部下营业店查询
    getSubShopsList(erpCode) {
      const param = { erpCode };
      getSubShopsErpCodes(param).then(res => {
        if (res.success === true && res.data.length > 0) {
          this.shopList = res.data;
        } else {
          this.shopList = [];
          Message({
            message: "该事业部下无营业店"
          });
        }
      });
    },
    // 点击选择事业部,获取对应事业部下的营业店
    organChange(erpCode) {
      this.storeflag = true
      this.getSubShopsList(erpCode);
      this.bindHideForm();
      for (let i = 0; i < this.organList.length; i++) {
        const item = this.organList[i];
        if (item.erpCode === erpCode) {
          this.formInline.businessUnitName = item.name;
        }
      }
    },
    storeChange(erpCode) {
      //点击营业店
      for (let i = 0; i < this.shopList.length; i++) {
        const item = this.shopList[i];
        if (item.name === erpCode) {
          this.formInline.storeNo = item.erpCode;
        }
      }
    },
    bindHideForm() {
      // 初始状态隐藏hide为true
      this.hideDayPrice = true;
      this.hideMonthPrice = true;
      this.hideTeamPrice = true;
      this.hideWeekPrice = true;
      // 当业务类型为租赁时，对应指定的所选事业部 显示不同的价格
      this.hideForm(this.notShowPriceDept.dayPrice, "hideDayPrice");
      this.hideForm(this.notShowPriceDept.teamPrice, "hideTeamPrice");
      this.hideForm(this.notShowPriceDept.monthPrice, "hideMonthPrice");
      this.hideForm(this.notShowPriceDept.weekPrice, "hideWeekPrice");
    },
    hideForm(arry, type) {
      if (arry && arry.length > 0) {
        arry.forEach(item => {
          if (item === this.formInline.businessUnitNo) {
            if (type === "hideDayPrice") {
              this.hideDayPrice = false;
            } else if (type === "hideMonthPrice") {
              this.hideMonthPrice = false;
            } else if (type === "hideTeamPrice") {
              this.hideTeamPrice = false;
            } else if (type === "hideWeekPrice") {
              this.hideWeekPrice = false;
            }
          }
        });
      }
    },
    // 如果控制区域价的属性为false 则将对应价格置空
    setAreaPriceEmpty() {
      if (!this.hideDayPrice) {
        this.formInline.dayPrice = "";
      } else if (!this.hideWeekPrice) {
        this.formInline.weekPrice = "";
      } else if (!this.hideMonthPrice) {
        this.formInline.monthPrice = "";
      } else if (!this.hideTeamPrice) {
        this.formInline.machineTeamPrice = "";
      }
    },

    // 获取页面所需默认数据
    getFrontInfo() {
      frontparams().then(res => {
        if (res.success === true) {
          this.frontObj = res.data || {};
          this.notShowPriceDept = res.data.notShowPriceDept;
          if (res.data && res.data.bizType.length > 0) {
            res.data.bizType.forEach(item => {
              if (item.desc === "租赁") {
                this.formInline.bizType = item.code;
              }
            });
          }

          if (this.$route.query.id > 0) {
            // this.pageType = this.$route.query.pageType;
            this.getOrderInfo(this.$route.query.id);
            

            
            if(this.formInline.status ===0){
              this.pageType = "submit";
            }else if(this.formInline.status ===1){
              this.pageType = "revoke";
            }else if(this.formInline.status ===1){
              this.pageType = "hasRevoked";
            }
          } else {
            this.pageType = "add";
          }
        }else{
          Message.error(res.msg || '失败');
        }
      });
      this.formInline.currency = 1;
      
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
        deviceModelNo: this.formInline.deviceModelNo,
        deviceModelCode: this.formInline.deviceModelCode,
        start_time: this.formInline.start_time,
        end_time: this.formInline.end_time
      };
      getDefaultPriceInfo(param).then(res => {
        if (res.success === true) {
          const priceObj = res.data.standardPriceVersionDO;
          this.standpc.dayPrice = priceObj.dayPrice
          this.standpc.weekPrice = priceObj.weekPrice
          this.standpc.monthPrice = priceObj.monthPrice
          this.standpc.machineTeamPrice = priceObj.machineTeamPrice
          this.standpc.basePrice = priceObj.basePrice
          this.formInline.standardVersion = priceObj.id;

          // 标准价改变之后重新计算区域价
          if (
            this.formInline.discount !== "" &&
            this.formInline.discount !== undefined &&
            this.formInline.discount !== null
          ) {
            this.setAreaPrice();
          }
        }else{
          Message.error(res.msg || '设备关联失败');
          this.standpc = {}
        }
      });
    },
    // 获取设备选择之后的返回信息  同时给设备单位及标准价格赋值
    bindGetDevice(param) {
      this.formInline.deviceModelNo = param.itemCode || "";
      this.formInline.deviceModelCode = param.modelCode || "";
      this.formInline.deviceModelName = param.name || "";
      this.formInline.unit = param.uinitType || "";
      this.deviceDes = `${this.formInline.deviceModelNo} ${this.formInline.deviceModelCode} ${this.formInline.deviceModelName}`;
      // 根据设备信息获取标准价格信息
      this.bindGetDefaultPriceInfo();
    },
    // 点击折扣价格给区域价赋值
    setAreaPrice() {
      const val = this.formInline.discount;
      if (val !== "" && Number(val) > 0 && Number(val) <= 100) {
        this.formInline.dayPrice = this.countPrice(
          this.standpc.dayPrice
        );
        this.formInline.weekPrice = this.countPrice(
          this.standpc.weekPrice
        );
        this.formInline.monthPrice = this.countPrice(
          this.standpc.monthPrice
        );
        this.formInline.machineTeamPrice = this.countPrice(
          this.standpc.machineTeamPrice
        );
        this.formInline.discountPrice = this.countPrice(
          this.standpc.basePrice
        );
      } else if (Number(val) == 0) {
        Message("折扣率不能为0");
      } else if (Number(val) > 100) {
        Message("折扣率不能大于100");
      }
    },
    // 计算价格公示
    countPrice(val) {
      let price = "";
      if (val !== "" && val !== undefined && val !== null) {
        price = (Number(this.formInline.discount) * val) / 100;
      }
      return price;
    },
    getdata(data){
      const { createUser, createTime, updateUser, updateTime } = data;
                this.updateHistoryInfo.createUser = createUser || "";
                this.updateHistoryInfo.createTime =
                  this.$moment(createTime).format("YYYY-MM-DD HH:mm:ss") || "";
                this.updateHistoryInfo.updateUser = updateUser || "";
                this.updateHistoryInfo.updateTime =
                  this.$moment(updateTime).format("YYYY-MM-DD HH:mm:ss") || "";
    },
    // 区域价格保存
    bindSave(formName) {
      this.$refs[formName].validate(valid => {
        if (this.deviceDes === "") {
          Message.error({
            message: "设备/材料不能为空"
          });
        } else {
          if (valid) {
            if (this.formInline.months !== "") {
              this.formInline.months = this.getDate(this.formInline.months);
            }
            const isBefore = this.endTimeBefore();
            if (!isBefore) {
              Message({
                message: "失效时间必须晚于当前时间"
              });
              return false;
            }
            this.formInline.start_time = this.$moment(
              this.formInline.start_time
            ).format("YYYY-MM-DD");
            if(this.formInline.end_time !== '' && this.formInline.end_time !== null){
              this.formInline.end_time = this.$moment(this.formInline.end_time).format("YYYY-MM-DD");
            } else {
              this.formInline.end_time = null
            }
            this.formInline.startTime = null
            this.formInline.endTime = null
            const param = this.formInline;
            if(this.$route.query.pageType === "add" || !this.$route.query.pageType){
              param.id = this.updateId
            }
            this.setAreaPriceEmpty();
            bindRegionSave(param).then(res => {
              if (res.success === true) {
                Message({
                  message: "保存成功",
                  type: "success"
                });
                this.pageDisabled = true;
                this.monthDisabled = true;
                // 新增保存成功之后修改该条信息的状态 同时修改页面交互状态，保存状态变为提交状态
                const data = res.data || {};
                this.formInline.status = data.status;
                this.formInline.priceNo = data.priceNo
                this.pageType = "submit";
                this.orderId = res.data.id;
                this.getdata(data)
              } else {
                Message.error(res.msg || '保存失败');
              }
            });
          }
        }
      });
    },
    // 区域价格提交
    submitForm() {
      const isBefore = this.endTimeBefore();
      if (!isBefore) {
        Message({
          message: "失效时间必须晚于当前时间"
        });
        return false;
      }
      let param = {};
      if(this.$route.query.pageType === "add" || !this.$route.query.pageType){
          param = this.orderId;
      } else {
        param = this.$route.query.id;
      }
      regionPriceSubmit({ id: param }).then(res => {
        if (res.success === true) {
          // 提交成功后页面进入可撤销阶段
          this.formInline.status = 1;
          this.pageType = "revoke";
          this.pageDisabled = true;
          this.monthDisabled = true;
          Message({
            message: "提交成功",
            type: "success"
          });
          this.getdata(res.data)
        } else {
          Message.error(res.msg || '提交失败');
        }
      });
    },
    // 失效时间校验，失效时间必须大于生效时间
    endTimeCheck(val) {
      if (this.formInline.start_time === "") {
        Message("请先选择生效日期");
      } else if (!this.comparedMonth(this.formInline.start_time, val) &&this.formInline.end_time!== null) {
        Message("失效日期必须晚于生效日期");
      }
      // 修改标准价
      if (this.formInline.start_time !== "") {
        this.bindGetDefaultPriceInfo();
      }
    },
    startTimeCheck() {
      // 修改标准价
      if (this.formInline.start_time !== "") {
        this.bindGetDefaultPriceInfo();
      }
    },
    // 修改 点击修改按钮，页面从生效状态变为草稿状态 ,进入保存界面
    update() {
      this.pageType = "add";
      this.pageDisabled = false;
      this.updateId = this.orderId
    },
    // 作废
    void() {
      let par = {};
      if(this.$route.query.pageType === "add" || !this.$route.query.pageType){
          par = this.orderId;
      } else {
        par = this.$route.query.id;
      }
      regionUpdateInValid({ id: par }).then(res => {
        if (res.success === true) {
          // 作废请求成功后停留在当前页，所有字段不可修改
          Message({
                  message: "作废成功",
                  type: "success"
                });
          this.formInline.status = 2;
          this.pageType = "hasRevoked";
          this.pageDisabled = false;
          this.getdata(res.data)
        } else {
          Message.error(res.msg || '作废失败');
        }
      });
    },
    // 点击作废
    bindVoid(type) {
      MessageBox.confirm("确定要作废此单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.void(type);
        })
        .catch(() => {});
    },
    // 撤销确认 点击撤销确认按钮后，当前页面从生效状态变我草稿状态
    bindRevoke() {
      let par = {};
      if(this.$route.query.pageType === "add" || !this.$route.query.pageType){
          par = this.orderId;
      } else {
        par = this.$route.query.id;
      }
      revokeOrderInfo({ id: par }).then(res => {
        if (res.success === true) {
          Message({
                  message: "撤销成功",
                  type: "success"
                });
          this.formInline.status = 0;
          this.pageType = "submit";
          this.pageDisabled = false;
          this.monthDisabled = false;
          this.getdata(res.data)
        } else {
          Message.error(res.msg || '撤销失败');
        }
      });
    },
    // 取消
    clear() {
      MessageBox.confirm("确定要取消操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    // 关闭页面
    close() {
      this.$router.go(-1);
    },
    // 获取单条数据信息
    getOrderInfo(id, type) {
      const param = {
        id: Number(id)
      };
      regionSelectByPrimaryKey(param).then(res => {
        if (res.code === 200) {
          this.formInline = res.data.price;
          this.getSubShopsList(this.formInline.businessUnitNo)
          if (this.$route.query.pageType === "add") {
            res.data.price.id = null;
            res.data.price.priceNo = null
            res.data.price.status = null
            // this.getSubShopsList(this.formInline.businessUnitNo)
          }
          if(this.formInline.status === 0){
              this.pageType = 'submit'
            } else if(this.formInline.status === 1){
              this.pageType = 'revoke'
            } else if(this.formInline.status === 2){
              this.pageType = 'hasRevoked'
            }
            if(this.$route.query.state === 0){
              this.pageType = 'add'
            } 
          this.deviceDes = `${this.formInline.deviceModelNo} ${this.formInline.deviceModelCode}  ${this.formInline.deviceModelName}`;
          if (res.data.price) {
            this.formInline.start_time = this.$set(this.formInline,"start_time",this.$moment(
              res.data.price.startTime
            ).format("YYYY-MM-DD")) // res.data.price.startTime // this.$moment(res.data.price.startTime).format("YYYY-MM-DD")
            if(this.formInline.endTime !== null){
              this.formInline.end_time = this.$set(this.formInline,"end_time",this.$moment(
                res.data.price.endTime
              ).format("YYYY-MM-DD"))
            }else if(this.formInline.endTime === null){
              // this.formInline.end_time = null
              this.formInline.end_time = this.$set(this.formInline,"end_time",null)
            }
          }
          

          this.bindHideForm();
          const {
            createUser,
            createTime,
            updateUser,
            updateTime
          } = res.data.price;
          if(this.$route.query.pageType !== "add"){
            this.updateHistoryInfo.createUser = createUser || "";
          this.updateHistoryInfo.createTime =
            this.$moment(createTime).format("YYYY-MM-DD HH:mm:ss") || "";
          this.updateHistoryInfo.updateUser = updateUser || "";
          this.updateHistoryInfo.updateTime =
            this.$moment(updateTime).format("YYYY-MM-DD HH:mm:ss") || "";
          }
            //标准价格
          this.standpc.dayPrice = res.data.version.dayPrice;
          this.standpc.weekPrice = res.data.version.weekPrice;
          this.standpc.monthPrice = res.data.version.monthPrice;
          this.standpc.machineTeamPrice =
            res.data.version.machineTeamPrice;
          this.standpc.basePrice = res.data.version.basePrice;
          if (this.formInline.bizType && this.formInline.bizType === 1) {
             this.epflag = true;
            } else {
              this.epflag = false;
            }
            if(this.formInline.isMonths === 1){
              this.disMonth = false
            }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.noclick {
  pointer-events: none;
}
.noclick ::v-deep.el-input__suffix {
  z-index: -1;
}
.contentForm {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.contentForm .el-form--inline .el-form-item {
  width: 30%;
}
.demo-form-inline {
  width: 100%;
  text-align: left;
}
.contentForm ::v-deep.el-form-item__content {
  //输入框宽度
  width: 70%;
}
.btn {
  width: 96%;
  margin: 0 auto;
  text-align: left;
}
.btn-w {
  margin: 1rem 1rem;
  width: 96px;
}
//时间
.contentForm ::v-deep.el-input__prefix {
  display: none;
}
.update-info {
  color: #999;
  padding: 20px 0 40px 40px;
  text-align: left;
}
.update-info span {
  display: inline-block;
  padding-right: 30px;
  font-size: 12px;
}
</style>
