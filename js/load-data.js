d3.csv("data/Ex6_TVdata.csv")
  .then((data) => {
    // Parse data
    data.forEach((d) => {
      d.energyConsumption = +d.energyConsumption;
      d.star = +d.star;
      d.screenSize = +d.screenSize;
    });

    // Step 1.3 Make sure you call the to be created drawScatterplot in data-load file
    // Step 3 Call the new createTooltip functions in load-data.js
    createTooltip();
    drawScatterplot(data);

    // Draw histogram (assumed from Exercise 6.1 context)
    drawHistogram(data);
  })
  .catch((error) => {
    console.error("Error loading CSV data: ", error);
  });
