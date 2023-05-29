<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted,defineComponent } from "vue"
import * as vNG from "v-network-graph"
import data from "../../data";
import { useStore } from "vuex";
import axios from 'axios';
import VueAxios from 'vue-axios';

import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import { remove } from "@vue/shared";
const store = useStore();
const paths = ref<vNG.Paths>({})

// get the nodes topology from the backend
// setInterval(() =>{
//   axios.get('http://localhost:8000/api/devices/')
//       .then((response) => {
//         let devices = JSON.stringify(response.data)
//         devices = JSON.parse(devices)
//         if (nodes != devices["devices"]){
//           console.log("topoChanged")
//         }                  
//         devices['devices'].forEach((device) => {
//           addNode(device);
//         })
        
//         console.log(devices)
//       })
//       .catch((error) => console.log(error));

// }, 5000);

axios.get('http://localhost:8000/api/devices/')
      .then((response) => {
        let devices = JSON.stringify(response.data)
        devices = JSON.parse(devices)                  
        devices['devices'].forEach((device) => {
          addNode(device);
        })
      })
      .catch((error) => console.log(error));

// get the links topology from the backend
let FirstPool = true
let lastLinks = []
const changedElements = [];
const changedIndices = [];

const props = defineProps<{
  vnid: Number,
  link : Object
}>()

//  watch the vnid and update the graph
watch(() => props.vnid, (newVnid) => {
  // if (newVnid == 0) return
  // if (Edgechangedcolor.length > 0){
  //   Edgechangedcolor.forEach((link) => {
  //     edges[link].color = "#4466cc"
  //   })
  // }
  // axios.get("http://localhost:8000/api/Getvn/" + newVnid)
  //   .then((response) => {
  //     let vn = JSON.stringify(response.data)
  //     vn = JSON.parse(vn)
  //     let tempNodes = vn['logicalnodes']
  //     let tempEdges = vn['logicallinks']

  //     // for (let i = 0; i < tempNodes.length; i++) {
  //     //   const node = tempNodes[i];
  //     //   nodes[node['substrate_node']] = node
  //     // }

  //     for (let i = 0; i < tempEdges.length; i++) {
  //       const edge = tempEdges[i]
  //       changeEdgeColor(edge)
       
  //     }
  //   })
  

})

// watch store.state.link
watch(() => store.state.link, (newLink) => {
  if (props.vnid == 0) return
  if (Edgechangedcolor.length > 0){
    Edgechangedcolor.forEach((link) => {
      edges[link].color = "#4466cc"
    })
  }
  axios.get("http://localhost:8000/api/Getvn/" + props.vnid)
    .then((response) => {
      let vn = JSON.stringify(response.data)
      vn = JSON.parse(vn)
      let tempNodes = vn['logicalnodes']
      let tempEdges = vn['logicallinks']

      // for (let i = 0; i < tempNodes.length; i++) {
      //   const node = tempNodes[i];
      //   nodes[node['substrate_node']] = node
      // }

      for (let i = 0; i < tempEdges.length; i++) {
        if(tempEdges[i]['source_logical_node'] == newLink['source'] && tempEdges[i]['target_logical_node'] == newLink['target']){
          console.log("edgeeeeeeeeeeeeeeeee", tempEdges[i])
        const edge = tempEdges[i]
        changeEdgeColor(edge)
        }

      }
    })
    console.log("newLinkkkkk", newLink)
})



function changeEdgeColor(edge){
  console.log("edge", edge['substrate_links'])
  for (let i = 0; i < edge['substrate_links'].length; i++){
    axios.get("http://localhost:8000/api/Getsubstratelinksbyid/" + edge['substrate_links'][i]).then((response) => {
      let sublink = JSON.stringify(response.data)
      sublink = JSON.parse(sublink)
      console.log(sublink)

      let sourcesubID = sublink["substratelinks"]['source_substrate_node']
      let targetsubID = sublink["substratelinks"]['target_substrate_node']
      // edges[`edge${sublink['id']}`].color = "green"
      console.log(sourcesubID, targetsubID)
      Getsubstratenodebyid(sourcesubID, targetsubID)   
    })
    // edges[`edge${sublink}`].color = "green"
  }
}

function Getsubstratenodebyid(sourceId, targetID){
  axios.get("http://localhost:8000/api/Getsubstratenodesbyid/" + sourceId)
      .then((response) => {
        let nodeS = JSON.stringify(response.data)
        nodeS = JSON.parse(nodeS)
        console.log(nodeS)
        let source = nodeS["substratenodes"]['name']
        axios.get('http://localhost:8000/api/Getsubstratenodesbyid/'+ targetID).then((response) => {
          let nodeT = JSON.stringify(response.data)
          nodeT = JSON.parse(nodeT)
          console.log(nodeT)
          let target = nodeT["substratenodes"]['name']
          console.log("source", source, "target", target)

          findedge(source, target)
        })       
      })
      .catch((error) => console.log(error));
}

