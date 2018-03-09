/*
 * Copyright (C) Zoomdata, Inc. 2012-2018. All rights reserved.
 */

// Axis label for the Group-by
controller.createAxisLabel({
    picks: 'Group By', // Variable Name
    orientation: 'horizontal',
    position: 'bottom',
    popoverTitle: 'Group'
}); 

// Axis label for the wedge size metric (You must add this metric 
// variable using CLI, otherwise the chart won't work).
controller.createAxisLabel({
    picks: 'Metric', 
    orientation: 'horizontal',
    position: 'bottom',
    popoverTitle: 'Metric'
});


// controller.element stores the element where Zoomdata will
// render the chart. controller.element should be treated as read-only.
console.log("Element:", controller.element);

// Set a flag to only do chart updates when Google Charts has loaded
var googleLoaded = false;

// Set flag to true once the charting library is loaded
google.charts.setOnLoadCallback( function() {
    googleLoaded = true;
});

// Load Google Charts
google.charts.load('current', {'packages':['corechart']});

// Global variables to store current data and progress so that
// we can access them in the event of a controller.resize() call.
var resizeData, resizeProgress;

// Add a mouse move event handler to keep track of mouse position for 
// drawing tooltips and the radial menu.
var latestEvent;

document.onmousemove = handleMouseMove;

function handleMouseMove(e) {
    latestEvent = e;
}


controller.update = function(data, progress) {
    // Called when new data arrives

    // Stop update if Google chart package hasn't finished loading yet.
    if (!googleLoaded) return;
    if (typeof data == 'undefined') return;

    // Store current data and progress in the event of a resize
    resizeData = data;
    resizeProgress = progress;

    // Google Charts wants two columns:
    // One each for the pie slice name and the slice size
    var dataForPieChart = [];
    dataForPieChart.push(["wedge","quantity"]);

    // Instead of manually parsing the data object, let's use dataAccessors
    // to get the group and metric that we need to feed our pie chart.

    // Identify the chart variable used for grouping
    var groupAccessor = controller.dataAccessors['Group By'];
    var metricAccessor = controller.dataAccessors['Metric'];

    // Go through each data point and reshape to fit Google Charts format.
    data.forEach( function(datum) {
        var metricName = metricAccessor.raw(datum);
        var groupName = groupAccessor.raw(datum);
        
        // Google charts don't convert null value to string, so we must.        
        var row = [
                    groupName !== null ? groupName : "null / unknown",
                    metricName
        ];
        dataForPieChart.push(row);
    });

    // Feed our data to Google's transform to get Google's internal format.
    var googleDT = google.visualization.arrayToDataTable(dataForPieChart);

    // Go through our dataAccessors and identify the selected color accessor.
    var theColorAccessor;
    for (var accessor in controller.dataAccessors) {
        if (controller.dataAccessors[accessor].isColor) {
            theColorAccessor = controller.dataAccessors[accessor];
        }
    }
    
    // Set our Google Chart formatting options
    var options = {
        // use the color set selected by the user
        colors: theColorAccessor.getColorRange(),
        pieSliceTextStyle: {
            color: 'black',
        },
        tooltip: {trigger:'none'}
    };    

    // Create and render the chart    
    var pieChart = new google.visualization.PieChart(controller.element);
    pieChart.draw(googleDT, options);

    // Add a listener to display the ZD tooltip when a chart element gets moused over.
    google.visualization.events.addListener(pieChart, 'onmouseover', function(e) {
        controller.tooltip.show({
            event:latestEvent,
            data: function() { // Needs to be a function that returns a ZD datum
                return resizeData[e.row];
            }
        })
    });

    // ...and another listener to hide the tooltip when no longer needed
    google.visualization.events.addListener(pieChart, 'onmouseout', function(e) {
        controller.tooltip.hide()
    });

    // Print out data object when the chart receives it.
    // console.log("UPDATE!");
    // console.log("data:", data);
    // console.log("progress:", progress);
};

controller.resize = function(width, height, size) {
    // Called when the widget is resized

    // Turns out, Google Charts infers size from the chart element.
    // What we need to do is call the rendering/drawing logic in 
    // controller.update again, except with the same data as before.
    controller.update(resizeData, resizeProgress);

    // Print out resize info when resize is called.
    // console.log("RESIZE!");
    // console.log("width:", width, " - height:", height, " - size:", size);
};