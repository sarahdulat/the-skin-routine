<template>
  <div id="chart"></div>
</template>

<script>
import chart from '../chart.js'

export default {
  created () {
    new chart()
  }
}
</script>

<style lang="scss" scoped>
svg {
  width: 90vw;
  max-width: 900px;
}
</style>