function findedge(source, target){
  for (let link in edges){
        // console.log("source", source, "target", target)
        if ((edges[link].source == source && edges[link].target == target) 
          || 
          (edges[link].source == target && edges[link].target == source)){
            console.log("dadadadadadadada")
            changecolorofedge(link)    
        }
      }
}

let Edgechangedcolor = reactive([])
function changecolorofedge(link){
  Edgechangedcolor.push(link)
  edges[link].color = "purple"
}
const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
}

axios.get('http://localhost:8000/api/topo/')
      .then((response) => {
        let links = JSON.stringify(response.data)
        links = JSON.parse(links)
        links['links'].forEach((link) => {
          addEdge(link);
        })
        lastLinks = links['links']
      })
      .catch((error) => console.log(error));

// setInterval(() => {
//   axios.get('http://localhost:8000/api/topo/')
//       .then((response) => {
//         let links = JSON.stringify(response.data)
//         links = JSON.parse(links)

//         if (FirstPool == true){
//             lastLinks = links['links']
//             FirstPool = false
//             links['links'].forEach((link) => {
//               addEdge(link);
//         })
//         }
//         if(!equalsCheck(lastLinks, links['links'])){
//           if (links['links'].length > lastLinks.length){

//             for (let link of links['links']){
//               let a = false
//               for (let lastLink of lastLinks){
//                 if (link['source'] == lastLink['source'] && link['target'] == lastLink['target']){
//                   a = true
//                   break
//                 }
//               }
//               if (a == false){ 
//                 // add link
//                 addEdge(link)
//                 break
//               }
//             }
//           }
//           else{
//             for (let lastLink of lastLinks){
//               let b = false
//               for (let link of links['links']){
//                 if (link['source'] == lastLink['source'] && link['target'] == lastLink['target']){
//                   b = true
//                   break
//                 }
//               }
//               if (b == false){
//                 // delete link
//                 removeEdge(lastLink)
//                 break
//               }
//             }
//           }
//           links['links'].forEach((link, i) => {
//             if(!equalsCheck(lastLinks[i], link)){
              
//               // changedElements.push(link);
//               // changedIndices.push(i);
//             }
//           })
//         }
//         // console.log(links['links'])
//         // console.log(lastLinks)

//         lastLinks = links['links']
//       })
//       .catch((error) => console.log(error));
// }, 5000)

let metrics = []



// edges[edge].bandwidth = (data['statistics'][statistics]['delta']['bytesReceived'] + data['statistics'][statistics]['delta']['bytesSent']) * 8 / 1000

setInterval(()=>{
  axios.get('http://localhost:8000/api/statistics/').then((response) => {
    let data = JSON.stringify(response.data)
    data = JSON.parse(data)
    // console.log(data['statistics'][0])
    for(let edge in edges){
      for (let x = 0; x < data['statistics'].length; x++){
        if (edges[edge].source == data['statistics'][x]['device']){
          // console.log(data['statistics'][x]['ports'][edges[edge].port - 1]['bytesSent'])
          if(data['statistics'][x]['ports'][edges[edge].port - 1]['bytesSent'] > 700){
            edges[edge].color = 'red'
          }
          else{
            if(edges[edge].color == 'red')
              edges[edge].color = "#4466cc"
          }
          break
        }
      }
    }
  })}, 2000)

let nodes = reactive({})
const edges = reactive({})

const layouts = data.layouts
const nextNodeIndex = ref(0)
const nextEdgeIndex = ref(0)
const selectedEdges = ref<string[]>([])

// fuction to add nodes
function addNode(node) {
  console.log("add node")
  // const nodeId = `node${nextNodeIndex.value}`
  const nodeId = node["id"]
  // const name = `SW${nextNodeIndex.value}`
  const name = `SW${node['chid']}`
  const selected = false
  // const name = node
  const NodeCapacity = 3
  nodes[nodeId] = { name, NodeCapacity }
  nextNodeIndex.value++
  store.state.maxdevices = nextNodeIndex.value 
  // console.log(nodes)
}

// function to add edges
function addEdge(link) {
  // to add edges only once
  for (let x in edges){
    if (edges[x].source == link['target'] && edges[x].target == link['source']){
      return
    }
  }

  const source = link['source']
  const target = link['target']
  const port = link['port']
  const color = "#4466cc"

  const edgeId = `edge${nextEdgeIndex.value}`
  let LinkCapacity = ref(11)
  // axios.get('http://localhost:8000/api/Getsubstratelinksbyname/' + source + "-" + target).then((response) => {
  //   let links = JSON.stringify(response.data)
  //   links = JSON.parse(links)
  //   // console.log(links['substratelinks']['bandwidth'])
  //   LinkCapacity = links['substratelinks']['bandwidth']  
  //   addlinkcapacity(LinkCapacity, link)
  //   // edges[edgeId] = { source, target, LinkCapacity, port, color }
  // }
  // )
  console.log(LinkCapacity);
  
  edges[edgeId] = { source, target, LinkCapacity, port, color }
  // traffics[source] = { ...traffics[source], [target]: 0 }
  // traffics[target] = { ...traffics[target], [source]: 0 }
  nextEdgeIndex.value++
}

