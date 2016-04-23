/**
 * Created by ThinkPad on 2016/4/20.
 */
/**
 * Created by ThinkPad on 2016/4/20.
 */
"use strict"
let koa = require('koa');
let logger = require('koa-logger');
let route = require('koa-route');
let bodyParser = require('co-body');
let views = require('co-views');
let serve = require('koa-static');

let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});

let daySummaryController = require('./day_summary/controller');
let dingshitask=require('./analysis/cal_everydayData').dingshi;



// routes
var app=koa();
app.use(logger());
app.use(route.get('/day_summary/',daySummaryController.day_summary));
app.listen(8040)
console.log('listening on port 8040')