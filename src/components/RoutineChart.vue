<template>
  <div ref="graph" class="chart-container" @click="dismissPopover">
    <div v-if="showEmptyState" class="chart-empty-state" role="status">
      <p>No routines match these filters.</p>
      <p class="small font-sans">Adjust the filters to see more routines.</p>
    </div>
    <Popover v-if="popoverVisible" :visible="popoverVisible" :position="popoverPosition" @click.stop>
      <div v-if="popoverContent.routines.length === 1">
        <p class="small">{{ popoverContent.routines[0].routine_name }}</p>
        <p class="small font-sans">{{ popoverContent.routines[0].point_description }}</p>
        <p v-if="popoverContent.routines[0].image_attribution" class="image-attribution font-sans">
          <a v-if="popoverContent.routines[0].image_attribution.href"
            :href="popoverContent.routines[0].image_attribution.href" target="_blank" rel="noopener noreferrer">
            {{ popoverContent.routines[0].image_attribution.text }}
          </a>
          <span v-else>{{ popoverContent.routines[0].image_attribution.text }}</span>
        </p>
      </div>
      <div v-else class="cluster-popover">
        <button v-for="routinePoint in popoverContent.routines" :key="routinePoint.routine.id" class="cluster-option"
          type="button" @click="selectPopoverRoutine(routinePoint)">
          <p class="small">{{ routinePoint.routine_name }}</p>
          <p class="small font-sans">{{ routinePoint.point_description }}</p>
          <p v-if="routinePoint.image_attribution" class="image-attribution font-sans">
            <a v-if="routinePoint.image_attribution.href" :href="routinePoint.image_attribution.href" target="_blank"
              rel="noopener noreferrer">
              {{ routinePoint.image_attribution.text }}
            </a>
            <span v-else>{{ routinePoint.image_attribution.text }}</span>
          </p>
        </button>
      </div>
    </Popover>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as d3 from 'd3';
import Popover from './Popover.vue';
import { store, Routine } from '../store';
import { routineSlug } from '../routines';
import { routineMarkerImages } from '../generated/routine-marker-images';

type RoutinePoint = {
  x: number;
  y: number;
  routine_name: string;
  point_description: string;
  marker_image?: string;
  image_attribution?: {
    text: string;
    href?: string;
  };
  flag: 'fr' | 'kr' | null;
  routine: Routine;
};

type ClusterPoint = {
  x: number;
  y: number;
  routines: RoutinePoint[];
};

type PointPosition = {
  x: number;
  y: number;
};

type RoutineWithMarkerImage = Routine & {
  celebrity_face_image?: string;
  celebrity_image_credit?: string;
  celebrity_image_license?: string;
  celebrity_image_source?: string;
  sources?: Array<{
    image?: string;
  }>;
};

