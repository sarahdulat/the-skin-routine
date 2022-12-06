<template>
  <svg id="scatter" width="500" height="500"></svg>
</template>

<script>
import * as d3 from "d3"

export default {
  name: 'routine-chart',
  data() {
    return {
      chartData: [
        {
          "question": "Routine One",
          "time": 5,
          "money": 1
        },
        {
          "question": "Routine Two",
          "time": 4,
          "money": 1
        },
        {
          "question": "Routine Three",
          "time": 4,
          "money": 2
        },
        {
          "question": "Routine Four",
          "time": 5,
          "money": 4
        },
        {
          "question": "Routine Five",
          "time": 4,
          "money": 5
        },
        {
          "question": "Routine Six",
          "time": 1,
          "money": 1
        },
        {
          "question": "Routine Seven",
          "time": 1,
          "money": 5
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    renderChart() {
      const svg = d3.select("#scatter"),
        margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        domainwidth = width - margin.left - margin.right,
        domainheight = height - margin.top - margin.bottom;

      const x = d3.scaleLinear()
        .domain(this.padExtent([1, 5]))
        .range(this.padExtent([0, domainwidth]));
      const y = d3.scaleLinear()
        .domain(this.padExtent([1, 5]))
        .range(this.padExtent([domainheight, 0]));

      const g = svg.append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.top + ")");

      g.append("rect")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("fill", "#F6F6F6");

        g.selectAll("circle")
          .data(this.chartData)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 7)
          .attr("cx", function (d) { return x(d.time); })
          .attr("cy", function (d) { return y(d.money); })
          .style("fill", "#000000");

        g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
          .call(d3.axisBottom(x).ticks(0));

        g.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
          .call(d3.axisLeft(y).ticks(0));
    },
    padExtent (e, p) {
      if (p === undefined) p = 1;
      return ([e[0] - p, e[1] + p]);
    }
  },
  mounted() {
    this.renderChart()
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  border: 1px solid navy;
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
}

text {
  fill: navy;
  font-size: smaller;
}

path.domain {
  stroke: transparent;
}

select {
  margin-bottom: 20px;
}
</style>
