<script setup>
import "@carbon/styles/css/styles.css";
import "@carbon/charts/styles.css";
import { GroupedBarChart } from "@carbon/charts";
import { onBeforeMount, onMounted } from "vue";
//  get data from the backend
import axios from "axios";
import { reactive, ref } from "vue";


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
//    const chartHolder = document.getElementById("chartdevice");
//    new GroupedBarChart(chartHolder, {
//         data: dataFromback,
//         options: options,  
//     });
}

function createDeviceInfoChart(dataFromback, options) {
    console.log(dataFromback);
    const chartHolder = document.getElementById("chartdevice");
    new GroupedBarChart(chartHolder, {
        data: dataFromback,
        options: options,  
    });
}
});
</script>

<template>
    <div id="chartdevice" style="width: 100%; height: 100%;"></div>
</template>
<style>
#chartdevice {
    width: 100%;
    height: 100%;
}
</style>