
// Create SVG container for histogram if not already existing
d3.select("#histogram").selectAll("*").remove();

const marginH = { top: 20, right: 30, bottom: 40, left: 60 };
const widthH = 800 - marginH.left - marginH.right;
const heightH = 500 - marginH.top - marginH.bottom;

const innerChartH = d3
  .select("#histogram")
  .append("svg")
  .attr("viewBox", `0 0 ${widthH + marginH.left + marginH.right} ${heightH + marginH.top + marginH.bottom}`)
  .append("g")
  .attr("transform", `translate(${marginH.left},${marginH.top})`);

const xScaleH = d3.scaleLinear().range([0, widthH]);
const yScaleH = d3.scaleLinear().range([heightH, 0]);

const xAxisGroup = innerChartH.append("g").attr("transform", `translate(0,${heightH})`);
const yAxisGroup = innerChartH.append("g");

// Add labels
innerChartH.append("text")
  .attr("x", widthH)
  .attr("y", heightH + marginH.bottom - 5)
  .attr("text-anchor", "end")
  .style("font-size", "12px")
  .text("Labeled Energy Consumption (kWh/year)");

innerChartH.append("text")
  .attr("x", 0)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text("Frequency");

let fullData = [];

function initHistogram(data) {
  fullData = data.filter(d => d.energyConsumption < 1800); // Filter out outliers as per instructions
  
  // Set X domain once based on full data (0 to 1800 based on image)
  xScaleH.domain([0, 1800]);
  xAxisGroup.call(d3.axisBottom(xScaleH).ticks(9));

  // Set up button listeners
  d3.selectAll(".filter-btn").on("click", function(e) {
    const tech = d3.select(this).attr("data-tech");
    
    // Update active class
    d3.selectAll(".filter-btn").classed("active", false);
    d3.selectAll(".filter-btn").style("background-color", "#d35400"); // reset
    
    d3.select(this).classed("active", true);
    d3.select(this).style("background-color", "#f39c12"); // highlight
    
    // Filter and redraw
    updateHistogram(tech);
  });
  
  // Initial draw
  updateHistogram("All");
}

function updateHistogram(techFilter) {
  // Filter data
  const filteredData = techFilter === "All" 
    ? fullData 
    : fullData.filter(d => d.screenTech === techFilter);

  // Generate bins
  const histogram = d3.histogram()
    .value(d => d.energyConsumption)
    .domain(xScaleH.domain())
    .thresholds(xScaleH.ticks(9)); // ~200 bins as per image

  const bins = histogram(filteredData);

  // Update Y scale
  yScaleH.domain([0, d3.max(bins, d => d.length) || 0]);
  yAxisGroup.transition().duration(500).call(d3.axisLeft(yScaleH));

  // Bind data
  const rects = innerChartH.selectAll("rect.bar").data(bins);

  // Remove old rects
  rects.exit()
    .transition().duration(500)
    .attr("height", 0)
    .attr("y", heightH)
    .remove();

  // Update existing rects
  rects.transition().duration(500)
    .attr("x", d => xScaleH(d.x0) + 1)
    .attr("width", d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 2)) // subtract 2 for gap
    .attr("y", d => yScaleH(d.length))
    .attr("height", d => heightH - yScaleH(d.length));

  // Add new rects
  rects.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScaleH(d.x0) + 1)
    .attr("width", d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 2))
    .attr("y", heightH)
    .attr("height", 0)
    .style("fill", "#666b6c") // Exact grey color from the image
    .on("mouseover", function(e, d) { 
      d3.select(this).style("fill", "var(--brand, #0b5fff)"); 
      showTooltip(`<strong>Energy: ${d.x0} - ${d.x1} kWh</strong><br>Frequency: ${d.length}`, e); 
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", function() { 
      d3.select(this).style("fill", "#666b6c"); 
      hideTooltip(); 
    })
    .transition().duration(500)
    .attr("y", d => yScaleH(d.length))
    .attr("height", d => heightH - yScaleH(d.length));
}
