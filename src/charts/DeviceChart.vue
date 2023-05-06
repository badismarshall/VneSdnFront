<script setup>
import "@carbon/styles/css/styles.css";
import "@carbon/charts/styles.css";
import { GroupedBarChart, DonutChart } from "@carbon/charts";
import { onBeforeMount, onMounted } from "vue";
//  get data from the backend
import axios from "axios";
import { reactive, ref } from "vue";
import $ from 'jquery';
import { options } from "@carbon/charts/configuration";
import { svg } from "d3";
// import { Toast} from 'flowbite-vue';

const dataFromback = [];
var lenghtdata = 0;
// axios
//     .get("http://localhost:8000/api/Getflownumberofdevices/")
//     .then((response) => {
//         let nflow = JSON.stringify(response.data);
//         nflow = JSON.parse(nflow);
//         addflowNumbertoData(nflow["Nflow"]);
//     })
//     .catch((error) => console.log(error));

// function addflowNumbertoData(data) {
//     for (let i = 0; i < data.length; i++) {
//         dataFromback.push({
//             group: "Flow Number",
//             key: data[i]["deviceID"],
//             value: data[i]["flownumber"],
//         });
//     }
// }

// axios.get("http://localhost:8000/api/NumberoflogicalNodesMapped/").then((response) => {
//     let nlogicalnodes = JSON.stringify(response.data);
//     nlogicalnodes = JSON.parse(nlogicalnodes);
//     addlogicalnodeNumber(nlogicalnodes["NlogicalNodes"]);
// });

// function addlogicalnodeNumber(data) {
//     for (let i = 0; i < data.length; i++) {
//         dataFromback.push({
//             group: "Logical Nodes Number",
//             key: data[i]["deviceID"],
//             value: data[i]["logicalnodenumber"],
//         });
//     }
// }

// axios.get("http://localhost:8000/api/GetMeterNumberofDevices/").then((response) => {
//     let nmeter = JSON.stringify(response.data);
//     nmeter = JSON.parse(nmeter);
//     addmeterNumber(nmeter["Nmeters"]);
// });

// function addmeterNumber(data) {
//     for (let i = 0; i < data.length; i++) {
//         dataFromback.push({
//             group: "Meter Number",
//             key: data[i]["deviceID"],
//             value: data[i]["meternumber"],
//         });
//     }
//    lenghtdata = dataFromback.length;
//    console.log(lenghtdata);
// }


// console.log(dataFromback);
// console.log(typeof(dataFromback));

// const data = [
// 	{
// 		"group": "Dataset 1",
// 		"key": "Qty",
// 		"value": 65000
// 	},
// 	{
// 		"group": "Dataset 1",
// 		"key": "More",
// 		"value": -29123
// 	},
// 	{
// 		"group": "Dataset 1",
// 		"key": "Sold",
// 		"value": -35213
// 	},
// 	{
// 		"group": "Dataset 1",
// 		"key": "Restocking",
// 		"value": 51213
// 	},
// 	{
// 		"group": "Dataset 1",
// 		"key": "Misc",
// 		"value": 16932
// 	},
// 	{
// 		"group": "Dataset 2",
// 		"key": "Qty",
// 		"value": 32432
// 	},
// 	{
// 		"group": "Dataset 2",
// 		"key": "More",
// 		"value": -21312
// 	},
// 	{
// 		"group": "Dataset 2",
// 		"key": "Sold",
// 		"value": -56456
// 	},
// 	{
// 		"group": "Dataset 2",
// 		"key": "Restocking",
// 		"value": -21312
// 	},
// 	{
// 		"group": "Dataset 2",
// 		"key": "Misc",
// 		"value": 34234
// 	},
// 	{
// 		"group": "Dataset 3",
// 		"key": "Qty",
// 		"value": -12312
// 	},
// 	{
// 		"group": "Dataset 3",
// 		"key": "More",
// 		"value": 23232
// 	},
// 	{
// 		"group": "Dataset 3",
// 		"key": "Sold",
// 		"value": 34232
// 	},
// 	{
// 		"group": "Dataset 3",
// 		"key": "Restocking",
// 		"value": -12312
// 	},
// 	{
// 		"group": "Dataset 3",
// 		"key": "Misc",
// 		"value": -34234
// 	},
// 	{
// 		"group": "Dataset 4",
// 		"key": "Qty",
// 		"value": -32423
// 	},
// 	{
// 		"group": "Dataset 4",
// 		"key": "More",
// 		"value": 21313
// 	},
// 	{
// 		"group": "Dataset 4",
// 		"key": "Sold",
// 		"value": 64353
// 	},
// 	{
// 		"group": "Dataset 4",
// 		"key": "Restocking",
// 		"value": 24134
// 	},
// 	{
// 		"group": "Dataset 4",
// 		"key": "Misc",
// 		"value": 24134
// 	}
// ];
// console.log(data);
// console.log(typeof(data));
// console.log(data.length)


