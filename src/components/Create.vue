<script setup lang="ts">
import { Nodes, Edges, Layouts } from "v-network-graph"
import * as vNG from "v-network-graph"
import { reactive, ref, onMounted, onUnmounted, computed, watch } from "vue"
import { defineConfigs, VNetworkGraphInstance, EventHandlers } from "v-network-graph"
import { useStore } from "vuex";
import axios from "axios";
import { Input, Button } from 'flowbite-vue'
import { Notyf } from 'notyf';
import $ from 'jquery';
import a from "dom-to-image-more";
import data from "../../data2";

var loading = false;
const store = useStore();
store.state.sidebar = true;
//  To test the graph, we need to create some nodes and edges.
var nodes: Nodes = reactive({
  node1: { name: "node1", NodeCapacity: 3 },
  // node2: { name: "node2", NodeCapacity: 3 },
  // node3: { name: "node3", NodeCapacity: 3 },
  // node4: { name: "node4", NodeCapacity: 3 },
  // node5: { name: "node5", NodeCapacity: 3 },
  // node6: { name: "node6", NodeCapacity: 3 },
})

var edges: Edges = reactive({
  // edge2: { source: "node2", target: "node3", LinkCapacity: 5 },
  // edge3: { source: "node2", target: "node4", LinkCapacity: 5 },
  // edge1: { source: "node1", target: "node2", LinkCapacity: 5 },
  // edge4: { source: "node4", target: "node5", LinkCapacity: 5 },
  // edge5: { source: "node4", target: "node6", LinkCapacity: 5 },
})

const layouts: Layouts = {
  nodes: {
    node1: { x: 0, y: 0 },
    // node2: { x: 80, y: 80 },
    // node3: { x: 0, y: 160 },
    // node4: { x: 240, y: 80 },
    // node5: { x: 320, y: 0 },
    // node6: { x: 320, y: 160 },
  },
}
// const layouts = ref(data.layouts)
type TrafficData = Record<string, Record<string, number>>

const traffics = reactive<TrafficData>({
  node1: { node2: 0 },
  node2: { node1: 0, node3: 0, node4: 0 },
  node3: { node2: 0},
  node4: { node2: 0, node6: 0, node5: 0 },
  node5: { node4: 0},
  node6: { node4: 0, },
})

// define the traffic data
let timerId: any = null
onMounted(() => {
  // generate random numbers
  timerId = setInterval(() => {
    for (const t of Object.values(traffics)) {
      for (const key of Object.keys(t)) {
        t[key] = Math.round(Math.random() * 1000)
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
  }
})

//  ------------------------------
// ref="graph"
const graph = ref<vNG.Instance>()

// ref="tooltip"
const tooltip = ref<HTMLDivElement>()

const NODE_RADIUS = 16
const targetNodeId = ref<string>("")
const tooltipOpacity = ref(0) // 0 or 1
const tooltipPos = ref({ left: "0px", top: "0px" })

const targetNodePos = computed(() => {
  const nodePos = layouts.nodes[targetNodeId.value]
  return nodePos || { x: 0, y: 0 }
})

// Update `tooltipPos`
watch(
  () => [targetNodePos.value, tooltipOpacity.value],
  () => {
    if (!graph.value || !tooltip.value) return

    // translate coordinates: SVG -> DOM
    const domPoint = graph.value.translateFromSvgToDomCoordinates(targetNodePos.value)
    // calculates top-left position of the tooltip.
    tooltipPos.value = {
      left: domPoint.x - tooltip.value.offsetWidth / 2 + "px",
      top: domPoint.y - NODE_RADIUS - tooltip.value.offsetHeight - 10 + "px",
    }
  },
  { deep: true }
)

const eventHandlers: vNG.EventHandlers = {
  "node:pointerover": ({ node }) => {
    targetNodeId.value = node
    tooltipOpacity.value = 1 // show
  },
  "node:pointerout": _ => {
    tooltipOpacity.value = 0 // hide
  },
}
//  ------------------------------

const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

// take the selected nodes and edges
const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])


// set the configs
  const configs = reactive(
  defineConfigs({
    view: {
      boxSelectionEnabled: false,
      selection: {
        box: {
          color: "#0000ff20",
          strokeWidth: 1,
          strokeColor: "#aaaaff",
          strokeDasharray: "0",
        },
      },
    },
    node: {
      selectable: 2, // up to 2 nodes can be selected
      focusring: {
        color: "#64748b",
        width: 3,
        padding: 12,
      },
      label : {
        directionAutoAdjustment: true,
      }
    },
    edge: {
      selectable: true, // up to 2 edges can be selected
      normal: {
        width: 3,
        color: "#695CFE"
      },
    },
  })
)

// fuction to add nodes
function addNode() {
  if (store.state.maxdevices == Object.keys(nodes).length) 
    return
  console.log("add node")
  const nodeId = `node${nextNodeIndex.value}`
  const name = `SW${nextNodeIndex.value}`
  const NodeCapacity = 0
  nodes[nodeId] = { name, NodeCapacity }
  nextNodeIndex.value++
  console.log(nodes)
}
// add topo from file json
function addTopo(data) {
  nextEdgeIndex.value = 1
  nextNodeIndex.value = 1
  for (let i = 0; i < data.devices.length; i++) {
    console.log(data['devices'][i])
    const nodeID = data["devices"][i]["name"]
    const name = data["devices"][i]["name"]
    const NodeCapacity = data["devices"][i]["NodeCapacity"]
    nodes[nodeID] = { name, NodeCapacity }
    nextNodeIndex.value++
  }
  for (let i = 0; i < data.edges.length; i++) {
    const source = data["edges"][i]["source"]
    const target = data["edges"][i]["target"]
    const LinkCapacity = data["edges"][i]["LinkCapacity"]
    const edgeId = `edge${nextEdgeIndex.value}`
    edges[edgeId] = { source, target, LinkCapacity}
    nextEdgeIndex.value++
  }
}

// function to remove nodes
function removeNode() {
  for (const nodeId of selectedNodes.value) {
    delete nodes[nodeId]
    // remove the edges connected to the node
    for (const edgeId of Object.keys(edges)) {
      if (edges[edgeId].source === nodeId || edges[edgeId].target === nodeId) {
        delete edges[edgeId]
      }
    }
  }
}

// function to add edges
function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  const LinkCapacity = 0
  edges[edgeId] = { source, target, LinkCapacity }
  traffics[source] = { ...traffics[source], [target]: 0 }
  traffics[target] = { ...traffics[target], [source]: 0 }
  nextEdgeIndex.value++
}

