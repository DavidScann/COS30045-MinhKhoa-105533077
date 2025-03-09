const innerChartH = d3
  .select("#histogram")
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xScaleH = d3.scaleLinear().range([0, width]);
const yScaleH = d3.scaleLinear().range([height, 0]);

function drawHistogram(data) {
  const maxEnergy = d3.max(data, (d) => d.screenSize);
  xScaleH.domain([0, maxEnergy * 1.1]);

  const histogram = d3
    .histogram()
    .value((d) => d.screenSize)
    .domain(xScaleH.domain())
    .thresholds(xScaleH.ticks(20));

  const bins = histogram(data);
  yScaleH.domain([0, d3.max(bins, (d) => d.length)]);

  innerChartH
    .selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", 1)
    .attr(
      "transform",
      (d) => `translate(${xScaleH(d.x0)}, ${yScaleH(d.length)})`,
    )
    .attr("width", (d) => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 1))
    .attr("height", (d) => height - yScaleH(d.length))
    .style("fill", "steelblue")
    .on("mouseover", function(e, d) { d3.select(this).style("fill", "var(--brand, #0b5fff)"); showTooltip(`<strong>Size: ${d.x0}" - ${d.x1}"</strong><br>${d.length} TVs`, e); })
    .on("mousemove", moveTooltip)
    .on("mouseout", function() { d3.select(this).style("fill", "steelblue"); hideTooltip(); });

  innerChartH
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleH));

  innerChartH
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Screen Size");

  innerChartH.append("g").call(d3.axisLeft(yScaleH));

  innerChartH
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text("Frequency");
}
