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
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
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
    let resizeObserver: ResizeObserver | null = null;

    const closePopover = () => {
      popoverVisible.value = false;
    };

    const showPopover = (content: { title: string; description: string }, position: { x: number; y: number }) => {
      popoverContent.value = content;
      popoverPosition.value = position;
      popoverVisible.value = true;
    };


    const createGraph = () => {
      if (!graph.value) return;

      const { width: rawWidth, height: rawHeight } = graph.value.getBoundingClientRect();
      const containerWidth = Math.floor(rawWidth);
      const containerHeight = Math.floor(rawHeight);

      d3.select(graph.value).selectAll("svg").remove();

      if (containerWidth <= 0 || containerHeight <= 0) return;

      const margin = {
        top: Math.min(48, containerHeight * 0.14),
        right: Math.min(64, containerWidth * 0.18),
        bottom: 12,
        left: 12,
      };

      const width = Math.max(containerWidth - margin.left - margin.right, 0);
      const height = Math.max(containerHeight - margin.top - margin.bottom, 0);

      const svgRoot = d3
        .select(graph.value)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'none');

      const svg = svgRoot
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
          .attr('stroke', '#343A40')
          .attr('stroke-width', 0.5);
      }

      // Draw vertical grid lines
      for (let i = 10; i < 100; i += 10) {
        svg.append('line')
          .attr('x1', xScale(i))
          .attr('x2', xScale(i))
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', '#343A40')
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
        .attr('r', 10)
        .attr('fill', '#C85238')
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "blue");
          event.stopPropagation();
          const [mouseX, mouseY] = d3.pointer(event, graph.value);

          showPopover(
            { title: d.title, description: d.description },
            { x: mouseX, y: mouseY }
          );
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#C85238");
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
      resizeObserver = new ResizeObserver(() => {
        createGraph();
      });
      resizeObserver.observe(graph.value!);
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
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
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.chart-container :deep(svg) {
  display: block;
  overflow: hidden;
}

.quadrant-line {
  stroke: #343A40;
  stroke-width: 2px;
}
</style>
