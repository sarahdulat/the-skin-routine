<template>
  <div ref="graph" class="chart-container" @click="closePopover">
    <Popover v-if="popoverVisible" :visible="popoverVisible" :position="popoverPosition" @click.stop>
      <div>
        <p class="small">{{ popoverContent.title }}</p>
        <p class="small font-sans">{{ popoverContent.description }}</p>
      </div>
    </Popover>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import Popover from './Popover.vue';

export default defineComponent({
  name: 'SquareResponsiveQuadrantGridChart',
  components: {
    Popover,
  },
  setup() {
    const graph = ref<HTMLDivElement | null>(null);
    const popoverVisible = ref(false);
    const popoverContent = ref({ title: "", description: "" });
    const popoverPosition = ref({ x: 0, y: 0 });

    const closePopover = () => {
      popoverVisible.value = false;
    };

    const showPopover = (content: { title: string; description: string }, position: { x: number; y: number }) => {
      popoverContent.value = content;
      popoverPosition.value = position;
      popoverVisible.value = true;
    };


    // Function to create the quadrant graph with grid lines
    const createGraph = () => {
      const margin = { top: 60, right: 60, bottom: 0, left: 0 };

      // Get the width and height of the parent container dynamically
      const containerWidth = graph.value!.clientWidth;
      const containerHeight = graph.value!.clientHeight;

      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Remove existing SVG if present
      d3.select(graph.value).selectAll("*").remove();

      if (!graph.value) return;

      const svg = d3
        .select(graph.value)
        .append('svg')
        .attr('width', containerWidth) // Set width to match parent
        .attr('height', containerHeight) // Set height to match parent
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const data = [
        { x: 1, y: 4, title: "Point 1", description: "Details about Point 1" },
        { x: 14, y: 24, title: "Point 2", description: "Details about Point 2" },
      ];

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
          .attr('stroke', '#343A40') // Light gray for grid lines
          .attr('stroke-width', 0.5);
      }

      // Draw vertical grid lines
      for (let i = 10; i < 100; i += 10) {
        svg.append('line')
          .attr('x1', xScale(i))
          .attr('x2', xScale(i))
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', '#343A40') // Light gray for grid lines
          .attr('stroke-width', 0.5);
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
        .attr('fill', '#f16544')
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "blue");

          const [mouseX, mouseY] = d3.pointer(event);
          d3.select(this)
            .append("title")
            .text(`${d.title}`);
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#f16544");
        })
        .on("mouseover", function (event, d) {
          event.stopPropagation();
          const [mouseX, mouseY] = d3.pointer(event);

          // Show popover on hover with dynamic content
          showPopover(
            { title: d.title, description: d.description },
            { x: mouseX, y: mouseY }
          );
        });

      // Add X-axis label at the top
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 5) // Position above the X-axis
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Time");

      // Add Y-axis label on the right
      svg.append("text")
        .attr("x", width + 5) // Position to the right of the Y-axis
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .text("Cost");
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
      popoverVisible,
      popoverContent,
      popoverPosition,
      closePopover,
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
  max-height: calc(100% - 70px);
}

.quadrant-line {
  stroke: #343A40;
  stroke-width: 2px;
}
</style>
