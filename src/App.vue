<script setup>
import { ref } from 'vue';
import data from '../data';
import HelloWorld from './components/HelloWorld.vue';
import VirtualGraph from './components/VirtualGraph.vue';
import Ceeate from './components/Create.vue';
import Edit from './components/Edit.vue';
import Delete from './components/Delete.vue';

import Sidebar from './components/Sidebar.vue';



</script>

<template>
  <sidebar/> 
<div class="bloc"> 
  <!-- <div class="viewbloc"> -->
    <div class="secondbloc">
      <router-view  />
    </div>
  <!-- </div>   -->
</div>
</template>

<style  lang="scss">
.viewbloc{
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
}
.secondbloc{
  display: flex;

  justify-content: center;
  width: 100%;
}
// .container {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   margin: 0%;
//   padding: 0%;
// }
.graph {
  width: 50%;
  height: 500px;
  border: 5px solid #5b41f2;
  border-radius: 0.5em;
  margin: 0 1% 0 0;

}

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
}
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;
}
body {
	background: var(--light);
}
button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}
.bloc {
	display: flex;
  flex-direction: row;
  justify-content: start;
  width: 100%;
	main {
		flex: 1 1 0;
		padding: 2rem;
		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}

</style>
