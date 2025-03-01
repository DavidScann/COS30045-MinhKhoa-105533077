let tooltip;

function createTooltip() {
  // Step 3.2 Append tooltip to innerChart
  tooltip = innerChartS
    .append("g")
    .style("opacity", 0)
    .attr("pointer-events", "none"); // Ensure the tooltip doesn't interfere with mouse events

  // Step 3.3 Append tool tip background rectangle
  tooltip
    .append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("fill", "steelblue")
    .attr("rx", 5)
    .attr("ry", 5)
    .style("opacity", 0.9);

  // Step 3.4 Append tooltip text
  // We'll use two lines of text to show Brand/Model and Screen Size
  tooltip
    .append("text")
    .attr("class", "tooltip-text-brand")
    .attr("x", 10)
    .attr("y", 16)
    .attr("fill", "white")
    .style("font-size", "11px");

  tooltip
    .append("text")
    .attr("class", "tooltip-text-size")
    .attr("x", 10)
    .attr("y", 32)
    .attr("fill", "white")
    .style("font-size", "11px");
}

// Step 3.5 & 3.8 Add function to react to mouse events
function handleMouseEvents(e, d, type) {
  if (type === "enter") {
    console.log("Mouse enter:", d);

    // Select the tooltip text and give it information
    tooltip.select(".tooltip-text-brand").text(`${d.brand} - ${d.model}`);

    tooltip.select(".tooltip-text-size").text(`Size: ${d.screenSize}"`);

    // Use information from e to position tool tip relative to circle centre
    const cx = +e.target.getAttribute("cx");
    const cy = +e.target.getAttribute("cy");

    // Make appearance smooth and set opacity to 1
    tooltip
      .attr("transform", `translate(${cx + 10}, ${cy - tooltipHeight - 10})`)
      .transition()
      .duration(200)
      .style("opacity", 1);

    // Optional: highlight the selected circle
    d3.select(e.target)
      .transition()
      .duration(200)
      .attr("r", 8)
      .style("opacity", 1);
  } else if (type === "leave") {
    console.log("Mouse leave:", d);

    // Make tool tip transparent and move it away
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
      .attr("transform", `translate(-1000, -1000)`);

    // Restore circle state
    d3.select(e.target)
      .transition()
      .duration(200)
      .attr("r", 5)
      .style("opacity", 0.5);
  }
}
