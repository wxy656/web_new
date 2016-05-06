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
app.use(route.get('/user_log/',userLogControlle.userLog));

app.use(route.post('/zhuxingtu/',zhuxingtu))
app.use(route.get('/zhuxingtu/',zhuxingtu))


//临时放在这里的路由
function *zhuxingtu(req,res,next){
    if (this.request.method=="GET"){
        this.body = yield render('zhuxingtu',{"tempo": [120,170,172,125],"color":['#C2C2C2', '#676767','#3a3a3a','#C2C2C2'],"index":[1,2,3,4]})
    }else{
        var form= yield bodyParser.form(this);
        //console.log(form)
        var reshen=form.reshen.split(" ");
        var tisu=form.tisu.split(" ");
        var jiangsu=form.jiangsu.split(" ");
        var shuzhan=form.shuzhan.split(" ");


        var index=[]
        var color=[]
        var tempo=reshen.concat(tisu).concat(jiangsu).concat(shuzhan)

        for (var i=0;i<reshen.length;i++){
            color.push( form.color1)
        }
        for (var i=0;i<tisu.length;i++){
            color.push( form.color2)
        }
        for (var i=0;i<jiangsu.length;i++){
            color.push( form.color3)
        }
        for (var i=0;i<shuzhan.length;i++){
            color.push( form.color4)
        }
        for (var i=0;i<tempo.length;i++){
            index.push(i)
        }
        this.body = yield render('zhuxingtu',{"tempo": tempo,"color":color,"index":index})
    }


}

app.listen(8030)
console.log('listening on port 8030')