// Shared constants for charts
const margin = { top: 40, right: 120, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Scatterplot specific setup
const innerChartS = d3
  .select("#scatterplot")
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xScaleS = d3.scaleLinear().range([0, width]);
const yScaleS = d3.scaleLinear().range([height, 0]);

// Color scale to identify screen type
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Tooltip dimensions
const tooltipWidth = 140;
const tooltipHeight = 40;
