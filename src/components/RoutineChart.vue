<template>
  <div>
    <div ref="graph" class="chart-container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';

export default defineComponent({
  name: 'ResponsiveQuadrantGridChart',
  setup() {
    const graph = ref<HTMLDivElement | null>(null);
    const svgRef = ref<SVGSVGElement | null>(null);

    // Function to create the quadrant graph with grid lines
    const createGraph = () => {
      const margin = { top: 60, right: 60, bottom: 40, left: 0 };
      // Calculate width and height based on the container size
      const containerSize = Math.min(graph.value!.clientWidth, graph.value!.clientHeight);
      const width = containerSize - margin.left - margin.right;
      const height = containerSize - margin.top - margin.bottom;

      // Remove existing SVG if present
      d3.select(graph.value).selectAll("*").remove();

      const svg = d3
        .select(graph.value)
        .append('svg')
        .attr('viewBox', `0 0 ${containerSize} ${containerSize}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top / 2})`);

      // Generate random data points for the scatter plot
      const data = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      // Create scales for the x and y axes
      const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

      // Draw horizontal grid lines
      for (let i = 10; i < 100; i += 10) {
        svg.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', yScale(i))
          .attr('y2', yScale(i))
          .attr('stroke', '#ccc') // Light gray for grid lines
          .attr('stroke-width', 1);
      }

      // Draw vertical grid lines
      for (let i = 10; i < 100; i += 10) {
        svg.append('line')
          .attr('x1', xScale(i))
          .attr('x2', xScale(i))
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', '#ccc') // Light gray for grid lines
          .attr('stroke-width', 1);
      }

      // Draw the quadrants (horizontal and vertical lines)
      svg
        .append('line')
        .attr('class', 'quadrant-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('stroke', '#343A40')
        .attr('stroke-width', 2);

      svg
        .append('line')
        .attr('class', 'quadrant-line')
        .attr('x1', width / 2)
        .attr('x2', width / 2)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#343A40')
        .attr('stroke-width', 2);

      // Add points (scatter plot)
      svg
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 5)
        .attr('fill', '#f16544');

      // Add X-axis label at the top
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 5) // Position above the X-axis
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("X Axis Label (Top)");

      // Add Y-axis label on the right
      svg.append("text")
        .attr("transform", "rotate(90)") // Rotate text for Y-axis label on the right
        .attr("x", height / 2)
        .attr("y", width + margin.right / 2) // Position to the right of the Y-axis
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Y Axis Label (Right)");
    };

    // Fetch data and create the graph on component mount
    onMounted(() => {
      createGraph();
      window.addEventListener('resize', createGraph); // Redraw the graph on resize
    });

    // Cleanup listener on component unmount
    onMounted(() => {
      return () => {
        window.removeEventListener('resize', createGraph);
      };
    });

    return {
      graph,
      svgRef,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  /* Set full width */
  height: 100%;
  /* Set full height */
  position: relative;
  /* Ensure positioning works for children */
  max-height: calc(100vh - 240px);
  /* Set a maximum height for the container */
}

.quadrant-line {
  stroke: #343A40;
  stroke-width: 2px;
}
</style>
