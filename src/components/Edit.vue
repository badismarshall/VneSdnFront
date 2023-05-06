<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import HelloWorld from './HelloWorld.vue';
import VirtualGraph from './VirtualGraph.vue';
import axios from 'axios';
import { reactive } from 'vue';
import { useStore } from "vuex";

const store = useStore();
store.state.sidebar = true;
let VirtualNetworks = reactive([])
axios.get('http://localhost:8000/api/virtualNetworks/')
      .then((response) => {
        let vns = JSON.stringify(response.data)
        vns = JSON.parse(vns)
        addVns(vns['virtualnetworks'])
      })
      .catch((error) => console.log(error));

function addVns(vns){
  VirtualNetworks.push(...vns)
}
const selectedVn = ref(0)

function visualize(){
  console.log(selectedVn.value)
}
watch(selectedVn, (val) => {
  console.log('selectedVn changed to: ', val)
})

function recivedData(data){
  console.log("in the parent")
  console.log(data)
}
</script>
<template>
  <div class="container">
    <h1 class="title">Vn Topo</h1>
    <!-- <div class="controle"> -->
      <!-- <select class="select  form-select" aria-label="Default select example" v-model="selectedVn">
        <option selected value="0">Chose a VN</option>
        <option v-for="Vn in VirtualNetworks" :value="Vn.id">{{Vn.name}}</option>
      </select> -->
      <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Vn</label>
      <select v-model="selectedVn" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected value="0">Chose a VN</option>
        <option v-for="Vn in VirtualNetworks" :value="Vn.id">{{Vn.name}}</option>
        <!-- <option selected>Choose a country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option> -->
      </select>
      <!-- <button @click="visualize" class="button-40">Visualize</button> -->
  <!-- </div> -->
    <div class="first"> 
        <HelloWorld class="networkx" :vnid="selectedVn"/>
        <VirtualGraph class="networkx" :vnid="selectedVn" @selctevent="recivedData"/>
    </div>
    
  </div>
</template>

<style scoped>
.select{
  background-color: #1e293b;
  padding: 10px;
  color: #fff;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 15%;
  margin: 0 0 0 3%;
  height: 60px;
}
.title {
    /* font-family: "Poppins", sans-serif; */
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--dark-alt);
    margin-bottom: 1%;
    margin-top: 2%;
}

h1 {
  text-align: center;
  margin: 2%;
  padding: 0%;
  left: 0%;
}
/* ------------------------------ */
.controle {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0%;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* width: 100vw; */
  width: 100%;
  margin: 2% 1% 5% 4%;
  padding: 0%;
  /* height: max-content; */
}
.first {
  display: flex;
  margin: 1%;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0% 0 0 0;
  padding: 2%;
  height: 90vw;
}
.all {
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  justify-content: center;
  width: 100vw; 
  margin: 4% 1% 5% 4%;
  padding: 0%;

}

.networkx {
  display: block;
  width: 50%;
  height: 26%;
  border: 5px solid #6B7280;
  border-radius: 0.5em;
  margin: 1% 0 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 5px 5px;
  overflow: hidden;
  margin: 0% 1%;
}

.button-40 {
  background-color: #22c55e;
  border: 1px solid transparent;
  border-radius: .75rem;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  flex: 0 0 auto;
  font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5rem;
  padding: .75rem 1.2rem;
  text-align: center;
  text-decoration: none #6B7280 solid;
  text-decoration-thickness: auto;
  transition-duration: .2s;
  transition-property: background-color,border-color,color,fill,stroke;
  transition-timing-function: cubic-bezier(.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  margin: 1%;
}

.button-40:hover {
  background-color: #374151;
}

.button-40:focus {
  box-shadow: none;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

@media (min-width: 768px) {
  .button-40 {
    padding: .6rem .6rem;
  }
}
</style>
