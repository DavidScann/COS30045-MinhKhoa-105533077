
function drawScatterplot(data) {
  // Add labels to SVG if not already there
  const chartHeight = height + margin.top + margin.bottom;
  const chartWidth = width + margin.left + margin.right;
  
  // Create SVG dynamically with viewBox for responsiveness
  d3.select("#scatterplot").selectAll("*").remove();
  
  const innerChartS = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScaleS = d3.scaleLinear()
    .domain([0, 8.5]) // Based on the screenshot x-axis (0 to 8 Star Rating)
    .range([0, width]);
    
  const yScaleS = d3.scaleLinear()
    .domain([0, 2700]) // Based on the screenshot y-axis
    .range([height, 0]);

  const colorScale = d3.scaleOrdinal()
    .domain(["LED", "LCD", "OLED"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  // Add dots
  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScaleS(d.star))
    .attr("cy", (d) => yScaleS(d.energyConsumption))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(d.screenTech))
    .style("opacity", 0.7)
    .on("mouseover", function(e, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 8)
          .style("opacity", 1)
          .attr("stroke", "#333")
          .attr("stroke-width", 2);
          
        // Show tooltip exactly like the screenshot with the energy size box
        showTooltip(`<strong>${d.energyConsumption}</strong><br>Size: ${d.screenSize}"<br>${d.brand.toUpperCase()}`, e);
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", function(e, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .style("opacity", 0.7)
          .attr("stroke", "none");
        hideTooltip();
    });

  // Add Axes
  innerChartS
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleS));

  innerChartS
    .append("g")
    .call(d3.axisLeft(yScaleS));

  // Add Axis Labels
  innerChartS
    .append("text")
    .attr("x", width)
    .attr("y", height + 35)
    .attr("text-anchor", "end")
    .style("font-size", "12px")
    .text("Star Rating");

  innerChartS
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Labeled Energy Consumption (kWh/year)");
    
  // Add Legend
  const legend = innerChartS.append("g")
    .attr("transform", `translate(${width - 100}, 20)`);
    
  const techs = ["LED", "LCD", "OLED"];
  
  techs.forEach((tech, i) => {
    const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    
    legendRow.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale(tech));
      
    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .text(tech)
      .style("font-size", "12px")
      .style("font-family", "sans-serif");
  });
}
