// Average energy consumption by screen technology — bar chart
// (replaces previous donut/pie chart which implied composition rather than comparison)
d3.csv("data/tv-tech-donut.csv").then(function (data) {
  data.forEach((d) => (d.avgEnergy = +d.avgEnergy));

  const marginD = { top: 40, right: 40, bottom: 60, left: 80 };
  const widthD = 800 - marginD.left - marginD.right;
  const heightD = 440 - marginD.top - marginD.bottom;

  const svg = d3
    .select("#donut-chart")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${widthD + marginD.left + marginD.right} ${heightD + marginD.top + marginD.bottom}`,
    )
    .append("g")
    .attr("transform", `translate(${marginD.left},${marginD.top})`);

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.screenTech))
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.screenTech))
    .range([0, widthD])
    .padding(0.35);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.avgEnergy) * 1.15])
    .range([heightD, 0]);

  // X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${heightD})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "14px");

  // Y axis
  svg.append("g").call(d3.axisLeft(y).ticks(6));

  // Y axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -heightD / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Energy Consumption (kWh/year)");

  // Bars
  svg
    .selectAll(".tech-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "tech-bar")
    .attr("x", (d) => x(d.screenTech))
    .attr("y", (d) => y(d.avgEnergy))
    .attr("width", x.bandwidth())
    .attr("height", (d) => heightD - y(d.avgEnergy))
    .attr("fill", (d) => color(d.screenTech))
    .attr("rx", 4)
    .style("opacity", 0.85)
    .on("mouseover", function (e, d) {
      d3.select(this).style("opacity", 1);
      showTooltip(
        `<strong>${d.screenTech}</strong><br>Avg: ${d.avgEnergy} kWh/year`,
        e,
      );
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", function () {
      d3.select(this).style("opacity", 0.85);
      hideTooltip();
    });

  // Value labels above bars
  svg
    .selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d) => x(d.screenTech) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.avgEnergy) - 8)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "600")
    .style("fill", "#333")
    .text((d) => `${d.avgEnergy} kWh`);
});
