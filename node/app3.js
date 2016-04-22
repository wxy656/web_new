/**
 * Created by ThinkPad on 2015/8/12.
 */
// resource
var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var bodyParser = require('co-body');
var views = require('co-views');
var serve = require('koa-static');
;

//var rp = require('request-promise');
//var getImag= require("./analysis/wangyi_imags.js");
var render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});
// routes
var app=koa();
app.use(logger());

app.use(route.get('/day_summary/',day_summary));
app.use(route.get('/users_list/',users_list));
app.use(route.get('/user_log/',user_log))
app.use(route.post('/zhuxingtu/',zhuxingtu))
app.use(route.get('/zhuxingtu/',zhuxingtu))

var mongoose =require("mongoose");
var db =mongoose.createConnection("mongodb://localhost/paohaile")

function *day_summary(req,res,next){
    var dates= this.querystring.toString()
    if (dates=="today" ){
        var today=new Date()
        var time_end=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime()
        var time_start=time_end-604800000
        var stepcount=86400000;
        //var phone_type=""
         }else{
        if (dates.split("&")[2]=="day"){
            var time_start= parseInt(dates.split("&")[0].replace("s=",""));
            var time_end= parseInt(dates.split("&")[1].replace("e=",""))+86400000;
            var stepcount=86400000;
        }else{
            var time_start= parseInt(dates.split("&")[0].replace("s=",""));
            var time_end= parseInt(dates.split("&")[1].replace("e=",""))+604800000;
            var stepcount=604800000;
        }
    }

        //console.log(new Date(time_end))
    //var stepcount=86400000;
    var mongooseSchema3 = new mongoose.Schema({
        duration: Number, user: String, songList: String, matchRate: Number, startedOn:Date, actionType: String,
        distancePlaned:Number,durationPlaned:Number,tempoPlaned:Number,stepCount:Number,songs:[],createdOn:Date,"updatedOn":Date
    });
    var mongooseModel3 = db.model('runlogs', mongooseSchema3,'runlogs');

    var mongooseSchema2 = new mongoose.Schema({
        "date":Date,newUser_all:Number,active_all:Number,openNum_all:Number,all_user_all:Number,newUser_android:Number, active_android:Number,
        openNum_android:Number,all_user_android:Number,newUser_ios:Number,active_ios:Number,openNum_ios:Number,all_user_ios:Number

    });
    var mongooseModel2 = db.model('youmeng', mongooseSchema2,'youmeng');
    datelist=[];
    countlist=[];
    realcountlist=[];
    zhanbilist=[];
    realcount2list=[];
    zhanbi2list=[];
    zhanbi3list=[];
    rihuo=[]

    for (var i =time_start;i<time_end;i+=stepcount){
        var group = {key: {user:1},
            cond: {"startedOn":{"$gte":new Date(i),"$lt":new Date(i+stepcount)}},
            reduce: function(obj,prev) { prev.count+=1;if (obj.duration>=1200){prev.realcount+=1;};if (obj.duration>=600){prev.realcount2+=1;}},
            initial: {count: 0,realcount:0,realcount2:0},
            finalize: {  }
        };
        //datelist.push(new Date(i).getFullYear()+"年"+(new Date(i).getMonth()+1)+"月"+new Date(i).getDate()+"日")
        datelist.push(new Date(i).getFullYear()+"/"+(new Date(i).getMonth()+1)+"/"+new Date(i).getDate())
        dataout=yield new Promise(function(resolve, reject){
            mongooseModel3.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true,function(err, results) {
                //console.log('group results %j', results)
                var realcountNum=0;
                var realcount2Num=0;
                var countNum=results.length;
                for (var i=0;i<countNum;i++){
                 // console.log(results[i])
                    if (results[i]["realcount"]>0){
                         realcountNum++;
                  }
                    if (results[i]["realcount2"]>0){
                        realcount2Num++;
                    }
                }
                var zhanbiNum=(realcountNum/countNum*100).toFixed(2)
                var zhanbi2Num=(realcount2Num/countNum*100).toFixed(2)-zhanbiNum
                //console.log({"countNum":countNum,"realcountNum":realcountNum,"zhanbiNum":zhanbiNum})
                resolve({"countNum":countNum,"realcountNum":realcountNum,"zhanbiNum":zhanbiNum,"realcount2Num":realcount2Num,"zhanbi2Num":zhanbi2Num})
            });
        });

        var rihuolist= yield mongooseModel2.find({"date":{"$gte":new Date(i),"$lt":new Date(i+stepcount)}})
        //console.log(rihuolist)
        var rihuonum=0;
        for (var k=0;k<rihuolist.length;k++){
            rihuonum+= rihuolist[k]["active_all"]
        }
        //console.log(rihuonum)
        rihuo.push(rihuonum)
        countlist.push(dataout["countNum"]-dataout["realcount2Num"]);
        realcount2list.push(dataout["realcount2Num"]-dataout["realcountNum"]);
        realcountlist.push(dataout["realcountNum"]);
        zhanbilist.push(dataout["zhanbiNum"]);
        zhanbi2list.push(dataout["zhanbi2Num"]);
        zhanbi3list.push((dataout["countNum"]/rihuonum*100).toFixed(2));
    };

    //console.log({"datelist":datelist,"countlist":countlist,"realcountlist":realcountlist,"zhanbilist":zhanbilist})
    this.body = yield render('day_summary',{"datelist":datelist,"countlist":countlist,"realcountlist":realcountlist,"zhanbilist":zhanbilist,"realcount2list":realcount2list,"zhanbi2list":zhanbi2list,"rihuo":rihuo,"zhanbi3list":zhanbi3list})
}

