function drawScatterplot(data) {
  // Set up domains based on data
  const maxStar = d3.max(data, (d) => d.star);
  const maxEnergy = d3.max(data, (d) => d.energyConsumption);

  xScaleS.domain([0, maxStar + 0.5]);
  yScaleS.domain([0, maxEnergy + 50]);

  // Set up colour scale domain
  const screenTechs = Array.from(new Set(data.map((d) => d.screenTech)));
  colorScale.domain(screenTechs);

  // Draw the circles
  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScaleS(d.star))
    .attr("cy", (d) => yScaleS(d.energyConsumption))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(d.screenTech))
    .attr("opacity", 0.5)
    .on("mouseenter", (e, d) => {
      handleMouseEvents(e, d, "enter");
    })
    .on("mouseleave", (e, d) => {
      handleMouseEvents(e, d, "leave");
    });

  // Add bottom axis (X axis)
  innerChartS
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleS));

  // X axis label
  innerChartS
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Star Rating");

  // Add left axis (Y axis)
  innerChartS.append("g").call(d3.axisLeft(yScaleS));

  // Y axis label
  innerChartS
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text("Energy Consumption");

  // Add legend
  const legend = innerChartS
    .append("g")
    .attr("transform", `translate(${width + 20}, 20)`);

  screenTechs.forEach((tech, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

    row
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colorScale(tech))
      .attr("opacity", 0.8);

    row
      .append("text")
      .attr("x", 25)
      .attr("y", 12)
      .text(tech)
      .style("font-size", "14px");
  });
}
