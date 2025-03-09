d3.csv("data/tv-tech-donut.csv").then(function(data) {
    data.forEach(d => d.avgEnergy = +d.avgEnergy);

    const margin = 40, width = 800, height = 500;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#donut-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.screenTech))
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]); // LED, LCD, OLED standard categorical colors

    const pie = d3.pie().value(d => d.avgEnergy).sort(null);
    const data_ready = pie(data);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Draw slices
    svg.selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.screenTech))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.9)
      .on("mouseover", function(e, d) { 
          d3.select(this).style("opacity", 0.6); 
          showTooltip(`<strong>${d.data.screenTech}</strong><br>${d.data.avgEnergy} kWh (Avg)`, e); 
      })
      .on("mousemove", moveTooltip)
      .on("mouseout", function() { 
          d3.select(this).style("opacity", 0.9); 
          hideTooltip(); 
      });

    // Draw Labels directly inside the arcs so they are readable and large
    svg.selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text(d => d.data.screenTech)
        .attr("transform", function(d) { return `translate(${arc.centroid(d)})`;  })
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "white");
});
