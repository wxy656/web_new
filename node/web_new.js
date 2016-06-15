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
let xlsx=require("node-xlsx");//excel
let bodyParse =require('co-busboy');//excel
var fs = require("fs");//excel

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

//temp route
app.use(route.post('/zhuxingtu/',zhuxingtu));
app.use(route.get('/zhuxingtu/',zhuxingtu));
app.use(route.get('/qudaoTest/',qudaoTest));
app.use(route.get('/qudaoTest2/',qudaoTest2));
app.use(route.get('/temp_huwei/',temp_huwei));
app.use(route.get('/excel/',excel));
app.use(route.post('/excel/',excel));
app.use(route.get('/excel1/',excel1));

//spotify
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


function *excel(req,res,next){
    if (this.request.method=="GET"){
        this.body=  yield render('excel',{})
    }else {
        let date=new Date().getTime();
        let name="public/file/"+date+".xlsx";
         let parts =bodyParse(this,{
             autoFields: true
         });
         let part;
         //fs.unlink(name, function(){
         //    console.log(' delete success');
         //});
         while (part = yield parts) {
             var stream = fs.createWriteStream(name);
             part.pipe(stream);
             part.on('end', function *() {
                 writeStream.end()
                 console.log('uploading %s -> %s', part.filename, stream.path);
             });
         }
         this.body=yield render('excel2',{url:"http://localhost:8030/excel1?date="+date})
    }
}

function *excel1(req,res,next){
    this.querystring.toString().split("&");
    let querydata={};
    _.map(this.querystring.toString().split("&"),function(data){
        querydata[data.split("=")[0]]=data.split("=")[1]
    });

    let name="public/file/"+querydata.date+".xlsx";
    console.log(name)
    let list = xlsx.parse(name);
    let sheet1 = list[0].data;
    this.body = yield render('excel1', {
        "Num": sheet1.length,
        "data": sheet1.slice(1, sheet1.length),
        "head": sheet1.slice(0, 1)
    })
}

var db_qudaoTest =mongoose.createConnection("mongodb://localhost/search_record")
var qudaoTest_Schema = new mongoose.Schema({
    device:String ,  qudao: String, date:Date,version:Number
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
        let url="http://o7gvbz759.bkt.clouddn.com/paohaile-"+querydata.qudao+"-release.apk"+"?q="+new Date().getTime();
        yield new qudaoTest_Model({
            "date": new Date(),
            "device": "android",
            "qudao": querydata.qudao
        }).save();
        this.body=yield render('browse',{"tourl":url})
        //http://o7gvbz759.bkt.clouddn.com/paohaile-fensitong1-release.apk
    }else{
        let url="http://um0.cn/"+querydata.qudao+"?q="+new Date().getTime();
        yield new qudaoTest_Model({
            "date": new Date(),
            "device": "ios",
            "qudao": querydata.qudao
        }).save();
        this.body=yield render('browse',{"tourl":url})
    }



}
function *qudaoTest2(req,res,next){
    this.querystring.toString().split("&");
    let querydata={};
    _.map(this.querystring.toString().split("&"),function(data){
        querydata[data.split("=")[0]]=data.split("=")[1]
    });
    let device=querydata.device || "ios"
    console.log(querydata.device)
    if (device=="android"){
        let url="http://o7gvbz759.bkt.clouddn.com/paohaile-"+querydata.qudao+"-release.apk"+"?q="+new Date().getTime();
        yield new qudaoTest_Model({
            "date": new Date(),
            "device": "android",
            "qudao": querydata.qudao.constructor,
            "version":1
        }).save();
        this.body=yield render('bbbb',{"tourl":url})
        //http://o7gvbz759.bkt.clouddn.com/paohaile-fensitong1-release.apk
    }else{
        let url="http://um0.cn/"+querydata.qudao+"?q="+new Date().getTime();
        yield new qudaoTest_Model({
            "date": new Date(),
            "device": "ios",
            "qudao": querydata.qudao,
            "version":1
        }).save();
        this.body=yield render('bbbb',{"tourl":url})
    }



}

function *temp_huwei(req,res,next){
    this.querystring.toString().split("&");
    let querydata={};
    _.map(this.querystring.toString().split("&"),function(data){
        querydata[data.split("=")[0]]=data.split("=")[1]
    });
    let yemian= querydata.yemian || "index" ;
    this.body = yield render(yemian)
}

app.listen(8030);
console.log('listening on port 8030');