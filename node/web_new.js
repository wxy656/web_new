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
let dingshitask = require('./analysis/cal_everydayData').dingshi;
let songlistRadioController = require('./everyday_details/s_rController');
let userListController = require('./everyday_details/userListController');
let userLogControlle = require('./userInfo/userLogController');



// routes
var app=koa();
app.use(logger());
app.use(route.get('/day_summary/',daySummaryController.day_summary));
app.use(route.get('/songlistRadio/',songlistRadioController.songlistRadio));
app.use(route.get('/userList/',userListController.userList));
app.use(route.get('/userLog/',userLogControlle.userLog));


app.listen(8030)
console.log('listening on port 8030')