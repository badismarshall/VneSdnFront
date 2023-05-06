<template>
<div class="bloc">
    <div class="secondbloc">
      <router-view v-slot="{Component}" >
        <sidebar/>
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
</div>
</template>
<script setup>
</script>
    