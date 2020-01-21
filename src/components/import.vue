<template>
  <div class="imp">
    <el-button type="primary" @click="add" class="addbtn">新增</el-button>
    <el-upload
      class="upload-demo"
      :action="actionUrl"
      :headers="headersObj"
      :on-error="error"
      :on-remove="handleRemove"
      :on-success="success"
      :multiple="false"
      :limit="1"
      accept=".xls,.xlsx"
      ref="upload"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
    >
      <el-button type="primary">点击上传</el-button>
    </el-upload>
    <div class="textBtn" @click="template">模板下载</div>
  </div>
</template>
<script>
import Vue from 'vue'
import { config } from "@/utils";
import { setCookie, getCookie, delCookie } from "@/utils/cookie.js";
import {  Message } from 'element-ui';
import axios from 'axios'
const { api } = config;
import { templateDownloadPer,downloadStandards,downloadRegions } from "@/services/datablock.js";
export default {
  data() {
    return {
      fileList: [],
      headersObj: {
        Authorization: '' // headers塞token
      },
      actionUrl: ""
    };
  },
  created() {
    if (this.listData.listFlag === "person") {
      this.actionUrl = api.dataImport;
    } else if (this.listData.listFlag === "regional") {
      this.actionUrl = api.rImportExcel;
    } else if (this.listData.listFlag === "stand") {
      this.actionUrl = api.importExcel;
    }
    this.getLocalToken()
  },
  props: {
    listData: {
      type: Object,
      default: {}
    },
    callBackImport: {
      type: Function,
      default: function () {}
    }
  },
  methods: {
    beforeUpload(file){
      let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      if(!extension && !extension2){
        Message.error({
        title: "失败",
        message: '仅支持上传xls,xlsx文件'
      });
      return false
      }
    },
    getLocalToken() {
      let access_token = getCookie("access_token");
      this.headersObj.Authorization = `Bearer ${access_token}`
      return access_token;
    },
    add() {
      //新增
      if (this.listData.listFlag === "person") {
        this.$router.push("/personnelDiscountDetail");
      } else if (this.listData.listFlag === "regional") {
        this.$router.push("/regionalPriceDetail");
      } else if (this.listData.listFlag === "stand") {
        this.$router.push("/standardPriceDetail");
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.$refs.upload.clearFiles()
    },
    handleExceed(files, fileList) {
      this.$refs.upload.clearFiles()
      Message.error({
        title: "失败",
        message: `当前限制选择 1 个文件，本次共选择了 ${files.length + fileList.length} 个文件`
      });
    },
    error(){
      Message({
          message: '导入失败'
        })
      // loading.close()
    },
    success(res){
      // loading.close()
      if (res && res.code === 200) {
        Message.success({
          title: "成功",
          message: "导入成功",
        });
        this.$emit('callBackImport')
      } else {
        Message.error({
          title: "失败",
          message: `${res.msg}` || '导入失败',
        });
      }
      this.$refs.upload.clearFiles()
    },
    //导入
    template() {
      //模板下载
      if (this.listData.listFlag === "person") {
        templateDownloadPer().then(res => {
        window.location.href = res.data.url;
      });
      } else if (this.listData.listFlag === "regional") {
        downloadRegions().then(res => {
        window.location.href = res.data.url;
      });
      } else if (this.listData.listFlag === "stand") {
        downloadStandards().then(res => {
        window.location.href = res.data.url;
      });
      }
    },
  }
};
</script>
<style lang="scss">
.imp {
  width: 20rem;
  padding: 0 2%;
  display: flex;
  justify-content: space-between;
}
.textBtn {
  //模板下载
  border-bottom: 1px solid #409eff;
  color: #409eff;
  height: 30px;
  line-height: 40px;
  margin-left: 1rem;
  cursor: pointer;
}
.contentBtn .el-upload-list {
  display: none;
}
.addbtn {
  height: 40px;
  line-height: 20px;
}
</style>