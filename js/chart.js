// Set up D3 chart
const createBarChart = (data) => {
  const container = d3.select("#bar-chart-container");
  
  // Set dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 20, left: 150 };

  const svg = container.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("border", "1px solid #eee")
    .style("background", "#fff")
    .style("border-radius", "8px");

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, chartWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, chartHeight])
    .padding(0.2);

  // Bind data to groups
  const barAndLabel = chart.selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // Draw rectangles
  barAndLabel.append("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "var(--brand, #0b5fff)")
    .attr("rx", 4) // rounded corners
    .attr("ry", 4)
    .on("mouseover", function(e, d) { d3.select(this).attr("opacity", 0.7); showTooltip(`<strong>${d.brand.toUpperCase()}</strong><br>${d.count} models`, e); })
    .on("mousemove", moveTooltip)
    .on("mouseout", function() { d3.select(this).attr("opacity", 1); hideTooltip(); });

  // Add brand labels
  barAndLabel.append("text")
    .text(d => d.brand.charAt(0).toUpperCase() + d.brand.slice(1)) // capitalize
    .attr("x", -10)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em") // center vertically
    .attr("text-anchor", "end")
    .style("font-family", "system-ui, sans-serif")
    .style("font-size", "14px")
    .style("fill", "var(--text, #1a1a1a)");

  // Add count labels
  barAndLabel.append("text")
    .text(d => d.count)
    .attr("x", d => xScale(d.count) + 5)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em") // center vertically
    .style("font-family", "system-ui, sans-serif")
    .style("font-size", "13px")
    .style("font-weight", "500")
    .style("fill", "var(--muted, #666666)");
};

// Load data
d3.csv("data/tv-brand-count.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
}).then(data => {
  console.log(data);
  console.log("Length:", data.length);
  console.log("Max:", d3.max(data, d => d.count));
  console.log("Min:", d3.min(data, d => d.count));
  console.log("Extent:", d3.extent(data, d => d.count));
  
  // Sort data from largest to smallest
  data.sort((a, b) => b.count - a.count);

  createBarChart(data);
});
