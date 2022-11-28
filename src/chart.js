import * as d3 from "d3";

const routines = [
  {
    name: 'Routine 1',
    time: 30,
    money: 200
  },
  {
    name: 'Routine 2',
    time: 5,
    money: 20
  },
  {
    name: 'Routine 3',
    time: 20,
    money: 100
  }
]

// minimum and maximum values for the time and money
const time = {
  min: 0,
  max: 100,
};
const money = {
  min: 0,
  max: 10000,
};

// number of data points
// create an array of data points leveraging the utility functions
const data = Array(routines);

// VIZ
// in the #chart container include an SVG element following the margin convention
const margin = {
  top: 20,
  right: 65,
  bottom: 50,
  left: 65,
};

const width = 400 - (margin.left + margin.right);
const height = 400 - (margin.top + margin.bottom);

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

const group = svg
  .append('g')
  .attr('transform', `translate(${margin.left} ${margin.top})`);

// scales
// for both the x and y dimensions define linear scales, using the minimum and maximum values defined earlier
const timeScale = d3
  .scaleLinear()
  .domain(d3.extent(Object.values(time)))
  .range([0, width]);

const moneyScale = d3
  .scaleLinear()
  .domain(d3.extent(Object.values(money)))
  .range([height, 0]);

// quadrants and labels
// position four rectangles and text elements to divvy up the larger shape in four sections
const quad = [
  'Quick & Bougie',
  'Indulgent',
  'Time + Money',
  'Ballin on a Budget',
];

const quadrantsGroup = group
  .append('g')
  .attr('class', 'quadrants');

// include one group for each quadrant
const quadrants = quadrantsGroup
  .selectAll('g.quadrant')
  .data(quad)
  .enter()
  .append('g')
  .attr('class', 'quadrant')
  // position the groups at the four corners of the viz
  .attr('transform', (d, i) => `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})`);

// for each quadrant add a rectangle and a label
quadrants
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width / 2)
  .attr('height', height / 2)
  // include a darker shade for the third quadrant
  .attr('fill', (d, i) => (i === 2 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 100%, 100%)'))
  // highlight the second and third quadrant with less transparency
  .attr('opacity', (d, i) => ((i === 1 || i === 2) ? 0.15 : 0.05));

quadrants
  .append('text')
  .attr('x', width / 4)
  .attr('y', height / 4)
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'middle')
  .text(d => d)
  .style('text-transform', 'uppercase')
  .style('font-weight', '300')
  .style('font-size', '0.9rem')
  .attr('opacity', 0.9);

// axes
const timeAxis = d3
  .axisBottom(timeScale)
  .tickFormat(d => `${d}m`);

const moneyAxis = d3
  .axisLeft(moneyScale)
  .tickFormat(d => `$${d}`);

// add classes to later identify the axes individually and jointly
group
  .append('g')
  .attr('transform', `translate(0 ${height})`)
  .attr('class', 'axis axis-time')
  .call(timeAxis);

group
  .append('g')
  .attr('class', 'axis axis-money')
  .call(moneyAxis);

// remove the path describing the axes
d3
  .selectAll('.axis')
  .select('path')
  .remove();

// style the ticks to be shorter
d3
  .select('.axis-time')
  .selectAll('line')
  .attr('y2', 5);

d3
  .select('.axis-money')
  .selectAll('line')
  .attr('x2', -4);

d3
  .selectAll('.axis')
  .selectAll('text')
  .attr('font-size', '0.55rem');

// grid
// include dotted lines for each tick and for both axes
d3
  .select('.axis-time')
  .selectAll('g.tick')
  .append('path')
  .attr('d', `M 0 0 v -${height}`)
  .attr('stroke', 'currentColor')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2')
  .attr('opacity', 0.3);

d3
  .select('.axis-money')
  .selectAll('g.tick')
  .append('path')
  .attr('d', `M 0 0 h ${width}`)
  .attr('stroke', 'currentColor')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2')
  .attr('opacity', 0.3);


// labels
// add a group to position the label where needed
// for the money label, this allows to also modify the transform-origin as to rotate the label from the center of the axis
d3
  .select('.axis-time')
  .append('g')
  .attr('class', 'label label-time')
  .attr('transform', `translate(${width / 2} ${margin.bottom})`);

d3
  .select('g.label-time')
  .append('text')
  .attr('x', 0)
  .attr('y', 0)
  .text('Time')
  .attr('text-anchor', 'middle');

d3
  .select('.axis-money')
  .append('g')
  .attr('class', 'label label-money')
  .attr('transform', `translate(-${margin.left} ${height / 2})`);

d3
  .select('g.label-money')
  .append('text')
  .attr('x', 0)
  .attr('y', 0)
  .text('Cost')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'hanging')
  .attr('transform', 'rotate(-90)');

// style both labels with a heavier weight
d3
  .selectAll('g.label text')
  .style('font-size', '0.65rem')
  .style('font-weight', '600')
  .style('letter-spacing', '0.05rem');


// data points
// add a group for each data point, to group circle and text elements
const dataGroup = group
  .append('g')
  .attr('class', 'data');

const dataPointsGroup = dataGroup
  .selectAll('g.data-point')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'data-point')
  .attr('transform', ({ time, money }) => `translate(${timeScale(time)} ${moneyScale(money)})`);

// circles using the defined color
dataPointsGroup
  .append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 5)
  .attr('fill', 'black');

// labels describing the circle elements
dataPointsGroup
  .append('text')
  .attr('x', 8)
  .attr('y', 0)
  .attr('class', 'name')
  .text(({ name }, i) => `${name} ${i}`)
  .attr('dominant-baseline', 'central')
  .style('font-size', '0.55rem')
  .style('letter-spacing', '0.05rem')
  .style('pointer-events', 'none');


