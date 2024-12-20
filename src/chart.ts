import * as d3 from "d3";

// Set the dimensions of the graph
const margin = { top: 40, right: 40, bottom: 40, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create an SVG container
const svg = d3.select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Generate random data points for the scatter plot
const data = Array.from({ length: 20 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100
}));

// Create scales for the x and y axes
const xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

// Define the axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Append the axes to the SVG container
svg.append("g")
  .attr("transform", `translate(0,${height / 2})`) // Move the X-axis to the middle
  .call(xAxis);

svg.append("g")
  .attr("transform", `translate(${width / 2},0)`) // Move the Y-axis to the middle
  .call(yAxis);

// Draw the quadrants (horizontal and vertical lines)
svg.append("line")
  .attr("class", "quadrant-line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", height / 2)
  .attr("y2", height / 2);

svg.append("line")
  .attr("class", "quadrant-line")
  .attr("x1", width / 2)
  .attr("x2", width / 2)
  .attr("y1", 0)
  .attr("y2", height);

// Add points (scatter plot)
svg.selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("r", 5)
  .attr("fill", "blue");

// Add labels for the quadrants
svg.append("text")
  .attr("x", xScale(25))
  .attr("y", yScale(85))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Quadrant I");

svg.append("text")
  .attr("x", xScale(75))
  .attr("y", yScale(85))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Quadrant II");

svg.append("text")
  .attr("x", xScale(25))
  .attr("y", yScale(15))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Quadrant III");

svg.append("text")
  .attr("x", xScale(75))
  .attr("y", yScale(15))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Quadrant IV");

// const routines = [
//   {
//     name: 'Routine 1',
//     time: 30,
//     money: 200
//   },
//   {
//     name: 'Routine 2',
//     time: 5,
//     money: 20
//   },
//   {
//     name: 'Routine 3',
//     time: 20,
//     money: 100
//   }
// ]

// // minimum and maximum values for the time and money
// const time = {
//   min: 0,
//   max: 100,
// };
// const money = {
//   min: 0,
//   max: 10000,
// };

// // VIZ
// // in the #chart container include an SVG element following the margin convention
// const margin = {
//   top: 20,
//   right: 65,
//   bottom: 50,
//   left: 65,
// };

// const width = 400 - (margin.left + margin.right);
// const height = 400 - (margin.top + margin.bottom);

// const svg = d3
//   .select('#chart')
//   .append('svg')
//   .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

// const group = svg
//   .append('g')
//   .attr('transform', `translate(${margin.left} ${margin.top})`);

// // scales
// // for both the x and y dimensions define linear scales, using the minimum and maximum values defined earlier
// const timeScale = d3
//   .scaleLinear()
//   .domain(d3.extent(Object.values(time)))
//   .range([0, width]);

// const moneyScale = d3
//   .scaleLinear()
//   .domain(d3.extent(Object.values(money)))
//   .range([height, 0]);

// // quadrants and labels
// // position four rectangles and text elements to divvy up the larger shape in four sections
// const quad = [
//   'Quick & Bougie',
//   'Indulgent',
//   'Time + Money',
//   'Ballin on a Budget',
// ];

// const quadrantsGroup = group
//   .append('g')
//   .attr('class', 'quadrants');

// // include one group for each quadrant
// const quadrants = quadrantsGroup
//   .selectAll('g.quadrant')
//   .data(quad)
//   .enter()
//   .append('g')
//   .attr('class', 'quadrant')
//   // position the groups at the four corners of the viz
//   .attr('transform', (d, i) => `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})`);

// // for each quadrant add a rectangle and a label
// quadrants
//   .append('rect')
//   .attr('x', 0)
//   .attr('y', 0)
//   .attr('width', width / 2)
//   .attr('height', height / 2)
//   // include a darker shade for the third quadrant
//   .attr('fill', (d, i) => (i === 2 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 100%, 100%)'))
//   // highlight the second and third quadrant with less transparency
//   .attr('opacity', (d, i) => ((i === 1 || i === 2) ? 0.15 : 0.05));