onMounted(() => {
const dataFromback = [];
var lenghtdata = 0;
const options = {
	"title": "Devices Info",
    // "color": {
    //     "scale": {
    //         "Flow Number": "#5A8FF9",
    //         "Logical Nodes Number": "#5AD8A6",
    //         "Meter Number": "#5D7092",
    //         "Device Number": "#F6BD16",
    //     }
    // },
	"axes": {
		"left": {
			"mapsTo": "value"
		},
		"bottom": {
			"scaleType": "labels",
			"mapsTo": "key"
		}
	},
	"height": "400px",
    theme: "g10",
    Animation: true
};
axios
    .get("http://localhost:8000/api/Getflownumberofdevices/")
    .then((response) => {
        let nflow = JSON.stringify(response.data);
        nflow = JSON.parse(nflow);
        addflowNumbertoData(nflow["Nflow"]);
    })
    .catch((error) => console.log(error));

function addflowNumbertoData(data) {
    for (let i = 0; i < data.length; i++) {
        dataFromback.push({
            group: "Flow Number",
            key: "device" + data[i]["deviceID"],
            value: data[i]["flownumber"],
        });
    }
}

axios.get("http://localhost:8000/api/NumberoflogicalNodesMapped/").then((response) => {
    let nlogicalnodes = JSON.stringify(response.data);
    nlogicalnodes = JSON.parse(nlogicalnodes);
    addlogicalnodeNumber(nlogicalnodes["NlogicalNodes"]);
});

function addlogicalnodeNumber(data) {
    for (let i = 0; i < data.length; i++) {
        dataFromback.push({
            group: "Logical Nodes Number",
            key: "device" + data[i]["deviceID"],
            value: data[i]["logicalnodenumber"],
        });
    }
}

axios.get("http://localhost:8000/api/GetMeterNumberofDevices/").then((response) => {
    let nmeter = JSON.stringify(response.data);
    nmeter = JSON.parse(nmeter);
    addmeterNumber(nmeter["Nmeters"]);
});

function addmeterNumber(data) {
    for (let i = 0; i < data.length; i++) {
        dataFromback.push({
            group: "Meter Number",
            key: "device" + data[i]["deviceID"],
            value: data[i]["meternumber"],
        });
    }
   lenghtdata = dataFromback.length;
   console.log(lenghtdata);
   createDeviceInfoChart(dataFromback, options)
}

function createDeviceInfoChart(dataFromback, options) {
    console.log(dataFromback);
    const chartHolder = document.getElementById("chartdevice");
    // kill the old chart if it exists
    if (chartHolder.hasChildNodes()) {
        chartHolder.removeChild(chartHolder.childNodes[0]);
    }
    new GroupedBarChart(chartHolder, {
        data: dataFromback,
        options: options,  
    });
}

});

axios.get("http://localhost:8000/api/GetNetworkInfo/").then((response) => {
    let nstatus = JSON.stringify(response.data);
    nstatus = JSON.parse(nstatus);
    addnetworkdata(nstatus);
});

var vndata = []
const optionsdonuts = {
    "title": "Flows Number of Virtual Network",
	"resizable": true,
    "animations": true,
	"legend": {
		"alignment": "center"
	},
	"donut": {
		"center": {
			"label": "Flows"
		},
		"alignment": "center"
	},
	"height": "400px"
}
axios.get("http://localhost:8000/api/GetflowsNumberofvn/").then((response) => {
    let vnflows = JSON.stringify(response.data);
    vnflows = JSON.parse(vnflows);
    console.log({"vnflows":vnflows['flowsnumber']});
    addvnflow(vnflows['flowsnumber']);
});
function addvnflow(data){
    for (let i = 0; i < data.length; i++) {
        vndata.push({
            group: data[i]["virtualnetwork"],
            value: data[i]["flowsnumber"],
        });
    }
    console.log(vndata);
    createvnflowchart(vndata, optionsdonuts)
}

function createvnflowchart(vndata, optionsdonuts) {
    console.log(vndata);
    const DonutHolder = document.getElementById("vnflowsDonut");
    // kill the old chart if it exists
    if (DonutHolder.hasChildNodes()) {
        DonutHolder.removeChild(DonutHolder.childNodes[0]);
    }
    new DonutChart(DonutHolder, {
        data: vndata,
        options: optionsdonuts,  
    });
}
function addnetworkdata(nstatus){
    console.log(nstatus);
    $("#devices").text(nstatus["devices"]);
    $("#links").text(nstatus["links"]);
    $("#hosts").text(nstatus["hosts"]);
    $("#flows").text(nstatus["flows"]);
    $("#vns").text(nstatus["Vns"]);
}
</script>

