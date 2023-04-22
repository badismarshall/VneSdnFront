<script setup>
// get the list of vns from the backend
import axios from 'axios';
import { reactive, onMounted, render, ref } from 'vue';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import $ from 'jquery';


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
const mymodel = ref(null)
function deleteVn(){
  let id = $("#exampleModal").find(".contentvn").attr('id')
  console.log(id)
  // TODO: delete the vn from the database

  // axios.get('http://localhost:8000/api/Deletevn/' + id)
  //     .then((response) => {
  //       console.log(response)
  //       // TODO: delete the vn from the table
  //       myTable.ajax.reload();
        
  //     })
  //     .catch((error) => console.log(error));
  // hide the modal
  // const mymodel = document.querySelector('#exampleModal')
    mymodel.value.hide()
  $("#exampleModal").modal('hide')

}
let selectedVn = reactive("das");
let myTable;
onMounted(() => {
    myTable = new DataTable('#myTable', {
    data: VirtualNetworks,
    ajax: {
      url: 'http://localhost:8000/api/virtualNetworks/',
      dataSrc: 'virtualnetworks'
    },
    columns: [
      { data: 'id' },
      { data: 'name' },
      { data: 'created_at' },
      { data: 'updated_at' },
      {defaultContent: "<td>1000</td "},
      {defaultContent: "<td>3</td "},
      {defaultContent: "<td>2</td "},
      // { data: 'maxBandwith' },
      // { data: 'numberOfNodes' },
      // { data: 'numberOfLinks' },
      // {defaultContent: '<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal id=' + this. + '">Delete</button>'},
      {
        data: 'name',
        render: function (data, type, row, meta) {
        return '<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" id=' + row.id + ' data-bs-whatever='+ data + '>Delete</button>'
      }}
    ],
    // columnDefs: [
    //   {
    //     target: 7,
    //     // defaultContent: "<button class='button-40'>Delete</button>"
    //     render: function (data, type, row, meta) {
    //       // return '<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal">Delete</button>';
    //       return '<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal id=' + row.id + '">Delete</button>'
    //     }
    //   }
    // ]
  });
  const exampleModal = document.querySelector('#exampleModal')

  exampleModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  const button = event.relatedTarget
  console.log(button.id)
  // Extract info from data-bs-* attributes
  const recipient = button.getAttribute('data-bs-whatever')
  $("#exampleModal").find(".contentvn").text("Are you sure you want to delete " + recipient + " Vn " +  " ?")
  $("#exampleModal").find(".contentvn").attr('id', button.id)
})
})






</script>

<template>
  <div class="container">
    <h1>List of Vns</h1>
    <table id="myTable" ref="myTable" class="display styled-table"> 
      <!-- class="styled-table"> -->
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
          <!-- <tr v-for="Vn in VirtualNetworks">
            <td>{{ Vn.id }}</td>
            <td>{{Vn.name}}</td>
            <td>{{ Vn.created_at }}</td>
            <td>{{ Vn.updated_at }}</td>
            <td>1000</td>
            <td>3</td> 
            <td>2</td>
            <td><button @click="deleteVn(Vn.id)" class="button-40" :id="Vn.id">Delete</button></td>
          </tr> -->
      </tbody>
    </table>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="mymodel">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Vn</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="contentvn"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button @click="deleteVn()" type="button" class="btn  btn-success" >Yes</button>
      </div>
    </div>
  </div>
</div>
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