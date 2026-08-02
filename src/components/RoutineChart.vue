<template>
  <div ref="graph" class="chart-container" @click="closePopover">
    <Popover v-if="popoverVisible" :visible="popoverVisible" :position="popoverPosition" @click.stop>
      <div>
        <p class="small">{{ popoverContent.routine_name }}</p>
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
  routine_name: string;
  point_description: string;
  marker_image?: string;
  routine: Routine;
};

type RoutineWithMarkerImage = Routine & {
  celebrity_face_image?: string;
  sources?: Array<{
    image?: string;
  }>;
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
    const popoverContent = ref({ routine_name: "", point_description: "" });
    const popoverPosition = ref({ x: 0, y: 0 });
    let resizeObserver: ResizeObserver | null = null;

    const closePopover = () => {
      popoverVisible.value = false;
    };

    const showPopover = (content: { routine_name: string; point_description: string }, position: { x: number; y: number }) => {
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
        right: Math.min(34, containerWidth * 0.1),
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
      const markerSize = 28;
      const markerRadius = markerSize / 2;
      const selectedStrokeWidth = 3;
      const defaultStrokeWidth = 2;
      const activeColor = '#C85238';
      const restingColor = '#343A40';
      const isImageString = (image: string | undefined): image is string => Boolean(image);
      const getMarkerImage = (routine: RoutineWithMarkerImage) => {
        const sourceImage = routine.sources?.map((source) => source.image).filter(isImageString)[0];

        return routine.celebrity_face_image || sourceImage;
      };
      const data: RoutinePoint[] = props.routines.map((routine) => {
        const routineWithMarkerImage = routine as RoutineWithMarkerImage;

        return {
          x: Math.min(Math.max(routine.time, 0), axisMax),
          y: Math.min(Math.max(routine.money, 0), axisMax),
          routine_name: routine.routine_name,
          point_description: routine.point_description,
          marker_image: getMarkerImage(routineWithMarkerImage),
          routine,
        };
      });
      const imagePoints = data.filter((point) => point.marker_image);
      const standardPoints = data.filter((point) => !point.marker_image);
      const isSelected = (point: RoutinePoint) => point.routine.id === store.currentRoutine.id;
      const showRoutinePopover = (point: RoutinePoint) => {
        showPopover(
          { routine_name: point.routine_name, point_description: point.point_description },
          pointPosition(point)
        );
      };
      const updateSelectedMarkerStyles = (routineId: number) => {
        d3.select(graph.value)
          .selectAll<SVGCircleElement, RoutinePoint>('.dot')
          .attr('fill', (point) => point.routine.id === routineId ? activeColor : restingColor);

        d3.select(graph.value)
          .selectAll<SVGCircleElement, RoutinePoint>('.image-dot-ring')
          .attr('stroke', (point) => point.routine.id === routineId ? activeColor : restingColor)
          .attr('stroke-width', (point) => point.routine.id === routineId ? selectedStrokeWidth : defaultStrokeWidth);
      };
      const selectRoutinePoint = (point: RoutinePoint) => {
        store.setCurrentRoutine(point.routine);
        updateSelectedMarkerStyles(point.routine.id);
      };

      const defs = svgRoot.append('defs');

      defs
        .selectAll('clipPath')
        .data(imagePoints)
        .enter()
        .append('clipPath')
        .attr('id', (d) => `routine-marker-clip-${d.routine.id}`)
        .append('circle')
        .attr('r', markerRadius)
        .attr('cx', markerRadius)
        .attr('cy', markerRadius);

      // Create scales for the x and y axes
      const xScale = d3.scaleLinear().domain([0, axisMax]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, axisMax]).range([height, 0]);
      const pointPosition = (point: RoutinePoint) => ({
        x: margin.left + xScale(point.x),
        y: margin.top + yScale(point.y),
      });

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

      // Add standard points (scatter plot)
      svg
        .selectAll('.dot')
        .data(standardPoints)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 10)
        .attr('fill', (d) => isSelected(d) ? activeColor : restingColor)
        .style('cursor', 'pointer')
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", activeColor);
          event.stopPropagation();
          showRoutinePopover(d);
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).attr("fill", isSelected(d) ? activeColor : restingColor);
          closePopover();
        })
        .on("pointerdown", function (event, d) {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          selectRoutinePoint(d);
          showRoutinePopover(d);
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          selectRoutinePoint(d);
          showRoutinePopover(d);
        });

      // Add image points for source-backed / celebrity-style routines.
      const imageDot = svg
        .selectAll('.image-dot')
        .data(imagePoints)
        .enter()
        .append('g')
        .attr('class', 'image-dot')
        .attr('transform', (d) => `translate(${xScale(d.x) - markerRadius}, ${yScale(d.y) - markerRadius})`)
        .style('cursor', 'pointer');

      imageDot
        .append('circle')
        .attr('class', 'image-dot-background')
        .attr('cx', markerRadius)
        .attr('cy', markerRadius)
        .attr('r', markerRadius)
        .attr('fill', '#fbfaf4');

      imageDot
        .append('image')
        .attr('href', (d) => d.marker_image ?? '')
        .attr('width', markerSize)
        .attr('height', markerSize)
        .attr('clip-path', (d) => `url(#routine-marker-clip-${d.routine.id})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');

      imageDot
        .append('circle')
        .attr('class', 'image-dot-ring')
        .attr('cx', markerRadius)
        .attr('cy', markerRadius)
        .attr('r', markerRadius)
        .attr('fill', 'none')
        .attr('stroke', (d) => isSelected(d) ? activeColor : restingColor)
        .attr('stroke-width', (d) => isSelected(d) ? selectedStrokeWidth : defaultStrokeWidth);

      imageDot
        .on("mouseover", function (event, d) {
          d3.select(this).select('.image-dot-ring')
            .attr('stroke', activeColor)
            .attr('stroke-width', selectedStrokeWidth);
          event.stopPropagation();
          showRoutinePopover(d);
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).select('.image-dot-ring')
            .attr('stroke', isSelected(d) ? activeColor : restingColor)
            .attr('stroke-width', isSelected(d) ? selectedStrokeWidth : defaultStrokeWidth);
          closePopover();
        })
        .on("pointerdown", function (event, d) {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          selectRoutinePoint(d);
          showRoutinePopover(d);
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          selectRoutinePoint(d);
          showRoutinePopover(d);
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
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("transform", `translate(${width + margin.right / 2}, ${height / 2}) rotate(90)`)
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