function *users_list(req,res,next){
    var canshu=this.querystring.toString()
    var dates= parseInt(canshu.split("&")[0]);
    if (canshu.split("&")[1]=="week"){
        var stepcount=604800000;
    }else{
        var stepcount=86400000;
    }

    var mongooseSchema3 = new mongoose.Schema({
        duration: Number, user: String, songList: String, matchRate: Number, startedOn:Date, actionType: String,
        distancePlaned:Number,durationPlaned:Number,tempoPlaned:Number,stepCount:Number,songs:[],createdOn:Date,"updatedOn":Date
    });
    var mongooseModel3 = db.model('runlogs', mongooseSchema3,'runlogs');

    var group = {key: {user:1},
        cond: {"startedOn":{"$gte":new Date(dates),"$lt":new Date(dates+stepcount)}},
        reduce: function(obj,prev) { prev.count+=1;if (obj.duration>=1200){prev.realcount+=1;};if (obj.duration>=600){prev.real2count+=1;}},
        initial: {count: 0,realcount:0,real2count:0},
        finalize: {  }
    };
    dataout=yield new Promise(function(resolve, reject){
        mongooseModel3.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true,function(err, results) {
            //console.log('group results %j', results)
            var realcountNum=0;
            var realcount2Num=0;
            var countNum=results.length;
            for (var i=0;i<countNum;i++){
                // console.log(results[i])
                if (results[i]["realcount"]>0){
                    realcountNum++;
                }
                if (results[i]["real2count"]>0){
                    realcount2Num++;
                }
            }
            //var zhanbiNum=(realcountNum/countNum*100).toFixed(2)
            //console.log({"countNum":countNum,"realcountNum":realcountNum,"zhanbiNum":zhanbiNum})
            results.sort(function (a, b) {return b.realcount- a.realcount;});
            for (var i=0;i<results.length;i++){
                results[i]["user"]=results[i]["user"].toString()
                results[i]["index"]=i+1
            }
            resolve({"countNum":countNum,"realcountNum":realcountNum,"realcount2Num":realcount2Num,"userlists": results})
        });
    });
    //console.log({"dataout":dataout["userlists"]})
    this.body = yield render('users_list',{"dataout":dataout})
}


