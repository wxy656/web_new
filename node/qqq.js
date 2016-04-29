/**
 * Created by ThinkPad on 2016/4/18.
 */
"use strict";
let _=require("lodash")
let results=[{user:"dd","count":1,"gte20":1},{user:"dd","count":1,"gte20":3},{user:"dd","count":1,"gte20":2}]
results=_.sortBy(results, function(o) { return o.gte20; });
console.log(results.reverse())