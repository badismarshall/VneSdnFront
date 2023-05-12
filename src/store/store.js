// import Vue from 'vue'
// import Vuex from 'vuex'

import { createStore } from 'vuex'
const store =  createStore({
    state: {
    name: '',
    maxdevices: 0,
    sidebar: false,
    link : Object,
    }
});

export default store

// Vue.use(Vuex)

// const store = new Vuex.Store({
//     state: {
//       count: 0,
//       name: 'badis',
//     },
//   })

// export default store