function addlinkcapacity(LinkCapacity, link){
  const source = link['source']
  const target = link['target']
  const port = link['port']
  const color = "#4466cc"
  const linkCapacity = LinkCapacity
  const edgeId = `edge${nextEdgeIndex.value}`
  edges[edgeId] = { source, target, linkCapacity, port, color }
  nextEdgeIndex.value++
}

function removeEdge(link) {
  for (let x in edges){
    if (edges[x].source == link['source'] && edges[x].target == link['target']){
      delete edges[x]
      return
    }
  }
}

var selectedNodes = ref<string[]>([]) 

setTimeout(() => {
  console.log(edges)
}, 1000)
const configs = reactive(
  vNG.defineConfigs({
    view: {
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,
        // * The following are the default parameters for the simulation.
        // * You can customize it by uncommenting below.
        createSimulation: (d3, nodes, edges) => {
          const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
          return d3
            .forceSimulation(nodes)
            .force("edge", forceLink.distance(190))
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide(50).strength(0.2))
            .force("center", d3.forceCenter().strength(0.05))
            .alphaMin(0.001)
        }
      }),
    },
    node: {
      normal:{
        type: "circle",
        color: node => node.color
      },
      selectable: true,
      label: {
        visible: true,
        fontFamily: undefined,
        fontSize: 11,
        lineHeight: 1.1,
        color: "#000000",
        margin: 4,
        direction: "south",
        text: "name",
        directionAutoAdjustment: true,
      },
      focusring: {
        visible: true,
        color: "#000000",
        width: 2,
        dasharray: "0",
      },
    },
    edge: {
      normal: {
        color: edge => edge.color,
        animate: edge => (edge.color == '#4466cc' ? false : true),
        dasharray: edge => (edge.color == '#4466cc' ? 0 : 0),  
      },
      label : {
            color: "#e32d2d",
            fontFamily: "Poppins",
      },
      selectable: 1,
      selected: {
        color: "#695CFE",
        width: 2,
        dasharray: "9",
      },  
    }
  })
)

// buildNetwork(NODE_COUNT, nodes, edges)

function buildNetwork(count: number, nodes: vNG.Nodes, edges: vNG.Edges) {
  const idNums = [...Array(count)].map((_, i) => i)

  // nodes
  const newNodes = idNums.map(id => [`node${id}`, { id: `node${id}` }])
  Object.assign(nodes, Object.fromEntries(newNodes))

  // edges
  const makeEdgeEntry = (id1: number, id2: number) => {
    return [`edge${id1}-${id2}`, { source: `node${id1}`, target: `node${id2}` }]
  }
  const newEdges = []
  for (let i = 1; i < count; i++) {
    newEdges.push(makeEdgeEntry(Math.floor(i / 4), i))
  }
  Object.assign(edges, Object.fromEntries(newEdges))
}

// function addNode() {
//   const id = `node${NODE_COUNT}`
//   nodes[id] = { id }
//   edges[`edge${NODE_COUNT - 1}-${NODE_COUNT}`] = {
//     source: `node${NODE_COUNT - 1}`,
//     target: `node${NODE_COUNT}`,
//   }

// function removeNode() {
//   const id = `node${NODE_COUNT - 1}`
//   delete nodes[id]
//   delete edges[`edge${NODE_COUNT - 2}-${NODE_COUNT - 1}`]


// defineprops
// const propos = defineProps({
//   node: String,
// })

// if(props.node ){
//   nodes.props.node.color = "#db1fa0"
// }

// console.log(propos.node)
// const eventHandlers: vNG.EventHandlers = {
//   "node:click": ({ node }) => {
//     // toggle
//     nodes[node].color = "#0ee6e2"
//   },
// }
const name = computed(() => store.state.name)


console.log(store.state.maxdevices)

// watch(name, (newname, oldname)=>{
//   console.log("watcher")
//   if(name  == ref("")){

//   }
//   else{
//     // nodes[name].color = '#0ee6e2'
//   }
// });

</script>



<template>
  
  <v-network-graph
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
    :zoom-level="0.7"
  >
          <!-- <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label :text="edge.LinkCapacity" align="center" vertical-align="above" v-bind="slotProps"/>
        </template> -->
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

  </v-network-graph>

</template>

<style>

</style>