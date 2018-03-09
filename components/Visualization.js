/*
 * Copyright (C) Zoomdata, Inc. 2012-2018. All rights reserved.
 */
/* global controller */

//Works with Grouped variables (remove if using UnGrouped)
controller.createAxisLabel({
    picks: 'Group By', // Variable Name
    orientation: 'horizontal',
    position: 'bottom',
    popoverTitle: 'Group'
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


controller.update = function(data, progress) {
    // Called when new data arrives

    // Stop update if Google chart package hasn't finished loading yet.
    if (!googleLoaded) return;

    // Print out data object when the chart receives it.
    console.log("UPDATE!");
    console.log("data:", data);
    console.log("progress:", progress);
};

controller.resize = function(width, height, size) {
    // Called when the widget is resized

    // Print out resize info when resize is called.
    console.log("RESIZE!");
    console.log("width:", width, " - height:", height, " - size:", size);
};