function pointDistance(pointA: PointPosition, pointB: PointPosition) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function groupNearbyPoints(
  points: RoutinePoint[],
  position: (point: RoutinePoint) => PointPosition,
  nearbyDistance: number,
) {
  const groups: RoutinePoint[][] = [];

  for (const point of points) {
    const pointPixelPosition = position(point);
    const matchingGroup = groups.find((group) => {
      if (nearbyDistance <= 0) {
        return group.some((groupPoint) => groupPoint.x === point.x && groupPoint.y === point.y);
      }

      return group.some((groupPoint) => pointDistance(pointPixelPosition, position(groupPoint)) <= nearbyDistance);
    });

    if (matchingGroup) {
      matchingGroup.push(point);
    } else {
      groups.push([point]);
    }
  }

  return groups;
}

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
    const route = useRoute();
    const router = useRouter();
    const popoverVisible = ref(false);
    const popoverContent = ref<{ routines: RoutinePoint[] }>({ routines: [] });
    const popoverPosition = ref({ x: 0, y: 0 });
    const pinnedPopoverKey = ref<string | null>(null);
    const showEmptyState = computed(() => props.routines.length === 0);
    let resizeObserver: ResizeObserver | null = null;

    const hidePopover = () => {
      popoverVisible.value = false;
    };

    const dismissPopover = () => {
      pinnedPopoverKey.value = null;
      hidePopover();
    };

    const showPopover = (content: { routines: RoutinePoint[] }, position: { x: number; y: number }) => {
      popoverContent.value = content;
      popoverPosition.value = position;
      popoverVisible.value = true;
    };

    const updateRoutineUrl = (routine: Routine) => {
      router.push({
        name: 'routine',
        params: { routineSlug: routineSlug(routine) },
        query: { ...route.query, routine: undefined },
      });
    };

    const selectRoutine = (routine: Routine) => {
      store.setCurrentRoutine(routine);
      updateRoutineUrl(routine);
    };

    const selectPopoverRoutine = (point: RoutinePoint) => {
      selectRoutine(point.routine);
      dismissPopover();
      createGraph();
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
      const isWikimediaImage = (image: string | undefined) => Boolean(
        image && /(commons\.wikimedia\.org|upload\.wikimedia\.org|wikipedia\.org\/wiki\/Special:FilePath)/.test(image)
      );
      const getRoutineFlag = (routine: Routine): RoutinePoint['flag'] => {
        const routineName = routine.routine_name.toLowerCase();

        if (routineName.startsWith('french pharmacy')) return 'fr';
        if (routineName.startsWith('korean skincare')) return 'kr';

        return null;
      };
      const getOriginalMarkerImage = (routine: RoutineWithMarkerImage) => {
        const sourceImage = routine.sources?.map((source) => source.image).filter(isImageString)[0];

        return routine.celebrity_face_image || sourceImage;
      };
      const getMarkerImage = (routine: RoutineWithMarkerImage) => {
        const markerImage = getOriginalMarkerImage(routine);

        return markerImage ? routineMarkerImages[markerImage] ?? markerImage : undefined;
      };
      const getImageAttribution = (routine: RoutineWithMarkerImage, markerImage: string | undefined) => {
        if (!markerImage) return undefined;

        const credit = routine.celebrity_image_credit;
        const license = routine.celebrity_image_license;
        const source = routine.celebrity_image_source || (isWikimediaImage(markerImage) ? markerImage : undefined);

        if (!credit && !license && !source) return undefined;

        return {
          text: `Image: ${credit || 'Wikimedia Commons'}${license ? ` / ${license}` : ''}`,
          href: source,
        };
      };
      const data: RoutinePoint[] = props.routines.map((routine) => {
        const routineWithMarkerImage = routine as RoutineWithMarkerImage;
        const cost = 'cost' in routine ? routine.cost : (routine as Routine & { money?: number }).money;
        const originalMarkerImage = getOriginalMarkerImage(routineWithMarkerImage);
        const markerImage = getMarkerImage(routineWithMarkerImage);

        return {
          x: Math.min(Math.max(routine.time, 0), axisMax),
          y: Math.min(Math.max(cost ?? 0, 0), axisMax),
          routine_name: routine.routine_name,
          point_description: routine.point_description,
          marker_image: markerImage,
          image_attribution: getImageAttribution(routineWithMarkerImage, originalMarkerImage),
          flag: getRoutineFlag(routine),
          routine,
        };
      });

      // Create scales for the x and y axes
      const xScale = d3.scaleLinear().domain([0, axisMax]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, axisMax]).range([height, 0]);
      const pointPosition = (point: RoutinePoint) => ({
        x: margin.left + xScale(point.x),
        y: margin.top + yScale(point.y),
      });
      const clusterGroups = groupNearbyPoints(data, pointPosition, containerWidth <= 768 ? 18 : 0);
      const clusters: ClusterPoint[] = clusterGroups
        .filter((points) => points.length > 1)
        .map((points) => ({
          x: d3.mean(points, (point) => point.x) ?? points[0].x,
          y: d3.mean(points, (point) => point.y) ?? points[0].y,
          routines: points,
        }));
      const singlePoints = clusterGroups
        .filter((points) => points.length === 1)
        .map((points) => points[0]);
      const flagPoints = singlePoints.filter((point) => point.flag);
      const imagePoints = singlePoints.filter((point) => !point.flag && point.marker_image);
      const standardPoints = singlePoints.filter((point) => !point.flag && !point.marker_image);
      const isSelected = (point: RoutinePoint) => point.routine.id === store.currentRoutine?.id;
      const isClusterSelected = (cluster: ClusterPoint) => cluster.routines.some(isSelected);
      const routinePopoverKey = (point: RoutinePoint) => `routine:${point.routine.id}`;
      const clusterPopoverKey = (cluster: ClusterPoint) => `cluster:${cluster.routines
        .map((point) => point.routine.id)
        .sort((idA, idB) => idA - idB)
        .join(',')}`;
      const showRoutinePopover = (point: RoutinePoint) => {
        showPopover(
          { routines: [point] },
          pointPosition(point)
        );
      };
      const clusterPosition = (cluster: ClusterPoint) => ({
        x: margin.left + xScale(cluster.x),
        y: margin.top + yScale(cluster.y),
      });
      const showClusterPopover = (cluster: ClusterPoint) => {
        showPopover(
          { routines: cluster.routines },
          clusterPosition(cluster)
        );
      };
      const showHoverRoutinePopover = (point: RoutinePoint) => {
        if (pinnedPopoverKey.value) return;

        showRoutinePopover(point);
      };
      const showHoverClusterPopover = (cluster: ClusterPoint) => {
        if (pinnedPopoverKey.value) return;

        showClusterPopover(cluster);
      };
      const hideHoverPopover = () => {
        if (pinnedPopoverKey.value) return;

        hidePopover();
      };
      const togglePinnedRoutinePopover = (point: RoutinePoint) => {
        const key = routinePopoverKey(point);

        if (pinnedPopoverKey.value === key) {
          dismissPopover();
          return;
        }

        pinnedPopoverKey.value = key;
        selectRoutinePoint(point);
        showRoutinePopover(point);
      };
      const togglePinnedClusterPopover = (cluster: ClusterPoint) => {
        const key = clusterPopoverKey(cluster);

        if (pinnedPopoverKey.value === key) {
          dismissPopover();
          return;
        }

        pinnedPopoverKey.value = key;
        showClusterPopover(cluster);
      };
      const syncPinnedPopover = () => {
        const key = pinnedPopoverKey.value;

        if (!key) return;

        if (key.startsWith('routine:')) {
          const routineId = Number(key.replace('routine:', ''));
          const point = data.find((routinePoint) => routinePoint.routine.id === routineId);

          if (point) {
            showRoutinePopover(point);
            return;
          }
        }

        const cluster = clusters.find((clusterPoint) => clusterPopoverKey(clusterPoint) === key);

        if (cluster) {
          showClusterPopover(cluster);
          return;
        }

        dismissPopover();
      };
      const updateSelectedMarkerStyles = (routineId: number) => {
        d3.select(graph.value)
          .selectAll<SVGCircleElement, RoutinePoint>('.dot')
          .attr('fill', (point) => point.routine.id === routineId ? activeColor : restingColor);

        d3.select(graph.value)
          .selectAll<SVGCircleElement, RoutinePoint>('.image-dot-ring')
          .attr('stroke', (point) => point.routine.id === routineId ? activeColor : restingColor)
          .attr('stroke-width', (point) => point.routine.id === routineId ? selectedStrokeWidth : defaultStrokeWidth);

        d3.select(graph.value)
          .selectAll<SVGCircleElement, RoutinePoint>('.flag-dot-ring')
          .attr('stroke', (point) => point.routine.id === routineId ? activeColor : restingColor)
          .attr('stroke-width', (point) => point.routine.id === routineId ? selectedStrokeWidth : defaultStrokeWidth);

        d3.select(graph.value)
          .selectAll<SVGCircleElement, ClusterPoint>('.cluster-dot')
          .attr('fill', (cluster) => cluster.routines.some((point) => point.routine.id === routineId) ? activeColor : restingColor);
      };
      const selectRoutinePoint = (point: RoutinePoint) => {
        selectRoutine(point.routine);
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
      const standardDot = svg
        .selectAll('.standard-dot')
        .data(standardPoints)
        .enter()
        .append('g')
        .attr('class', 'standard-dot')
        .attr('transform', (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
        .style('cursor', 'pointer');

      standardDot
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 10)
        .attr('fill', (d) => isSelected(d) ? activeColor : restingColor);

      standardDot
        .on("mouseover", function (event, d) {
          d3.select(this).select('.dot').attr("fill", activeColor);
          event.stopPropagation();
          showHoverRoutinePopover(d);
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).select('.dot').attr("fill", isSelected(d) ? activeColor : restingColor);
          hideHoverPopover();
        })
        .on("pointerdown", function (event, d) {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          togglePinnedRoutinePopover(d);
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          togglePinnedRoutinePopover(d);
        });

      const clusterDot = svg
        .selectAll('.cluster-marker')
        .data(clusters)
        .enter()
        .append('g')
        .attr('class', 'cluster-marker')
        .attr('transform', (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
        .style('cursor', 'pointer');

      clusterDot
        .append('circle')
        .attr('class', 'cluster-dot')
        .attr('r', 13)
        .attr('fill', (d) => isClusterSelected(d) ? activeColor : restingColor);

      clusterDot
        .append('text')
        .attr('class', 'cluster-count')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#fbfaf4')
        .style('font-family', 'var(--font-family-sans-serif)')
        .style('font-size', '10px')
        .style('font-weight', '500')
        .style('pointer-events', 'none')
        .text((d) => `+${d.routines.length}`);

      clusterDot
        .on("mouseover", function (event, d) {
          d3.select(this).select('.cluster-dot').attr('fill', activeColor);
          event.stopPropagation();
          showHoverClusterPopover(d);
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).select('.cluster-dot').attr('fill', isClusterSelected(d) ? activeColor : restingColor);
          hideHoverPopover();
        })
        .on("pointerdown", function (event, d) {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          togglePinnedClusterPopover(d);
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          togglePinnedClusterPopover(d);
        });

      const flagDot = svg
        .selectAll('.flag-dot')
        .data(flagPoints)
        .enter()
        .append('g')
        .attr('class', 'flag-dot')
        .attr('transform', (d) => `translate(${xScale(d.x) - markerRadius}, ${yScale(d.y) - markerRadius})`)
        .style('cursor', 'pointer');

      flagDot
        .append('clipPath')
        .attr('id', (d) => `routine-flag-clip-${d.routine.id}`)
        .append('circle')
        .attr('r', markerRadius)
        .attr('cx', markerRadius)
        .attr('cy', markerRadius);

      const flagFill = flagDot
        .append('g')
        .attr('clip-path', (d) => `url(#routine-flag-clip-${d.routine.id})`);

      flagFill
        .append('rect')
        .attr('width', markerSize)
        .attr('height', markerSize)
        .attr('fill', '#fbfaf4');

      const frenchFlagFill = flagFill.filter((d) => d.flag === 'fr');

      frenchFlagFill
        .append('rect')
        .attr('width', markerSize / 3)
        .attr('height', markerSize)
        .attr('fill', '#243A8F');

      frenchFlagFill
        .append('rect')
        .attr('x', (markerSize / 3) * 2)
        .attr('width', markerSize / 3)
        .attr('height', markerSize)
        .attr('fill', '#D13F3F');

      const koreanFlagFill = flagFill.filter((d) => d.flag === 'kr');

      koreanFlagFill
        .append('path')
        .attr('d', 'M14 7 A7 7 0 0 1 14 21 A3.5 3.5 0 0 1 14 14 A3.5 3.5 0 0 0 14 7 Z')
        .attr('fill', '#CD2E3A');

      koreanFlagFill
        .append('path')
        .attr('d', 'M14 21 A7 7 0 0 1 14 7 A3.5 3.5 0 0 1 14 14 A3.5 3.5 0 0 0 14 21 Z')
        .attr('fill', '#0047A0');

      const trigramBars = [
        { x: 4.2, y: 6.2, rotation: -34 },
        { x: 20.1, y: 6.2, rotation: 34 },
        { x: 4.2, y: 20.5, rotation: 34 },
        { x: 20.1, y: 20.5, rotation: -34 },
      ];

      const trigrams = koreanFlagFill
        .selectAll('.korean-flag-trigram')
        .data(trigramBars)
        .enter()
        .append('g')
        .attr('class', 'korean-flag-trigram')
        .attr('transform', (bar) => `translate(${bar.x}, ${bar.y}) rotate(${bar.rotation})`);

      trigrams
        .selectAll('rect')
        .data([0, 1, 2])
        .enter()
        .append('rect')
        .attr('x', -2.3)
        .attr('y', (barIndex) => barIndex * 1.8)
        .attr('width', 4.6)
        .attr('height', 0.9)
        .attr('rx', 0.2)
        .attr('fill', '#111111');

      flagDot
        .append('circle')
        .attr('class', 'flag-dot-ring')
        .attr('cx', markerRadius)
        .attr('cy', markerRadius)
        .attr('r', markerRadius)
        .attr('fill', 'none')
        .attr('stroke', (d) => isSelected(d) ? activeColor : restingColor)
        .attr('stroke-width', (d) => isSelected(d) ? selectedStrokeWidth : defaultStrokeWidth);

      flagDot
        .on("mouseover", function (event, d) {
          d3.select(this).select('.flag-dot-ring')
            .attr('stroke', activeColor)
            .attr('stroke-width', selectedStrokeWidth);
          event.stopPropagation();
          showHoverRoutinePopover(d);
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).select('.flag-dot-ring')
            .attr('stroke', isSelected(d) ? activeColor : restingColor)
            .attr('stroke-width', isSelected(d) ? selectedStrokeWidth : defaultStrokeWidth);
          hideHoverPopover();
        })
        .on("pointerdown", function (event, d) {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          togglePinnedRoutinePopover(d);
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          togglePinnedRoutinePopover(d);
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
          showHoverRoutinePopover(d);
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).select('.image-dot-ring')
            .attr('stroke', isSelected(d) ? activeColor : restingColor)
            .attr('stroke-width', isSelected(d) ? selectedStrokeWidth : defaultStrokeWidth);
          hideHoverPopover();
        })
        .on("pointerdown", function (event, d) {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          togglePinnedRoutinePopover(d);
        })
        .on("click", function (event, d) {
          event.stopPropagation();
          togglePinnedRoutinePopover(d);
        });

      // Keep country markers visible when nearby portrait markers overlap them.
      flagDot.raise();

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

      syncPinnedPopover();
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
      showEmptyState,
      dismissPopover,
      selectPopoverRoutine,
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

.chart-empty-state {
  position: absolute;
  inset: 50% auto auto 50%;
  z-index: 1;
  width: min(22rem, calc(100% - var(--space-xl) * 2));
  transform: translate(-50%, -50%);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  box-shadow: 1px 3px 0 var(--color-dark);
  padding: var(--space-md);
  text-align: center;
  pointer-events: none;
}

.chart-empty-state p {
  margin: 0;
}

.cluster-popover {
  display: grid;
  gap: var(--space-sm);
}

.cluster-option {
  display: grid;
  gap: var(--space-sm);
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0;
  text-align: left;
}

.cluster-option:not(:first-child) {
  border-top: 1px solid rgba(251, 250, 244, 0.35);
  padding-top: var(--space-sm);
}

.cluster-option:hover {
  color: var(--color-primary);
}

.cluster-option p {
  margin: 0;
}

.image-attribution {
  margin: var(--space-sm) 0 0;
  padding-top: var(--space-xs);
  border-top: 1px solid rgba(251, 250, 244, 0.35);
  font-size: 0.68rem;
  line-height: 1.25;
  opacity: 0.75;
}

.image-attribution a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cluster-option .image-attribution {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
</style>
