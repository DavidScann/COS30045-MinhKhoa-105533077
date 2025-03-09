d3.csv("data/tv-55inch-bar.csv").then(function(data) {
    data.forEach(d => {
        d.count = +d.count;
    });

    const container = document.getElementById('bar-chart');
    const margin = {top: 20, right: 20, bottom: 40, left: 50},
          width = 800 || 500 - margin.left - margin.right,
          height = 500 || 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.screenTech))
      .padding(0.2);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .attr("y", -35)
      .attr("class", "axis-label")
      .text("Number of TVs");

    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", d => x(d.screenTech))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#69b3a2");
});
