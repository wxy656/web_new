/**
 * Created by ThinkPad on 2016/4/18.
 */
"use strict";
let schedule = require("node-schedule");

var date = new Date(2016,4,14,15,40,0);

var j = schedule.scheduleJob(date, function(){

    console.log("Ö´ÐÐÈÎÎñ");

});