/**
 * Created by ThinkPad on 2016/4/20.
 */
/**
 * Created by ThinkPad on 2016/4/20.
 */
"use strict";
let koa = require('koa');
let logger = require('koa-logger');
let route = require('koa-route');
let bodyParser = require('co-body');
let views = require('co-views');
let serve = require('koa-static');
let _ = require('lodash');
let mongoose = require('mongoose');

let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});


let daySummaryController = require('./day_summary/controller');
let dingshitask = require('./analysis/cal_everydayData').dingshi;
let songlistRadioController = require('./everyday_details/s_rController');
let userListController = require('./everyday_details/userListController');
let userLogControlle = require('./userInfo/userLogController');

let backcallControlle=require('./spotify/backcall');
let spotifyControlle=require('./spotify/controller');



// routes
var app=koa();
app.use(logger());
app.use(route.get('/day_summary/',daySummaryController.day_summary));
app.use(route.get('/songlistRadio/',songlistRadioController.songlistRadio));
app.use(route.get('/userList/',userListController.userList));
app.use(route.get('/user_log/',userLogControlle.userLog));

app.use(route.post('/zhuxingtu/',zhuxingtu));
app.use(route.get('/zhuxingtu/',zhuxingtu));
app.use(route.get('/qudaoTest/',qudaoTest));

app.use(route.get('/backcall/',backcallControlle.backcall));
app.use(route.get('/songFeature/',spotifyControlle.getfeature));
app.use(route.get('/songSearch/',spotifyControlle.search));

app.use(serve(__dirname + "/public"));

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


var db_qudaoTest =mongoose.createConnection("mongodb://localhost/search_record")
var qudaoTest_Schema = new mongoose.Schema({
    device:String ,  qudao: String, date:Date
});
var qudaoTest_Model=db_qudaoTest.model('qudao_records', qudaoTest_Schema,'qudao_records');
function *qudaoTest(req,res,next){
    this.querystring.toString().split("&");
    let querydata={};
    _.map(this.querystring.toString().split("&"),function(data){
        querydata[data.split("=")[0]]=data.split("=")[1]
    });
    let device=querydata.device || "ios"
    console.log(querydata.device)
    if (device=="android"){
        let url="http://o7gvbz759.bkt.clouddn.com/paohaile-"+querydata.qudao+"-release.apk";
        yield new qudaoTest_Model({
            "date": new Date(),
            "device": "android",
            "qudao": querydata.qudao
        }).save();
        this.body=yield render('browse',{"tourl":url})
        //http://o7gvbz759.bkt.clouddn.com/paohaile-fensitong1-release.apk
    }else{
        let url="http://um0.cn/"+querydata.qudao;
        yield new qudaoTest_Model({
            "date": new Date(),
            "device": "ios",
            "qudao": querydata.qudao
        }).save();
        this.body=yield render('browse',{"tourl":url})
    }



}

function *temp_huwei(req,res,next){
        this.body = yield render('index')
}

app.listen(8030);
console.log('listening on port 8030');