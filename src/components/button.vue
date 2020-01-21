<template>
  <el-button
    type="primary"
    @click="openFullScreen1"
    v-loading.fullscreen.lock="fullscreenLoading">
  </el-button>
</template>
<script>
export default {
  data() {
      return {
        fullscreenLoading: false
      }
    },
  methods:{
    openFullScreen1() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
      },
  }
}
</script>