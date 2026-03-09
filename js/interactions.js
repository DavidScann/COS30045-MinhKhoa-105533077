// createTooltip is a no-op — the global HTML tooltip in global-tooltip.js handles all tooltips now.
function createTooltip() {
  // Previously appended an SVG tooltip to innerChartS.
  // All tooltip rendering is now handled by showTooltip / moveTooltip / hideTooltip
  // defined in global-tooltip.js.
}

// handleMouseEvents is kept for reference but is no longer called by scatterplot.js.
// scatterplot.js uses showTooltip/hideTooltip directly.
function handleMouseEvents(e, d, type) {
  if (type === "enter") {
    showTooltip(
      `<strong>${d.brand} - ${d.model}</strong><br>Size: ${d.screenSize}"`,
      e,
    );
  } else if (type === "leave") {
    hideTooltip();
  }
}