<template>

<div>
 <!-- <Toast type="warning">
    Improve password difficulty.
  </Toast> -->
    <h1 class="title">Network Info</h1>
</div>
    <div class="networkInfo">
        <div class="deviceinfo">
            <span class="material-icons">
            router
            </span>
            <div class="middle">
                <div class="left">
                    <h5>Number of Devices</h5>
                </div>
                <div class="progress">
                    <svg>
                        <circle cx="37" cy="37" r="32"/>
                    </svg>
                    <h3 style="color: #695CFE;" id="devices"></h3>
                </div>
            </div>
        </div>
        <div class="linksinfo">
            <span class="material-icons">
                insights
            </span>
            <div class="left">
                    <h5>Number of Links</h5>
                    <div class="progress">
                        <svg>
                            <circle cx="37" cy="37" r="32" style="stroke: coral;"/>
                        </svg>
                        <h3 style="color: coral;" id="links"></h3>
                    </div>
            </div>


        </div>
        <div class="hostsinfo">
            <span class="material-icons">
            computer
            </span>
            <div class="left">
                    <h5>Number of Hosts</h5>
                <div class="progress">
                    <svg>
                        <circle cx="37" cy="37" r="32" style="stroke: #45f0b8;"/>
                    </svg>
                    <h3 style="color: #45f0b8;" id="hosts"></h3>
                </div>
            </div>

        </div>
        <div class="flowsinfo">
            <span class="material-icons">
            toc
            </span>
            <div class="left">
                    <h5>Number of Flows</h5>

                </div>
                <div class="progress">
                    <svg>
                        <circle cx="37" cy="37" r="32" style="stroke: #ef5296;"/>
                    </svg>
                    <h3 style="color:#ef5296;" id="flows"></h3>
                </div>

        </div>
        <div class="vninfo">
            <span class="material-icons">
                graphic_eq
            </span>
            <div class="left">
                    <h5>Number of Vns</h5>

                </div>
                <div class="progress">
                    <svg>
                        <circle cx="37" cy="37" r="32" style="stroke: #1fd35b;"/>
                    </svg>
                    <h3 style="color:#1fd35b;" id="vns"></h3>
                </div>

        </div>
    </div>
    <div class="charts-info">
        <div id="chartdevice" style="width: 100%; height: 100%; margin-bottom: 1%;"></div>
        <div id="vnflowsDonut" style="width: 100%; height: 100%;"></div>
    </div>
</template>
<style scoped>

#chartdevice {
    width: 100%;
    height: 100%;
}
.charts-info {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: white;
    margin-top: 30px;
    gap: 1px;
    color: #393a44;
}
.title {
    /* font-family: "Poppins", sans-serif; */
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--dark-alt);
    margin-bottom: 1%;
    margin-top: 2%;
}
.networkInfo .progress {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
}
.networkInfo svg {
    width: 7rem;
    height: 7rem;
    /* margin: 10px; */
    /* background: red; */
    /* position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg); */
}
.networkInfo svg circle{
    fill: none;
    stroke: #695CFE;
    stroke-width: 8;
    stroke-linecap: round;
    transform: translate(12px, 10px);
    stroke-dasharray: 35;
    stroke-dashoffset: 110;
}
.networkInfo .progress h3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* font-size: 2rem; */
    font-weight: 600;
    color: var(--dark-alt);
}
.middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.networkInfo {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: white;
    margin-top: 30px;
    gap: 1px;
    color: #393a44;
}
.networkInfo > div {
    margin: 1%;
    width: 200px;
    background: #f7f5f9;
    padding: 10px;
    /* border: 3px solid var(--dark-alt); */
    border-radius: 3px;
    box-shadow: 2px 2px 2px 2px #aaa;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.networkInfo > div:hover {
    box-shadow: none;
}
.networkInfo > div > span {
    background: #695CFE;
    padding: 0.5rem;
    border-radius: 50%;
    color: white;
    font-size: 1rem;
}

.networkInfo > div.linksinfo > span {
    background: coral;
}

.networkInfo > div.hostsinfo > span {
    background: #45f0b8;
}
.networkInfo > div.flowsinfo > span {
    background: #ef5296
;
}
.networkInfo > div.vninfo > span {
    background: #1fd35b
;
}
.networkInfo > h3 {
    font-size: 2px;
    /* font-weight: 400; */
    margin: 0;
    padding: 0;
}

</style>