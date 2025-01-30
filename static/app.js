function loadMetadata(sampleID) {
  // Fetch metadata and update the information panel
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadataList = data.metadata;
    let sampleData = metadataList.find(entry => entry.id == sampleID);
    
    let infoPanel = d3.select("#sample-metadata");
    infoPanel.html(""); // Clear previous content
    
    // Add each metadata entry as a separate line in the panel
    Object.entries(sampleData).forEach(([key, value]) => {
      infoPanel.append("h6").text(`${key}: ${value}`);
    });
  });
}

function generateCharts(sampleID) {
  // Fetch sample data and generate bar and bubble charts
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let allSamples = data.samples;
    let chosenSample = allSamples.find(entry => entry.id == sampleID);
    
    // Prepare data for the bar chart (top 10 bacterial species)
    let bacteriaIDs = chosenSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let bacteriaCounts = chosenSample.sample_values.slice(0, 10).reverse();
    let bacteriaLabels = chosenSample.otu_labels.slice(0, 10).reverse();
    
    let barConfig = [{
      x: bacteriaCounts,
      y: bacteriaIDs,
      text: bacteriaLabels,
      type: "bar",
      orientation: "h"
    }];
    
    let barOptions = {
      title: "Top 10 Bacterial Species",
      xaxis: { title: "Bacteria Count" },
      yaxis: { title: "Bacteria ID" }
    };
    
    Plotly.newPlot("bar", barConfig, barOptions);
    
    // Prepare data for the bubble chart (overall bacterial composition)
    let bubbleConfig = [{
      x: chosenSample.otu_ids,
      y: chosenSample.sample_values,
      text: chosenSample.otu_labels,
      mode: "markers",
      marker: {
        size: chosenSample.sample_values,
        color: chosenSample.otu_ids
      }
    }];
    
    let bubbleOptions = {
      title: "Bacterial Composition per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bacteria Count" },
      showlegend: false
    };
    
    Plotly.newPlot("bubble", bubbleConfig, bubbleOptions);
  });
}

function initialize() {
  // Initialize the dashboard by populating the dropdown and rendering default charts
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleIDs = data.names;
    let dropdown = d3.select("#selDataset");
    
    // Populate the dropdown menu with available sample IDs
    sampleIDs.forEach((id) => {
      dropdown.append("option").text(id).property("value", id);
    });
    
    // Load default sample data (first sample in the list)
    let initialSample = sampleIDs[0];
    generateCharts(initialSample);
    loadMetadata(initialSample);
  });
}

function updateDashboard(selectedSample) {
  // Update the charts and metadata when a new sample is selected
  generateCharts(selectedSample);
  loadMetadata(selectedSample);
}

// Event listener for dropdown selection change
d3.select("#selDataset").on("change", function() {
  let newSample = d3.select(this).property("value");
  updateDashboard(newSample);
});

// Initialize the dashboard on page load
initialize();
