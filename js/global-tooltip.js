// Create a global tooltip div
const globalTooltip = d3.select("body")
  .append("div")
  .attr("class", "global-tooltip")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.8)")
  .style("color", "white")
  .style("padding", "8px 12px")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("opacity", 0)
  .style("font-size", "12px")
  .style("z-index", 1000);

function showTooltip(htmlContent, e) {
  globalTooltip.html(htmlContent)
    .style("left", (e.pageX + 15) + "px")
    .style("top", (e.pageY - 28) + "px")
    .transition()
    .duration(200)
    .style("opacity", 1);
}

function moveTooltip(e) {
  globalTooltip
    .style("left", (e.pageX + 15) + "px")
    .style("top", (e.pageY - 28) + "px");
}

function hideTooltip() {
  globalTooltip.transition()
    .duration(200)
    .style("opacity", 0);
}