// function to remove edges
function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete edges[edgeId]
  }
}

let toastclass = "initail"
let Vname = ""
let Vnid = 0
function create() {
  loading = true;
  $("#spinner").attr("class", "visible");
  // appel au backend 
  axios.post('http://localhost:8000/api/Createvn/', {
    devices: nodes,
    links: edges,
    name: Vname,
    Vnid: Vnid + 1,
  },)
  .then((response) => {
    loading = false;
    $("#spinner").attr("class", "invisible");
    console.log(response.data)
    if (response.data.Vn == "true") {
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
          message: 'Virtual Network added successfully',
          duration: 2000,
          dismissible: false
        });
        Vnid = Vnid + 1
    }
    else {
      const notyf = new Notyf({
          duration: 1000,
          position: {
            x: 'center',
            y: 'bottom',
          },
          types: [
            {
              type: 'warning',
              background: 'red',
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
          type: 'error',
          message: 'Virtual Network not added',
          duration: 2000,
          dismissible: false
        });
    }
      
    }
  )
  .catch((err) => console.log("error in post"))
  console.log(Vname)
}
// ref to fileInput
const fileInput = ref<HTMLInputElement | null>(null)
function handleFileUpload() {
  // read the json file
  const file = fileInput.value?.files?.[0]
  // const file = $("#file_input").files[0]
  console.log(file)
  if (!file) return
  const reader = new FileReader()
  // delete the old nodes and edges
  reader.onload = (event) => {
    var contents = event.target.result;
    const data = JSON.parse(contents as string)
    console.log(data)
    // clear the old nodes and edges
    for (const nodeId of Object.keys(nodes)) {
      delete nodes[nodeId]
    }
    for (const edgeId of Object.keys(edges)) {
      delete edges[edgeId]
    }
    // add the new nodes and edges
    addTopo(data)
    console.log(nodes)
    console.log(edges)
}
  reader.readAsText(file)
}

