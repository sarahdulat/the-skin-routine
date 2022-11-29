<template>
  <svg id="scatter" width="500" height="500"></svg>
</template>

<script>
import * as d3 from "d3"
import data from "../../public/json/data.json";

export default {
  name: 'routine-chart',
  data() {
    return {
      chartData: data
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

      d3.json(this.chartData, function (error, data) {
        if (error) throw error;

        data.forEach(function (d) {
          d.money = +d.money;
          d.time = +d.time;
        });

        g.selectAll("circle")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 7)
          .attr("cx", function (d) { return x(d.time); })
          .attr("cy", function (d) { return y(d.money); })
          .style("fill", function (d) {
            if (d.money >= 3 && d.time <= 3) { return "#60B19C" } // Top Left
            else if (d.money >= 3 && d.time >= 3) { return "#8EC9DC" } // Top Right
            else if (d.money <= 3 && d.time >= 3) { return "#D06B47" } // Bottom Left
            else { return "#A72D73" } //Bottom Right
          });

        g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
          .call(d3.axisBottom(x).ticks(5));

        g.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
          .call(d3.axisLeft(y).ticks(5));
      });
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

<style>
.chart-container {
  border: 1px solid navy;
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
}

.bar {
  fill: rgb(255, 0, 212);
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