// quadrants
//   .append('text')
//   .attr('x', width / 4)
//   .attr('y', height / 4)
//   .attr('text-anchor', 'middle')
//   .attr('dominant-baseline', 'middle')
//   .text(d => d)
//   .style('text-transform', 'uppercase')
//   .style('font-weight', '300')
//   .style('font-size', '0.9rem')
//   .attr('opacity', 0.9);

// // axes
// const timeAxis = d3
//   .axisBottom(timeScale)
//   .tickFormat(d => `${d}m`);

// const moneyAxis = d3
//   .axisLeft(moneyScale)
//   .tickFormat(d => `$${d}`);

// // add classes to later identify the axes individually and jointly
// group
//   .append('g')
//   .attr('transform', `translate(0 ${height})`)
//   .attr('class', 'axis axis-time')
//   .call(timeAxis);

// group
//   .append('g')
//   .attr('class', 'axis axis-money')
//   .call(moneyAxis);

// // remove the path describing the axes
// d3
//   .selectAll('.axis')
//   .select('path')
//   .remove();

// // style the ticks to be shorter
// d3
//   .select('.axis-time')
//   .selectAll('line')
//   .attr('y2', 5);

// d3
//   .select('.axis-money')
//   .selectAll('line')
//   .attr('x2', -4);

// d3
//   .selectAll('.axis')
//   .selectAll('text')
//   .attr('font-size', '0.55rem');

// // grid
// // include dotted lines for each tick and for both axes
// d3
//   .select('.axis-time')
//   .selectAll('g.tick')
//   .append('path')
//   .attr('d', `M 0 0 v -${height}`)
//   .attr('stroke', 'currentColor')
//   .attr('stroke-width', 1)
//   .attr('stroke-dasharray', '2')
//   .attr('opacity', 0.3);

// d3
//   .select('.axis-money')
//   .selectAll('g.tick')
//   .append('path')
//   .attr('d', `M 0 0 h ${width}`)
//   .attr('stroke', 'currentColor')
//   .attr('stroke-width', 1)
//   .attr('stroke-dasharray', '2')
//   .attr('opacity', 0.3);


// // labels
// // add a group to position the label where needed
// // for the money label, this allows to also modify the transform-origin as to rotate the label from the center of the axis
// d3
//   .select('.axis-time')
//   .append('g')
//   .attr('class', 'label label-time')
//   .attr('transform', `translate(${width / 2} ${margin.bottom})`);

// d3
//   .select('g.label-time')
//   .append('text')
//   .attr('x', 0)
//   .attr('y', 0)
//   .text('Time')
//   .attr('text-anchor', 'middle');

// d3
//   .select('.axis-money')
//   .append('g')
//   .attr('class', 'label label-money')
//   .attr('transform', `translate(-${margin.left} ${height / 2})`);

// d3
//   .select('g.label-money')
//   .append('text')
//   .attr('x', 0)
//   .attr('y', 0)
//   .text('Cost')
//   .attr('text-anchor', 'middle')
//   .attr('dominant-baseline', 'hanging')
//   .attr('transform', 'rotate(-90)');

// // style both labels with a heavier weight
// d3
//   .selectAll('g.label text')
//   .style('font-size', '0.65rem')
//   .style('font-weight', '600')
//   .style('letter-spacing', '0.05rem');


// // data points
// // add a group for each data point, to group circle and text elements
// const dataGroup = group
//   .append('g')
//   .attr('class', 'data');

// const dataPointsGroup = dataGroup
//   .selectAll('g.data-point')
//   .data(routines)
//   .enter()
//   .append('g')
//   .attr('class', 'data-point')
//   .attr('transform', ({ time, money }) => `translate(${timeScale(time)} ${moneyScale(money)})`);

// // circles using the defined color
// dataPointsGroup
//   .append('circle')
//   .attr('cx', 0)
//   .attr('cy', 0)
//   .attr('r', 5)
//   .attr('fill', 'black');

// // labels describing the circle elements
// dataPointsGroup
//   .append('text')
//   .attr('x', 8)
//   .attr('y', 0)
//   .attr('class', 'name')
//   .text(({ name }, i) => `${name} ${i}`)
//   .attr('dominant-baseline', 'central')
//   .style('font-size', '0.55rem')
//   .style('letter-spacing', '0.05rem')
//   .style('pointer-events', 'none');
