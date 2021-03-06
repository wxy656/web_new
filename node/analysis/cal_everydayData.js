/**
 * Created by ThinkPad on 2016/4/15.
 */
'use strict';
let mongoose = require('mongoose');
let _ = require('lodash');
let runLogsModel = require('./db_models').runLogsModel;
let songlistModel = require('./db_models').songlistModel;
let userModel = require('./db_models').userModel;
let operatingModel= require('./db_models').operatingModel;
let co = require('co');





//ios,android 分开，radio和songlists分开
//runlog:{
//    radio_lt10:{ios:{type: Number, trim: true},android:{type: Number, trim: true}},
//    radio_10_20:{ios:{type: Number, trim: true},android:{type: Number, trim: true}},
//    radio_gte20:{ios:{type: Number, trim: true},android:{type: Number, trim: true}},
//    songlist_lt10:{ios:{type: Number, trim: true},android:{type: Number, trim: true}},
//    songlist_10_20:{ios:{type: Number, trim: true},android:{type: Number, trim: true}},
//    songlist_gte20:{ios:{type: Number, trim: true},android:{type: Number, trim: true}}
//},


//}

let schedule = require("node-schedule");

var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 4;
rule.minute =20;
console.log(new Date())
module.export={
    dingshi: schedule.scheduleJob(rule, function(){
        console.log("qqqqqqqqeeee")
        co(function  *runlog() {
          for (var time_end =1478448000000; time_end <= 1479052800000;time_end += 86400000) {
                let today=new Date();
                //var time_end=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime()
                console.log(new Date(time_end));
                let records = yield runLogsModel.find({
                    "createdOn": {
                        "$gte": new Date(time_end - 86400000),
                        "$lt": new Date(time_end)
                    }
                })
                    .populate('songList', {type: 1, "name": 1})
                    .lean();
                //console.log(records.length)
                var runlogs = {

                    lt10: {radio: {ios: 0, android: 0}, songlist: {ios: 0, android: 0}, all: {}},
                    bte10_20: {radio: {ios: 0, android: 0}, songlist: {ios: 0, android: 0}, all: {}},
                    gte20: {radio: {ios: 0, android: 0}, songlist: {ios: 0, android: 0}, all: {}}
                };
                var listInfo = {};
                for (var i = 0; i < records.length; i++) {
                    try {
                        var record = records[i]
                        let device = (record.device || {}).os || "android";
                        let contentType = record.contentType || record.songList.type;
                        if (record.duration >= 1200) {
                            if (contentType == "runLog" || contentType == "radio") {
                                if (device == "android") {
                                    runlogs.gte20.radio.android += 1;
                                } else if (device == "iPhone OS") {
                                    runlogs.gte20.radio.ios += 1;
                                }
                                ;
                            } else {
                                if (device == "android") {
                                    runlogs.gte20.songlist.android += 1;
                                } else if (device == "iPhone OS") {
                                    runlogs.gte20.songlist.ios += 1;
                                }
                                ;
                            }
                        }
                        ;

                        if (record.duration >= 600 && record.duration < 1200) {
                            if (contentType == "runLog" || contentType == "radio") {
                                if (device == "android") {
                                    runlogs.bte10_20.radio.android += 1;
                                } else if (device == "iPhone OS"){
                                    runlogs.bte10_20.radio.ios += 1;
                                }
                                ;
                            } else {
                                if (device == "android") {
                                    runlogs.bte10_20.songlist.android += 1;
                                } else if (device == "iPhone OS"){
                                    runlogs.bte10_20.songlist.ios += 1;
                                }
                                ;
                            }

                        }
                        ;

                        if (record.duration < 600) {
                            if (contentType == "runLog" || contentType == "radio") {
                                if (device == "android") {
                                    runlogs.lt10.radio.android += 1;
                                } else if (device == "iPhone OS"){
                                    runlogs.lt10.radio.ios += 1;
                                }
                                ;
                            } else {
                                if (device == "android") {
                                    runlogs.lt10.songlist.android += 1;
                                } else if (device == "iPhone OS"){
                                    runlogs.lt10.songlist.ios += 1;
                                }
                                ;
                            }

                        }
                        ;

                        if ("songList" in record && record.songList !=""){
                            if (record.songList._id in listInfo) {
                            listInfo[record.songList._id]["count"] += 1
                        } else {
                            listInfo[record.songList._id] = {};
                            listInfo[record.songList._id]["count"] = 1;
                            listInfo[record.songList._id]["name"] = record.songList.name;
                            listInfo[record.songList._id]["_id"] = record.songList._id;
                        }
                        }

                    } catch (e) {
                        console.log(e)
                    }

                }
                ;

                var temp = ["ios", "android"]
                _.map(temp, function (elment) {
                    runlogs["lt10"]["all"][elment] = runlogs["lt10"]["radio"][elment] + runlogs["lt10"]["songlist"][elment];
                    runlogs["bte10_20"]["all"][elment] = runlogs["bte10_20"]["radio"][elment] + runlogs["bte10_20"]["songlist"][elment];
                    runlogs["gte20"]["all"][elment] = runlogs["gte20"]["radio"][elment] + runlogs["gte20"]["songlist"][elment];
                })
                var temp = ["radio", "songlist", "all"]
                _.map(temp, function (elment) {
                    runlogs["lt10"][elment]["all"] = runlogs["lt10"][elment]["ios"] + runlogs["lt10"][elment]["android"];
                    runlogs["bte10_20"][elment]["all"] = runlogs["bte10_20"][elment]["ios"] + runlogs["bte10_20"][elment]["android"];
                    runlogs["gte20"][elment]["all"] = runlogs["gte20"][elment]["ios"] + runlogs["gte20"][elment]["android"];

                })
                var top10_songlist = []
                for (var key in listInfo) {
                    top10_songlist.push(listInfo[key])
                }
                var top10_songlist = _.sortBy(top10_songlist, ['count']);
                var top10_songlist = top10_songlist.slice(top10_songlist.length - 10, top10_songlist.length);
                let youmeng = {
                    "newUser": {
                        "android": 0,
                        "ios": 0,
                        "all": 0
                    },
                    "activeUser": {
                        "android": 0,
                        "ios": 0,
                        "all": 0
                    },
                    "total_user": {
                        "android": 0,
                        "ios": 0,
                        "all": 0
                    },
                    "openNum": {
                        "android": 0,
                        "ios": 0,
                        "all": 0
                    }
                }
                yield new operatingModel({
                    "date": new Date(time_end - 3600 * 10000),
                    "runlog": runlogs,
                    "top10_songlist": top10_songlist,
                    "youmeng": youmeng
                }).save();
            }

            //yield operatingModel.insert({"date":new Date(), "runlog":runlogs});
        }).then(function() {console.log('done')});
        console.log("fffff")
    })
}



