</script>
<template>
  <div class="container">
    <h1 class="title">Create a VN</h1>    
  <div class="configwithnetwork">
    <div class="demo-control-panel">
      <div style="margin-bottom: 3%;" class="bt">
        <label>Node:</label>

          <!-- 
              <button @click="addNode" class="button-40">
                Add
              </button> 
          -->
          <!-- 
              <button :disabled="selectedNodes.length == 0" @click="removeNode"  
              class="button-40">Remove</button> 
          -->
          <Button color="purple" style="margin-right: 2% ;" @click="addNode">Add</Button>
          <Button :disabled="selectedNodes.length == 0" @click="removeNode" color="red">Delete</Button>

      </div>
      <div class="bt">
        <label>Edge:</label>
        <!-- <button :disabled="selectedNodes.length != 2" @click="addEdge"
        class="button-40">Add</button
        >
        <button :disabled="selectedEdges.length == 0" @click="removeEdge"
          class="button-40">Remove</button
        > -->
        <Button :disabled="selectedNodes.length != 2" @click="addEdge" color="purple" style="margin-right: 2% ;">Add</Button>
          <Button :disabled="selectedEdges.length == 0" @click="removeEdge" color="red">Delete</Button>
      </div>
    </div>

    <div class="network">
      <v-network-graph
        v-model:selected-nodes="selectedNodes"
        v-model:selected-edges="selectedEdges"
        ref="graph"
        :nodes="nodes"
        :edges="edges"
        :layouts="layouts"
        :configs="configs"
        :event-handlers="eventHandlers"
      >
      <template #override-node="{ nodeId, scale, config, ...slotProps }">
              <!--
              The base position of the <image /> is top left. The node's
              center should be (0,0), so slide it by specifying x and y.
              -->
              <image
                  :x="-25"
                  :y="-25"
                  :width="50"
                  :height="50"
                  xlink:href="https://cdn-icons-png.flaticon.com/512/5761/5761095.png"
              />
        </template>
        <template #edge-label="{ edgeId, edge, scale, ...slotProps }">
          <v-edge-label
            :text="edge.LinkCapacity"
            align="center"
            vertical-align="above"
            v-bind="slotProps"
          />        
            <!-- <v-edge-label
              :text="`${traffics[edge.source][edge.target]} k`"
              align="source"
              vertical-align="above"
              v-bind="slotProps"
              fill="#ff5500"
              :font-size="12 * scale"
            />
            <v-edge-label
              :text="`${traffics[edge.target][edge.source]} k`"
              align="target"
              vertical-align="above"
              v-bind="slotProps"
              fill="#ff5500"
              :font-size="12 * scale"
            /> -->
        </template>

      </v-network-graph>
      <div
        ref="tooltip"
        class="tooltip"
        :style="{ ...tooltipPos, opacity: tooltipOpacity }"
      >
          <div>{{nodes[targetNodeId]?.name ?? "" }}</div>
          <div>{{ nodes[targetNodeId]?.NodeCapacity ?? "" }}</div>
      </div>
    </div>
  </div>
  
  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white " for="file_input">Or Upload JSON file</label>
  <input class="block w-1/2	 text-sm text-purple-900 border border-purple-300 rounded-lg cursor-pointer bg-purple-50 dark:text-purple-400 focus:outline-none dark:bg-purple-700 dark:border-purple-600 dark:placeholder-purple-400" id="file_input" type="file" ref="fileInput" @change="handleFileUpload" accept=".json,application/json">

  <form  id="linkform" >
  <div class="tables">


  <table class="styled-table">
    <thead>
      <tr>
        <th>EdgeID</th>
        <th>EdgeSource</th>
        <th>EdgeTarget</th>
        <th>LinkCapacity (Mbps)</th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr v-for="edgeId in selectedEdges" :key="edgeId">
        <td>{{ edges[edgeId].source }}</td>
        <td>{{ edges[edgeId].target }}</td>
        <td>
          <input type="text" />
        </td>
      </tr> -->

      <!-- @submit.prevent="create" -->
      
        <tr v-for="edgeID in edges" :key="edgeID.name">
          <td>{{  1}}</td>
          <td>{{ edgeID.source }}</td>
          <td>{{ edgeID.target }}</td>
          <td>
            <div class="form__group field">
              <!-- <input type="number" min="0" class="form__field" placeholder="LinkCapacity" :name='edgeID.source' :id='edgeID.source' required v-model="edgeID.LinkCapacity"/>
              <label for="name" class="form__label">Mbps</label> -->
              <input type="number" min="0" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="LinkCapacity" :name='edgeID.source' :id='edgeID.source' required v-model="edgeID.LinkCapacity">
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">MBps</label>
            </div>
          </td>
        </tr>

    </tbody>
  </table>
