// import Vue from 'vue'
// import Vuex from 'vuex'
// import * as types from './mutation-types'
// import createLogger from 'vuex/dist/logger'; // vuex调试工具

// import {
//   getMusicRankings
// } from '../services/datablock'


// Vue.use(Vuex)
// // 开发环境下开启严格模式
// const debug = process.env.NODE_ENV !== 'production';

// export default new Vuex.Store({
//   strict: debug,
//   plugins: debug ? [createLogger()] : [],

//   state: {
//     list: [],
//   },
//   mutations: {
//     [types.MUSIC_RANKINGS](state, payload) {
//       state.list = payload
//     }
//   },

//   actions: {
//     fetchMusicRankings({
//       commit
//     }, params) {
//       getMusicRankings()
//         .then(response => {
//           console.log(response, "=====response=====")
//           commit(types.MUSIC_RANKINGS, response.data.list)
//         })
//     },
//   },

//   modules: {}
// })
