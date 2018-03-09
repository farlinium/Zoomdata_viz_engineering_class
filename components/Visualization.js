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

controller.update = function(data, progress) {
    // Called when new data arrives
};

controller.resize = function(width, height, size) {
    // Called when the widget is resized
};