<!-- </form>
<form  id="linkform" > -->
  <table class="styled-table" >
    <thead>
      <tr>
        <th>NodeId</th>
        <th>NodeCapacity</th>
      </tr>     
    </thead>
    <tbody>
      <tr v-for="nodeID in nodes" :key="nodeID.name">
        <td>{{ nodeID.name }}</td>
        <td>
          <div class="form__group field">
            <!-- <input type="number" min="0"  class="form__field" placeholder="NodeCapacity" name="name" id='name' required v-model="nodeID.NodeCapacity"/>
            <label for="name" class="form__label">Cycle</label> -->
            <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="LinkCapacity" name="name" id='name' required v-model="nodeID.NodeCapacity">
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Core</label>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

</div>
<div class="VnNameField create">
  
  <!-- <div class="input-group">
        <input type="text" placeholder="Chose Vn Name" id="message" required v-model="Vname"/>
        
      </div> -->
      <Input id="message" type="text" size="lg" placeholder="enter your Vn Name" label="VN Name" v-model="Vname" required>
    <template #prefix>
      <!-- <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> -->
    </template>

    <template #suffix>
      
      <Button  @click.prevent="create">Create</Button>

    </template>

  </Input>



</div>

</form>
<div id="spinner" role="status" class="invisible">
    <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
    
</div>

<div class="create">
  <!-- <button @click="create" class="button-40">Create</button> -->
</div>

  </div>

</template>

<style scoped lang="css">
 /* @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@300&display=swap');
*{
  font-family: 'Dosis', sans-serif;
} */
/* Toast */
.title {
    /* font-family: "Poppins", sans-serif; */
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--dark-alt);
    margin-bottom: 1%;
    margin-top: 2%;
}
#snackbar {
  visibility: hidden; /* Hidden by default. Visible on click */
  min-width: 250px; /* Set a default minimum width */
  margin-left: -125px; /* Divide value of min-width by 2 */
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  left: 50%; /* Center the snackbar */
  bottom: 30px; /* 30px from the bottom */
}
table {
  text-align: center;
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
/* ToastEnd -------*/

.create{
  display: flex;
  flex-direction: columns;
  justify-content: center;
  width: 100%;
  margin-bottom: 1%;
}
.VnNameField{
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1%;
  width: 100%;
}
.demo-control-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.tables{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.bt {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1%;
  padding: 0%;
}
.box{
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  justify-content: center;
  height: max-content;
  width: 100vw;
  margin: 4% 0 0 0;
  padding: 0%;
}
.network {
  display: block;
  width: 100vh;
  height: 50vh;
  border: 5px solid #707070;
  border-radius: 0.5em;
  /* margin: 1% 0 0 0; */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 5px 5px;
  overflow: hidden;
  margin: 2%;
  position: relative;
}
.configwithnetwork{
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  height: max-content ;
  /* width: 100vw; */
  width: max-content;
  /* margin: 0%;
  padding: 0%; */
}

.button-40 {
  background-color: #695CFE;
  border: 1px solid transparent;
  border-radius: .75rem;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  flex: 0 0 auto;
  /* font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; */
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

.styled-table {
  border-collapse: collapse;
  margin: 5% 2% 1% 3%;
  font-size: 0.9em;
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

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}
.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #695CFE;
}

/* toolip style */
.tooltip {
  top: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  width: 80px;
  height: 50px;
  padding: 10px;
  text-align: center;
  font-size: 12px;
  background-color: #fff0bd;
  border: 1px solid #ffb950;
  box-shadow: 2px 2px 2px #aaa;
  transition: opacity 0.2s linear;
  pointer-events: none;
}
/* Text input style */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: max-content;

  padding: 0%;
  height: max-content;
}
.input-group {
	position: relative;
}
.input-group input {
	display: block;
	padding: 10px;
	border: none;
	outline: none;
	border-radius: 4px;
  border-color: #1e293b;
  border: 1px solid #1e293b;
	font: inherit;
}
.input-group input::placeholder {
	transition: opacity 0.25s;
}
.input-group input:focus::placeholder {
	opacity: 0;
}
.input-group label {
	position: absolute;
	top: -30px;
	left: -26px;
	line-height: 16px;
	color: #fff;
	display: inline-flex;
	column-gap: 10px;
	transition: transform 0.25s, opacity 0.25s;
}
.input-group label::before {
	content: url('../src/assets/vue.svg'); 
	opacity: 0;
}
.input-group:focus-within label,
.input-group input:valid ~ label {
	transform: translateX(26px);
}
.input-group:focus-within label::before,
.input-group input:valid ~ label::before {
	opacity: 1;
	transition-delay: 0.1s;
}
</style>





