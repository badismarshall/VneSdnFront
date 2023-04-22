import { createApp, ref } from 'vue'
// import './style.css'
import App from './App.vue'
import VNetworkGrpah from 'v-network-graph'
import "v-network-graph/lib/style.css"
import store from './store/store'
import { createRouter, createWebHistory } from 'vue-router'
import Create from './components/Create.vue'
import Edit from './components/Edit.vue'
import Delete from './components/Delete.vue'
import Home from './components/Home.vue'
import chartsVue from "@carbon/charts-vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/create', name: "Create" ,component: Create },
        { path: '/edit', name: "Edit" ,component: Edit },
        { path: '/delete',name: "Delete" ,component: Delete },
        { path: '/', name: "Home", component: Home }
    ]
})

const app = createApp(App)
app.use(store)
app.use(chartsVue)
app.use(VNetworkGrpah)
app.use(router)
app.mount('#app')
