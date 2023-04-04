import { Nodes, Edges, Layouts } from "v-network-graph"
import { reactive } from "vue"

const nodes: Nodes = {
  node1: { name: "Node 1" },
  node2: { name: "Node 2" },
  node3: { name: "Node 3" },
  node4: { name: "Node 4" },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2", label: "1 Gbps"},
  edge2: { source: "node2", target: "node3", label: "100 Mbps"},
  edge3: { source: "node3", target: "node4", label: "10 Gbps"},
  edge4: { source: "node4", target: "node1", label: "7 Gbps"},
}

// const layouts: Layouts = reactive({
//   nodes: {},
// })

const layouts: Layouts = {
    nodes: {
      node1: { x: 0, y: 0 },
      node2: { x: 80, y: 80 },
      node3: { x: 160, y: 0 },
      node4: { x: 240, y: 80 },
    },
  }

export default {
  nodes,
  edges,
  layouts,
}