function *user_log(req,res,next){
    var datin= this.querystring.toString()
    var userId=datin.split("&")[0]
    var ducondotion=datin.split("&")[1]
    //console.log(datin)

    var mongooseSchema3 = new mongoose.Schema({
        duration: Number, user:mongoose.Schema.ObjectId, songList: mongoose.Schema.ObjectId, matchRate: Number, startedOn:Date, actionType: String,"_id":String,
        distancePlaned:Number,durationPlaned:Number,tempoPlaned:Number,stepCount:Number,songs:[],createdOn:Date,"updatedOn":Date
    });
    var mongooseModel3 = db.model('runlogs', mongooseSchema3,'runlogs');

    var mongooseSchema1 = new mongoose.Schema({
        __v: Number, headingImgUrl: String, gender: String,nickname:  String,  actionType: String,height:Number,
        tags:{},radios:[],credentials:{},deviceIds:[],residence:{},createdOn:Date,"updatedOn":Date
    });
    var mongooseModel1 = db.model('users', mongooseSchema1,'users');

    userinfo=yield mongooseModel1.findOne({"_id":userId},{"nickname":1,"gender":1,"residence":1,"createdOn":1,"headingImgUrl":1})
    console.log(userinfo)
    if (userinfo["residence"]!= undefined){
        var address=userinfo["residence"]["country"]+userinfo["residence"]["province"]+userinfo["residence"]["city"]
    }else{var address=''}

        console.log(userinfo)
    var userout={
        "createddate":userinfo["createdOn"].getFullYear()+"年"+(userinfo["createdOn"].getMonth()+1)+"月"+userinfo["createdOn"].getDate()+"日",
        "nickname":userinfo["nickname"],
         "gender": userinfo["gender"],
         "address":address,
         "pic":(userinfo["headingImgUrl"]!= undefined) ? userinfo["headingImgUrl"] :"http://p3.music.126.net/zwVS7DI_X0y1yhObWWz0Sw==/6652045349717340.jpg?param=200y200"
    }

    if (ducondotion=="all"){
        runlogs=yield mongooseModel3.find({"user": userId},{"duration":1,"matchRate":1,"startedOn":1,"actionType":1,"_id":0})
    }else{
        runlogs=yield mongooseModel3.find({"user": userId,"duration":{"$gte": parseInt(ducondotion)*60}},{"duration":1,"matchRate":1,"startedOn":1,"actionType":1,"_id":0})
    }

    runlogs.sort(function (a, b) {return a.startedOn- b.startedOn;});
    runlogs_out=[]
    for (var i=0;i<runlogs.length;i++){
        var hour = (Math.floor (runlogs[i]["duration"] / 3600)<10) ? "0"+Math.floor (runlogs[i]["duration"] / 3600):Math.floor (runlogs[i]["duration"] / 3600) ;
        var other = runlogs[i]["duration"] % 3600;
        var minute =    (Math.floor (other / 60)<10) ? "0"+Math.floor (other / 60) :  Math.floor (other / 60);
        var second = ((other % 60)<10) ? "0"+(other % 60) .toFixed (0) : (other % 60) .toFixed (0)

        //var time=(hour==0)?minute+":"+second : hour+":"+minute+":"+second
        var out={
            "date":runlogs[i]["startedOn"].getFullYear()+"年"+(runlogs[i]["startedOn"].getMonth()+1)+"月"+runlogs[i]["startedOn"].getDate()+"日",
            "duration":hour+":"+minute+":"+second,
            "actionType":runlogs[i]["actionType"],
             "matchRate":runlogs[i]["matchRate"]+"%",
            "index":i+1
         }
        runlogs_out.push(out)
    }
    //console.log({"userinfo": userout,"runlogs": runlogs_out})
    this.body = yield render('user_log',{"userinfo": userout,"runlogs": runlogs_out})
}

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
