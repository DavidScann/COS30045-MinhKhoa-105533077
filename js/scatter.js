d3.csv("data/tv-scatter.csv").then(function(data) {
    // Parse values
    data.forEach(d => {
        d.energyConsumption = +d.energyConsumption;
        d.star = +d.star;
    });

    // Dimensions
    const container = document.getElementById('scatter-chart');
    const margin = {top: 20, right: 20, bottom: 50, left: 50},
          width = 800 || 500 - margin.left - margin.right,
          height = 500 || 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatter-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis: Star Rating
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.star) * 1.1])
      .range([0, width]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", height + 40)
      .attr("class", "axis-label")
      .text("Star Rating");

    // Y axis: Energy Consumption
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energyConsumption) * 1.1])
      .range([height, 0]);
      
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .attr("y", -35)
      .attr("class", "axis-label")
      .text("Energy Consumption");

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", d => x(d.star))
        .attr("cy", d => y(d.energyConsumption))
        .attr("r", 3)
        .style("fill", "#69b3a2")
        .style("opacity", 0.6);
        
    // Responsiveness
    window.addEventListener("resize", () => {
        // SVG viewbox scaling handles most resizing implicitly
    });
});
