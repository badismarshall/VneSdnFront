
<template>
  <div class="container">
    <select class="select  form-select" aria-label="Default select example">
      <option selected>Chose a VN</option>
      <option value="1">OnosVn</option>
      <option value="2">CiscoVn</option>
      <option value="3">HuwaeiVN</option>
    </select>
    <div class="first"> 
        <HelloWorld class="networkx"/>
        <VirtualGraph class="networkx"/>
    </div>
    
   
  </div>
</template>

<style scoped>
.select{
  background-color: #1e293b;
  padding: 20px;
  color: #fff;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 20%;
  margin: 0 0 0 3%;
}

/* ------------------------------ */
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
  justify-content: end;
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
  /* border: 5px solid #5b41f2; */
  border: 5px solid #4ade80;
  border-radius: 0.5em;
  margin: 1% 0 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 5px 5px;
  overflow: hidden;
  margin: 0% 1%;
}
</style>
<script setup>
import { onMounted } from 'vue';
import HelloWorld from './HelloWorld.vue';
import VirtualGraph from './VirtualGraph.vue';

</script>