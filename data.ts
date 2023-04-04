import { Nodes, Edges, Layouts } from "v-network-graph"
import { reactive, ref } from "vue"
import * as vNG from "v-network-graph"

// const nodes: Nodes = {
//   node1: { name: "Node 1" },
//   node2: { name: "Node 2" },
//   node3: { name: "Node 3" },
//   node4: { name: "Node 4" },
//   node5: { name: "Node 5" },
//   node6: { name: "Node 6" },
//   node7: { name: "Node 7" },
//   node8: { name: "Node 8" },
//   node9: { name: "Node 9" },
//   node10: { name: "Node 10" },
// }
interface Node extends vNG.Node {
  size: number
  color: string
  label?: boolean
}
const nodes: Record<string, Node> = {
  node1: { name: "Node 1", size: 16, color: "gray" },
  node2: { name: "Node 2", size: 32, color: "hotpink", label: true },
  node3: { name: "Node 3", size: 24, color: "lightskyblue", label: true },
  node4: { name: "Node 4", size: 16, color: "gray" },
  node5: { name: "Node 5", size: 32, color: "hotpink", label: true },
}


// const edges: Edges = {
//   edge1: { source: "node1", target: "node2" },
//   edge2: { source: "node2", target: "node3" },
//   edge3: { source: "node3", target: "node4" },
//   edge4: { source: "node10", target: "node4" },
//   edge5: { source: "node6", target: "node3" },
//   edge6: { source: "node7", target: "node1" },
//   edge7: { source: "node2", target: "node8" },
//   edge8: { source: "node3", target: "node9" },
//   edge9: { source: "node9", target: "node1" },
//   edge10: { source: "node5", target: "node9" },
// }

interface Edge extends vNG.Edge {
  width: number
  color: string
  dashed?: boolean
}


const edges: Record<string, Edge> = {
  edge1: { source: "node1", target: "node2", width: 1, color: "black" },
  edge2: { source: "node2", target: "node3", width: 5, color: "gray", dashed: true },
  edge3: { source: "node3", target: "node4", width: 1, color: "black" },
  edge4: { source: "node3", target: "node4", width: 3, color: "skyblue" },
  edge5: { source: "node4", target: "node5", width: 3, color: "hotpink" },
  edge6: { source: "node4", target: "node5", width: 1, color: "black" },
  edge7: { source: "node4", target: "node5", width: 3, color: "skyblue" },
}

const layouts: Layouts = reactive({
  nodes: {},
})

export default {
  nodes,
  edges,
  layouts,
}