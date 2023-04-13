<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue"
import * as vNG from "v-network-graph"
import data from "../../data2";
import { useStore } from "vuex";
import axios from "axios";

import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import { generateCodeFrame } from "@vue/shared";
const props = defineProps<{
  vnid: Number
}>()

let CurentVnId = props.vnid
// watch the vnid and update the graph
watch(() => props.vnid, (newVnid) => {
  if (newVnid == 0) return
  console.log("newVnid", newVnid)
  CurentVnId = newVnid
  // console.log("CurentVnId", CurentVnId)
  // update the graph
  // update Nodes
  updateNodesandEdges(newVnid)
  // update Edges

})
function updateNodesandEdges(Vnid){
  console.log("updateNodes")
  nodes = reactive({})
  edges = reactive({})
  axios.get('http://localhost:8000/api/Getvn/' + Vnid).then((response) => {
    let vn = JSON.stringify(response.data)
    vn = JSON.parse(vn)
    let tempNodes = vn['logicalnodes']
    let tempEdges = vn['logicallinks']
    for (let i = 0; i < tempNodes.length; i++) {
      const node = tempNodes[i];
      addNode(node)
    }
    // console.log("nodes", nodes)
    for (let i = 0; i < tempEdges.length; i++) {
      const edge = tempEdges[i];
      addEdge(edge)
    }
    // console.log("edges", edges)
    emitVn("selctevent", vn)
})
}

const emitVn = defineEmits<{
  (event: "selctevent", payload: {}): void
}>()

function addNode(node) {
  const nodeId = `node${node['id']}`
  const name = node['name']
  const NodeCapacity = node['capacity']
  nodes[nodeId] = { name, NodeCapacity }
}

function addEdge(edge) {
  const edgeId = edge['id']
  const source = `node${edge['source_logical_node']}`
  const target = `node${edge['target_logical_node']}`
  const linkCapacity = edge['bandwidth']
  edges[edgeId] = { source, target, linkCapacity }
}

const NODE_COUNT = 20

let nodes = reactive({})
let edges = reactive({})
// var nodes = reactive(data.nodes)
// var edges = data.edges
// var layouts = ref(reactive({
//   nodes: {},
// }))
// var layouts = reactive({})
const layouts = ref(data.layouts)

// ref="graph"
const graph = ref<vNG.Instance>()
// ref="tooltip"
const tooltip = ref<HTMLDivElement>()

const NODE_RADIUS = 16
const targetNodeId = ref<string>("")
const tooltipOpacity = ref(0) // 0 or 1
const tooltipPos = ref({ left: "0px", top: "0px"})

const targetNodePos = computed(() => {
  const nodePos = layouts.value.nodes[targetNodeId.value]
  return nodePos || { x: 0, y: 0 }
})


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

// The fixed position of the node can be specified.
// const layouts = ref({
//   nodes: {
//     node0: {
//       x: 0,
//       y: 0,
//       fixed: true, // Unaffected by force
//     },
//   },
// })

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
            .force("edge", forceLink.distance(150))
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide(50).strength(0.2))
            .force("center", d3.forceCenter().strength(0.05))
            .alphaMin(0.001)
        }
      }),
    },
    node: {
      normal: {
        color: n => (n.id === "node0" ? "#ff0000" : "#4466cc"),
      },
      label: {
        visible: false,
      },
    },
    edge:{
        label:{
            color: "#e32d2d",
        }
    }
  })
)
//  to emit events to the parent component
// const emit = defineEmits<{
//   (event: "hovred", payload: { node: string }): void
// }>()

const store = useStore();

const eventHandlers: vNG.EventHandlers = {
  "node:pointerover": ({ node }) => {
    targetNodeId.value = node
    tooltipOpacity.value = 1 // show
    // emit("hovred", { node: node })
    // console.log("hovred", node)
    // change the name of the node in the store
    store.state.name = 'node4'
    console.log(store.state.name)
  },
  "node:pointerout": _ => {
    tooltipOpacity.value = 0 // hide
    store.state.name = ''
    console.log(store.state.name)
  },

}

const name = computed(() => store.state.name);
console.log(store.state.name)


</script>

<template>
<!-- <div class="tooltip-wrapper"> -->
  <v-network-graph
    :nodes="nodes"
    :edges="edges"
    v-model:layouts="layouts"
    :configs="configs"
    :event-handlers="eventHandlers"
    :zoom-level="0.7"
    >
        <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps"/>
        </template>
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
    <!-- <div
      ref="tooltip"
      class="tooltip"
      :style="{ ...tooltipPos, opacity: tooltipOpacity }"
    >
      <div>{{ data.nodes[targetNodeId]?.name ?? "" }}</div>
    </div> -->

<!-- </div> -->
</template>

<style scoped>

/* 
.tooltip {
  top: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  width: 50px;
  height: 20px;
  padding: 10px;
  text-align: center;
  font-size: 12px;
  background-color: #fff0bd;
  border: 1px solid #ffb950;
  box-shadow: 2px 2px 2px #aaa;
  transition: opacity 0.2s linear;
  pointer-events: none;
}
.tooltip-wrapper {
  position: relative;
} */

</style>