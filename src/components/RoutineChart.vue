<template>
  <div class="col-xs-12 col-sm-8">
    <svg id="scatter" width="500" height="500"></svg>
  </div>
</template>

<script lang="ts" setup>
import * as d3 from "d3"
import { onMounted } from 'vue'
import { useStore } from '../store'
import routines from '../assets/routines.json'

export type Routine = typeof routines

const store = useStore()
const props = defineProps<{
  routines: Routine
}>();

onMounted(() => { renderChart() })

function renderChart() {
  const svg = d3.select("#scatter"),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    domainwidth = width - margin.left - margin.right,
    domainheight = height - margin.top - margin.bottom;

  const x = d3.scaleLinear()
    .domain(padExtent([1, 5]))
    .range(padExtent([0, domainwidth]));
  const y = d3.scaleLinear()
    .domain(padExtent([1, 5]))
    .range(padExtent([domainheight, 0]));

  const g = svg.append("g")
    .attr("transform", "translate(" + margin.top + "," + margin.top + ")");

  g.append("rect")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("fill", "#F6F6F6");

  g.selectAll("circle")
    .data(props.routines)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 7)
    .attr("cx", (d) => x(d.time))
    .attr("cy", (d) => y(d.money))
    .style("fill", "#343A40")
    .on("click", (event, d) => { store.dispatch('setCurrentRoutine', d); })
    .append('title')
    .text((d) => `${d.name} in ${d.time} minutes for $${d.money}`);

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
    .call(d3.axisBottom(x).ticks(0));

  g.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
    .call(d3.axisLeft(y).ticks(0));
}
function padExtent(e: [number, number], p = 1) {
  return ([e[0] - p, e[1] + p]);
}
</script>

<style lang="scss" scoped></style>