// on hover highlight the data point
// dataPointsGroup
//   .on('mouseenter', function (d) {
//     // slightly translate the text to the left and change the fill color
//     const text = d3
//       .select(this)
//       .select('text.name')

//     text
//       .transition()
//       .attr('transform', 'translate(12 0)')
//       .style('color', 'hsl(230, 29%, 19%)')
//       .style('text-shadow', 'none');

//     /* as the first child of the group add another group in which to gather the elements making up the tooltip
//     - rectangle faking the text's background
//     - circle highlighting the selected data point
//     - path elements connecting the circle to the values on the axes
//     - rectangles faking the background for the labels on the axes
//     - text elements making up the labels on the axes
//     */
//     const tooltip = d3
//       .select(this)
//       .insert('g', ':first-child')
//       .attr('class', 'tooltip')
//       .attr('opacity', 0)
//       .style('pointer-events', 'none');


//     // for the rectangle retrieve the width and height of the text elements to have the rectangle match in size
//     const textElement = text['_groups'][0][0];
//     const { x, y, width: textWidth, height: textHeight } = textElement.getBBox();

//     tooltip
//       .append('rect')
//       .attr('x', x - 3)
//       .attr('y', y - 1.5)
//       .attr('width', textWidth + 6)
//       .attr('height', textHeight + 3)
//       .attr('fill', 'hsl(227, 9%, 81%)')
//       .attr('rx', '2')
//       .transition()
//       // transition the rectangle to match the text translation
//       .attr('transform', 'translate(12 0)');


//     // include the two dotted lines in a group to centralize their common properties
//     const dashedLines = tooltip
//       .append('g')
//       .attr('fill', 'none')
//       .attr('stroke', 'hsl(227, 9%, 81%)')
//       .attr('stroke-width', 2)
//       // have the animation move the path with a stroke-dashoffset considering the cumulative value of a dash and an empty space
//       .attr('stroke-dasharray', '7 4')
//       // animate the path elements to perennially move toward the axes
//       .style('animation', 'dashOffset 1.5s linear infinite');


//     dashedLines
//       .append('path')
//       .attr('d', ({ money }) => `M 0 0 v ${moneyScale(money.max - money)}`);

//     dashedLines
//       .append('path')
//       .attr('d', ({ time }) => `M 0 0 h -${timeScale(time)}`);

//     // include two labels centered on the axes, highlighting the matching values
//     const labels = tooltip
//       .append('g')
//       .attr('font-size', '0.6rem')
//       .attr('fill', 'hsl(227, 9%, 81%)');

//     const labelTime = labels
//       .append('g')
//       .attr('transform', ({ money }) => `translate(0 ${moneyScale(money.max - money)})`);

//     const textTime = labelTime
//       .append('text')
//       .attr('x', 0)
//       .attr('y', 0)
//       .attr('text-anchor', 'middle')
//       .attr('dominant-baseline', 'middle')
//       .style('color', 'hsl(230, 29%, 19%)')
//       .text(({ time }) => time);

//     const labelMoney = labels
//       .append('g')
//       .attr('transform', ({ time }) => `translate(-${timeScale(time)} 0)`);

//     const textMoney = labelMoney
//       .append('text')
//       .attr('x', 0)
//       .attr('y', 0)
//       .attr('text-anchor', 'middle')
//       .attr('dominant-baseline', 'middle')
//       .style('color', 'hsl(230, 29%, 19%)')
//       .text(({ money }) => `$${money}`);

//     // behind the labels include two rectangles, replicating the faux background specified for the original text element
//     const { width: timeWidth, height: timeHeight } = textTime['_groups'][0][0].getBBox();
//     const { width: moneyWidth, height: moneyHeight } = textMoney['_groups'][0][0].getBBox();

//     labelTime
//       .insert('rect', ':first-child')
//       .attr('x', -timeWidth / 2 - 4)
//       .attr('y', -timeHeight / 2 - 2)
//       .attr('width', timeWidth + 8)
//       .attr('height', timeHeight + 4)
//       .attr('rx', 3);

//     labelMoney
//       .insert('rect', ':first-child')
//       .attr('x', -moneyWidth / 2 - 4)
//       .attr('y', -moneyHeight / 2 - 2)
//       .attr('width', moneyWidth + 8)
//       .attr('height', moneyHeight + 4)
//       .attr('rx', 3);


//     // detail a circle, with a darker fill and a larger radius
//     tooltip
//       .append('circle')
//       .attr('cx', 0)
//       .attr('cy', 0)
//       .attr('fill', 'hsl(0, 0%, 0%)')
//       .attr('stroke', 'hsl(227, 9%, 81%)')
//       .attr('stroke-width', 2)
//       .attr('r', 0)
//       // transition the circle its full radius
//       .transition()
//       .attr('r', 9.5);

//     // transition the tooltip to be fully opaque
//     tooltip
//       .transition()
//       .attr('opacity', 1);

//   })
  // when exiting the hover state reset the appearance of the data point and remove the tooltip
  // .on('mouseout', function (d) {
  //   d3
  //     .select(this)
  //     .select('text.name')
  //     .transition()
  //     .delay(100)
  //     .attr('transform', 'translate(0 0)')
  //     .style('color', 'inherit')
  //     .style('text-shadow', 'inherit');

  //   // remove the tooltip after rendering it fully transparent
  //   d3
  //     .select(this)
  //     .select('g.tooltip')
  //     .transition()
  //     .attr('opacity', 0)
  //     .remove();
  // });
