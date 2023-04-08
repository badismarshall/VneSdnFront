<script setup lang="ts">
// get the list of vns from the backend
import axios from 'axios';
import { reactive } from 'vue';

// let VirtualNetworks = reactive([{id: 1, name: "test", created_at: "2021-06-01", updated_at: "2021-06-01"}])
let VirtualNetworks = reactive([])
axios.get('http://localhost:8000/api/virtualNetworks/')
      .then((response) => {
        let vns = JSON.stringify(response.data)
        vns = JSON.parse(vns)
        addVns(vns['virtualnetworks'])
        // VirtualNetworks = vns['virtualnetworks']
        // console.log(VirtualNetworks)
      })
      .catch((error) => console.log(error));

function addVns(vns){
  VirtualNetworks.push(...vns)
}
function deleteVn(id){
  console.log(id)
  // TODO: delete the vn from the database

  axios.get('http://localhost:8000/api/Deletevn/' + id)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => console.log(error));
}

console.log(VirtualNetworks)
</script>

<template>
  <div class="container">
    <h1>List of Vns</h1>
    <table class="styled-table">
      <thead>
        <tr>
          <th>virtualNetworkId</th>
          <th>virtualNetworkName</th>
          <th>CreationDate</th>
          <th>UpdatedDate</th> 
          <th>MaxBandwith</th>
          <th>NumberOfNodes</th>   
          <th>NumberofLinks</th>   
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="Vn in VirtualNetworks">
            <td>{{ Vn.id }}</td>
            <td>{{Vn.name}}</td>
            <td>{{ Vn.created_at }}</td>
            <td>{{ Vn.updated_at }}</td>
            <td>1000</td>
            <td>3</td>
            <td>2</td>
            <td><button @click="deleteVn(Vn.id)" class="button-40" :id="Vn.id">Delete</button></td>
          </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped lang="scss">
h1 {
  text-align: center;
  margin: 2%;
  padding: 0%;
  left: 0%;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2%;
  padding: 0%;
}

.bloc {
	display: flex;
  flex-direction: row;
  justify-content: start;
	main {
		flex: 1 1 0;
		padding: 2rem;
		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}

.styled-table {
  border-collapse: collapse;
  margin: 5% 2% 1% 3%;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
.styled-table thead tr {
  background-color: #1e293b;
  color: #ffffff;
  text-align: left;
  font-weight: bold;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}
.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #22c55e;
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