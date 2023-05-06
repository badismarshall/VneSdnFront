<template>
<div class="container">
    <DeviceChart/>
</div>
</template>
<script setup>
import { ref } from 'vue';
import DeviceChart from '../charts/DeviceChart.vue';
import { useStore } from "vuex";

const store = useStore();
store.state.sidebar = true;
</script>
