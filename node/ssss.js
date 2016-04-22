/**
 * Created by ThinkPad on 2016/4/18.
 */
"use strict";
//let mongoose =require("mongoose");
let _ = require('lodash');
//let db =mongoose.createConnection("mongodb://54.223.227.163/paohaile")
//let Schema = mongoose.Schema;
//let co = require('co');
//
//let  runLogSchema =  new mongoose.Schema(_.extend({
//    _id: {type:String, trim:true},
//    startedOn: Date,
//    duration: Number,
//    stepCount: Number,   //???
//    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
//    songs: [
//        {
//            _id:false,
//            songId: {type: mongoose.Schema.Types.ObjectId, ref: 'songs'},
//            startedOn: Date,
//            duration: Number,
//            durationPlayed: Number,
//            ratioPlayed: Number,
//            typeStopped: String,
//            cadence: Number, // steps per minute
//            distance: Number,
//            geo: {
//                lng: Number,
//                lat: Number
//            }
//        }
//    ],
//    songList: {type: mongoose.Schema.Types.ObjectId, ref:'songLists'},
//    actionType: {type: String, trim: true},
//    matchRate: Number,
//    durationPlaned: Number,
//    distancePlaned: Number,
//    tempoPlaned: Number,
//    isUserDeleted: Boolean,
//    device: {
//        os: String,
//        version: String
//    }
//}));
//let runLogsModel= db.model('runlogs', runLogSchema,'runlogs');
//
//let today=new Date();
//let time_end=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
//let stepcount=86400000;
//
//co(function *(){
//        let records= yield runLogsModel.find({"createdOn":{"$gte":new Date(time_end-stepcount),"$lt":new Date(time_end)}})
//
//        console.log(records[0])}
//)

//let today=new Date();
//var time_end=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime()
//console.log(time_end)
function createUrl (query,field,field_value ){
    var queryList=query.split("&")
    var temp={}
    for (var i=0;i<queryList.length;i++){
        temp[queryList[i].split("=")[0]]=queryList[i].split("=")[1]
    }
    temp[field]=field_value

    let queryOut=""
    for (var elment in temp){
        queryOut=queryOut+elment+"="+temp[elment]+"&"
    }
    queryOut=queryOut.substring(0,queryOut.length-1);
    return "http://songcheck.paohaile.com:8040/day_summary?"+queryOut

}

//var query="device=ios&type_=radio&time_start=1460217600000&time_end=1460995200000"
var query="today=1"
var aa=createUrl (query,"device","android")
console.log(aa)

//function convertJson(query){
//    var queryList=query.split("&");
//    var temp={}
//    for (var i=0;i<queryList.length;i++){
//        temp[queryList[i].split("=")[0]]=queryList[i].split("=")[1]
//    }
//    return temp
//}
//
//console.log(convertJson(query))

let zz="11"
if (["11","22"].indexOf(zz)!=-1){
    console.log("sss")
}