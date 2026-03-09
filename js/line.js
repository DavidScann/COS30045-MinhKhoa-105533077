// Electricity spot price trend — line chart
d3.csv("data/electricity-prices.csv").then(function (data) {
  data.forEach((d) => {
    d.year = d3.timeParse("%Y")(d.year);
    d.price = +d.price;
  });

  const marginL = { top: 40, right: 40, bottom: 60, left: 70 };
  const widthL = 800 - marginL.left - marginL.right;
  const heightL = 440 - marginL.top - marginL.bottom;

  const svg = d3
    .select("#line-chart")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${widthL + marginL.left + marginL.right} ${heightL + marginL.top + marginL.bottom}`,
    )
    .append("g")
    .attr("transform", `translate(${marginL.left},${marginL.top})`);

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, widthL]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.price) * 1.15])
    .range([heightL, 0]);

  // Axes
  svg
    .append("g")
    .attr("transform", `translate(0,${heightL})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(d3.timeYear.every(3))
        .tickFormat(d3.timeFormat("%Y")),
    );

  svg.append("g").call(d3.axisLeft(y));

  // Axis labels
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", widthL / 2)
    .attr("y", heightL + 48)
    .style("font-size", "12px")
    .text("Year");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -heightL / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Electricity Price (c/kWh)");

  // Line path
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.year))
        .y((d) => y(d.price)),
    );

  // Circles for hover
  svg
    .selectAll(".price-dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "price-dot")
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.price))
    .attr("r", 4)
    .attr("fill", "steelblue")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .style("opacity", 0.8)
    .on("mouseover", function (e, d) {
      d3.select(this).attr("r", 7).style("opacity", 1);
      showTooltip(
        `<strong>${d3.timeFormat("%Y")(d.year)}</strong><br>${d.price}c / kWh`,
        e,
      );
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", function () {
      d3.select(this).attr("r", 4).style("opacity", 0.8);
      hideTooltip();
    });
});
