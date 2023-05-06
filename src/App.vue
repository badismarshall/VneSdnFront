<script setup>
import { onMounted, ref } from 'vue';
import data from '../data';
import HelloWorld from './components/HelloWorld.vue';
import VirtualGraph from './components/VirtualGraph.vue';
import Ceeate from './components/Create.vue';
import Edit from './components/Edit.vue';
import Delete from './components/Delete.vue';
// import Sidebar from './components/Sidebar.vue';
import sidebar from './sidebar/sidebar.vue';
import login from './components/login.vue';
import { useStore } from "vuex";
const store = useStore();
onMounted(() => {

}) 
function shoudshowsidebar() {
    return store.state.sidebar;
}
</script>

<template>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
rel="stylesheet">
<!-- <sidebar /> -->
<!-- <login/>  -->
<router-view name="login"/>
<div class="bloc">
    <div class="secondbloc">
      <router-view v-slot="{Component}" >
        <sidebar v-if="shoudshowsidebar() "/>
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
</div>
</template>

<style  lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
}
// .viewbloc{
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   width: 100%;
// }
.secondbloc{
  display: flex;
  // margin-left: 1%;
  // margin-right: 1%;
  // padding-right: 4%;
  justify-content: flex-start;
  width: 100%;
 
}
// .container {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   margin: 0%;
//   padding: 0%;
// }

// .graph {
//   width: 50%;
//   height: 500px;
//   border: 5px solid #5b41f2;
//   border-radius: 0.5em;
//   margin: 0 1% 0 0;

// }

/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */

// side bar styles
:root {
	--primary: #4ade80;
	--primary-alt: #22c55e;
	--grey: #64748b;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 200px;
  font-family: poppins, sans-serif;
}

// body {
// 	background: var(--light);
//   font-family: 'Poppins', sans-serif;
// }
// button {
// 	cursor: pointer;
// 	appearance: none;
// 	border: none;
// 	outline: none;
// 	background: none;
// }
.bloc {
  font-family: poppins, sans-serif;
	display: flex;
  // margin-left: calc(3rem + 32px);
  // margin-right: calc(3rem + 32px);
  padding-right: 2%;
  // position: fixed;
  flex-direction: row;
  padding-left: 100px;
  // column-gap: 15px;
  justify-content: flex-start;
  width: 100%;
	// main {
	// 	flex: 1 1 0;
	// 	padding: 2rem;
	// 	@media (max-width: 1920px) {
	// 		padding-left: 6rem;
	// 	}
	// }
}
</style>
