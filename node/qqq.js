/**
 * Created by ThinkPad on 2016/4/18.
 */
"use strict";
let schedule = require("node-schedule");

var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(1, 6)];
console.log(rule.dayOfWeek)