<script setup lang="ts">
import { Nodes, Edges, Layouts } from "v-network-graph"
import * as vNG from "v-network-graph"
import { reactive, ref, onMounted, onUnmounted, computed, watch } from "vue"
import { defineConfigs, VNetworkGraphInstance, EventHandlers } from "v-network-graph"
import { useStore } from "vuex";
import axios from "axios";

//  To test the graph, we need to create some nodes and edges.
const nodes: Nodes = reactive({
  node1: { name: "SW1", NodeCapacity: 3 },
  node2: { name: "SW2", NodeCapacity: 3 },
  node3: { name: "SW3", NodeCapacity: 3 },
  node4: { name: "SW4", NodeCapacity: 3 },
  node5: { name: "SW5", NodeCapacity: 3 },
  node6: { name: "SW6", NodeCapacity: 3 },
})

const edges: Edges = reactive({
  edge2: { source: "node2", target: "node3", LinkCapacity: 5 },
  edge3: { source: "node2", target: "node4", LinkCapacity: 5 },
  edge1: { source: "node1", target: "node2", LinkCapacity: 5 },
  edge4: { source: "node4", target: "node5", LinkCapacity: 5 },
  edge5: { source: "node4", target: "node6", LinkCapacity: 5 },
})

const layouts: Layouts = {
  nodes: {
    node1: { x: 0, y: 0 },
    node2: { x: 80, y: 80 },
    node3: { x: 0, y: 160 },
    node4: { x: 240, y: 80 },
    node5: { x: 320, y: 0 },
    node6: { x: 320, y: 160 },
  },
}

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
    },
    edge: {
      selectable: true, // up to 2 edges can be selected
      normal: {
        width: 3,
        color: "#22c55e"
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
function create() {
  // appel au backend 
  axios.post('http://localhost:8000/api/CreateVn', {
    devices: nodes,
    links: edges
  })
}

const store = useStore()
console.log(store.state.maxdevices)



</script>
<template>
  <div class="container">
  <div class="configwithnetwork">
    <div class="demo-control-panel">
      <div style="margin-bottom: 3%;" class="bt">
        <label>Node:</label>

          <button @click="addNode" class="button-40">Add</button>
          <button :disabled="selectedNodes.length == 0" @click="removeNode"
          
          class="button-40">Remove</button
          >

      </div>
      <div class="bt">
        <label>Edge:</label>
        <button :disabled="selectedNodes.length != 2" @click="addEdge"
        class="button-40">Add</button
        >
        <button :disabled="selectedEdges.length == 0" @click="removeEdge"
          class="button-40">Remove</button
        >
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
              <input type="number" min="0" class="form__field" placeholder="LinkCapacity" :name='edgeID.source' :id='edgeID.source' required v-model="edgeID.LinkCapacity"/>
              <label for="name" class="form__label">Mbps</label>
            </div>
          </td>
        </tr>

    </tbody>
  </table>
<!-- </form>
<form  id="linkform" > -->
  <table class="styled-table">
    <thead>
      <tr>
        <th>nodeId</th>
        <th>NodeCapacity</th>
      </tr>     
    </thead>
    <tbody>
      <tr v-for="nodeID in nodes" :key="nodeID.name">
        <td>{{ nodeID.name }}</td>
        <td>
          <div class="form__group field">
            <input type="number" min="0"  class="form__field" placeholder="NodeCapacity" name="name" id='name' required v-model="nodeID.NodeCapacity"/>
            <label for="name" class="form__label">Cycle</label>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

</div>
</form>
<div class="create">
  <button @click="create" class="button-40" type="submit" form="linkform">Create</button>
  <!-- <div ref="snackbar" id="snackbar" :class="toastclass" >Some text some message..</div> -->
</div>
  </div>
</template>

<style scoped lang="css">
 /* @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@300&display=swap');
*{
  font-family: 'Dosis', sans-serif;
} */
/* Toast */
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
  flex-direction: row;
  justify-content: center;
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
  border: 5px solid #22c55e;
  border-radius: 0.5em;
  margin: 1% 0 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 5px 5px;
  overflow: hidden;
  margin: 2%;
  position: relative;
}
.configwithnetwork{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: max-content ;
  /* width: 100vw; */
  width: max-content;
  margin: 0%;
  padding: 0%;
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
  /* width: 100vw; */
  width: max-content;
  margin: 1% 1% 1% 1%;
  padding: 0%;
  height: max-content;
}

</style>





