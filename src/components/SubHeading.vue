<template>
  <h2 class="sub-title">{{ title }}</h2>
</template>
<script setup lang="ts">

const props = defineProps({
  title: String
})

</script>
<style lang="scss">
.sub-title {
  display: block;
  width: fit-content;
  position: relative;
  font-size: 16px;
  margin: 1rem 0;
  padding: 0;

  &::after {
    content: '';
    position: absolute;
    height: 5px;
    width: 100%;
    border-radius: 2px;
    left: 0;
    bottom: 0;
    transform: translateY(4px);
    background-color: #ffd04b;
  }

}
</style>