<template>
  <section>
    <sub-heading :title="title"></sub-heading>
    <div class="section-main">
      <slot />
    </div>
  </section>
</template>
<style lang="scss">
.section-main {
  margin: 30px 10px;
}
</style>
<script setup lang="ts">
import SubHeading from '@/components/SubHeading.vue'

const props = defineProps({
  title: String
})
</script>