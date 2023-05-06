<script setup>
// get the list of vns from the backend
import axios from 'axios';
import { reactive, onMounted, render, ref } from 'vue';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import $ from 'jquery';
import { initFlowbite } from 'flowbite'
import { Toast } from 'flowbite-vue'
import { Notyf } from 'notyf';
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
const mymodel = ref(null)
function deleteVn(){
  let id = $("#exampleModal").find(".contentvn").attr('id')
  console.log(id)
  // TODO: delete the vn from the database

  axios.get('http://localhost:8000/api/Deletevn/' + id)
      .then((response) => {
        console.log(response)
        // TODO: delete the vn from the table
        myTable.ajax.reload();
        const notyf = new Notyf({
          duration: 1000,
          position: {
            x: 'right',
            y: 'bottom',
          },
          types: [
            {
              type: 'warning',
              background: 'orange',
              icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'warning'
              }
            },
            {
              type: 'error',
              background: 'indianred',
              duration: 2000,
              dismissible: true
            }
          ]
        });
        notyf.open({
          type: 'success',
          message: 'Virtual Network Deleted',
          duration: 2000,
          dismissible: false
        });
      })
      .catch((error) => {
        console.log(error)
        const notyf = new Notyf({
          duration: 1000,
          position: {
            x: 'right',
            y: 'bottom',
          },
          types: [
            {
              type: 'warning',
              background: 'orange',
              icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'warning'
              }
            },
            {
              type: 'error',
              background: 'indianred',
              duration: 2000,
              dismissible: true
            }
          ]
        });
        notyf.open({
          type: 'warning',
          message: 'Virtual Network Deleted',
          duration: 2000,
          dismissible: false
        });
      } 
      );
}
let selectedVn = reactive("das");
let myTable;
onMounted(() => {
  // initFlowbite();
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
        return '<button type="button" class=" px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600" data-bs-toggle="modal" data-bs-target="#exampleModal" id=' + row.id + ' data-bs-whatever='+ data + '>Delete</button>'
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
    <!-- <div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Check icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">Item moved successfully.</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
</div> -->
<div id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 fixed bottom-0 right-0 my-2 invisible" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Error icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">Item has been deleted.</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
</div>
    <h1 class="title">List of Vns</h1>
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
    <!-- Modal -->
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
        <button type="button" class="btn btn-secondary bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded" data-bs-dismiss="modal">Close</button>
        <button @click="deleteVn()" type="button" class="btn btn-success bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded" data-bs-dismiss="modal">Yes</button>
      </div>
    </div>
  </div>
</div>

  </div>

</template>

<style scoped lang="scss">
.title {
    /* font-family: "Poppins", sans-serif; */
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--dark-alt);
    margin-bottom: 1%;
    margin-top: 2%;
}
// center the content of the table
table {
  text-align: center;
}
h1 {
  text-align: center;
  margin: 2%;
  padding: 0%;
  left: 0%;
}
// .container {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin: 2%;
//   padding: 0%;
// }

// .bloc {
// 	display: flex;
//   flex-direction: row;
//   justify-content: flex-start;
// 	main {
// 		flex: 1 1 0;
// 		padding: 2rem;
// 		@media (max-width: 1024px) {
// 			padding-left: 6rem;
// 		}
// 	}
// }

.styled-table {
  border-collapse: collapse;
  // margin: 5% 2% 1% 3%;
  font-size: 0.9em;
  // font-family: "Poppins", sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 0 0;
  overflow: hidden;

}
.styled-table thead tr {
  background-color: #695CFE;
  color: #ffffff;
  text-align: left;
  font-weight: bold;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
  text-align: center;
  vertical-align: middle;
}
.styled-table tbody tr td {
  text-align: center;
  vertical-align: middle;
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
  // font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
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