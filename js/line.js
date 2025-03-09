d3.csv("data/electricity-prices.csv").then(function(data) {
    data.forEach(d => {
        d.year = d3.timeParse("%Y")(d.year);
        d.price = +d.price;
    });

    const container = document.getElementById('line-chart');
    const margin = {top: 20, right: 20, bottom: 40, left: 50},
          width = 800 || 500 - margin.left - margin.right,
          height = 500 || 400 - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.year))
      .range([0, width]);
      
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price) * 1.1])
      .range([height, 0]);
      
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .attr("y", -35)
      .attr("class", "axis-label")
      .text("Price");

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => x(d.year))
        .y(d => y(d.price))
      );
});
