<template>
  <div ref="graph" class="chart-container" @click="closePopover">
    <Popover v-if="popoverVisible" :visible="popoverVisible" :position="popoverPosition" @click.stop>
      <div>
        <p class="small">{{ popoverContent.point_title }}</p>
        <p class="small font-sans">{{ popoverContent.point_description }}</p>
      </div>
    </Popover>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import * as d3 from 'd3';
import Popover from './Popover.vue';
import { store, Routine } from '../store';

type RoutinePoint = {
  x: number;
  y: number;
  point_title: string;
  point_description: string;
  routine: Routine;
};

export default defineComponent({
  name: 'SquareResponsiveQuadrantGridChart',
  components: {
    Popover,
  },
  props: {
    routines: {
      type: Array as PropType<Routine[]>,
      required: true,
    },
  },
  setup(props) {
    const graph = ref<HTMLDivElement | null>(null);
    const popoverVisible = ref(false);
    const popoverContent = ref({ point_title: "", point_description: "" });
    const popoverPosition = ref({ x: 0, y: 0 });
    let resizeObserver: ResizeObserver | null = null;

    const closePopover = () => {
      popoverVisible.value = false;
    };

    const showPopover = (content: { point_title: string; point_description: string }, position: { x: number; y: number }) => {
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

      const axisMax = 12;
      const data: RoutinePoint[] = props.routines.map((routine) => ({
        x: Math.min(Math.max(routine.time, 0), axisMax),
        y: Math.min(Math.max(routine.money, 0), axisMax),
        point_title: routine.point_title,
        point_description: routine.point_description,
        routine,
      }));

      // Create scales for the x and y axes
      const xScale = d3.scaleLinear().domain([0, axisMax]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, axisMax]).range([height, 0]);

      const costBands = [
        { label: "Minimal", min: 0, max: 3, opacity: 0 },
        { label: "Moderate", min: 3, max: 6, opacity: 0.05 },
        { label: "Elevated", min: 6, max: 9, opacity: 0.1 },
        { label: "Luxury", min: 9, max: 12, opacity: 0.15 },
      ];

      svg
        .selectAll('.cost-band')
        .data(costBands)
        .enter()
        .append('rect')
        .attr('class', 'cost-band')
        .attr('x', 0)
        .attr('y', (d) => yScale(d.max))
        .attr('width', width)
        .attr('height', (d) => yScale(d.min) - yScale(d.max))
        .attr('fill', '#C85238')
        .attr('opacity', (d) => d.opacity);

      svg
        .selectAll('.cost-band-label')
        .data(costBands)
        .enter()
        .append('text')
        .attr('class', 'cost-band-label')
        .attr('x', width - 8)
        .attr('y', (d) => yScale((d.min + d.max) / 2))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-family', 'var(--font-family-sans-serif)')
        .style('fill', '#343A40')
        .style('opacity', 0.7)
        .text((d) => d.label);

      // Draw horizontal grid lines
      for (let i = 1; i < axisMax; i += 1) {
        svg.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', yScale(i))
          .attr('y2', yScale(i))
          .attr('stroke', '#343A40')
          .attr('stroke-width', 0.5);
      }

      // Draw vertical grid lines
      for (let i = 1; i < axisMax; i += 1) {
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
        .attr('fill', (d) => d.routine.id === store.currentRoutine.id ? '#343A40' : '#C85238')
        .style('cursor', 'pointer')
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "#343A40");
          event.stopPropagation();
          showPopover(
            { point_title: d.point_title, point_description: d.point_description },
            { x: event.clientX, y: event.clientY }
          );
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).attr("fill", d.routine.id === store.currentRoutine.id ? '#343A40' : '#C85238');
          closePopover();
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          store.setCurrentRoutine(d.routine);
          closePopover();

          d3.select(graph.value)
            .selectAll<SVGCircleElement, RoutinePoint>('.dot')
            .attr('fill', (point) => point.routine.id === d.routine.id ? '#343A40' : '#C85238');
        });

      // Add X-axis label
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Cost");

      // Add Y-axis label
      svg.append("text")
        .attr("x", width + margin.right / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("transform", `${width + margin.right / 2}, ${height / 2})`)
        .style("font-size", "16px")
        .text("Time");
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

    watch(() => props.routines, createGraph, { deep: true });

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
