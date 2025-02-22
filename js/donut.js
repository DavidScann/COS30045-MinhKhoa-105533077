d3.csv("data/tv-tech-donut.csv").then(function(data) {
    // Parse values
    data.forEach(d => {
        d.avgEnergy = +d.avgEnergy;
    });

    const container = document.getElementById('donut-chart');
    const margin = 20,
          width = container.clientWidth || 500,
          height = container.clientHeight || 400;
    
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#donut-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.screenTech))
      .range(d3.schemeSet2);

    const pie = d3.pie()
      .value(d => d.avgEnergy)
      .sort(null);

    const data_ready = pie(data);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.screenTech))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.8);

    svg.selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text(d => d.data.screenTech)
        .attr('transform', function(d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end');
        })
        .style("font-size", "12px");
});
