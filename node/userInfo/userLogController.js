/**
 * Created by ThinkPad on 2016/5/5.
 */
'use strict';
let mongoose = require('mongoose');
let _ = require('lodash');
let runLogModel= require('../analysis/db_models').runLogModel;
let userModel=require('../analysis/db_models').userModel;

let views = require('co-views');

let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});

module.exports= {
    userLog:function *(req, res, next){


        let querydata = {}
        _.map(this.querystring.toString().split("&"), function (data) {
            querydata[data.split("=")[0]] = data.split("=")[1]
        });
        let userId =querydata.userId
        let ducondotion = querydata.ducondotion

        let userinfo = yield userModel.findOne({"_id": userId}, {
            "nickname": 1,
            "gender": 1,
            "residence": 1,
            "createdOn": 1,
            "headingImgUrl": 1
        })
        //address
        if (userinfo["residence"] != undefined) {
            var address = userinfo["residence"]["country"] + userinfo["residence"]["province"] + userinfo["residence"]["city"]
        } else {
            var address = ''
        }

       let userout = {
            "createddate": userinfo["createdOn"].getFullYear() + "年" + (userinfo["createdOn"].getMonth() + 1) + "月" + userinfo["createdOn"].getDate() + "日",
            "nickname": userinfo["nickname"],
            "gender": userinfo["gender"],
            "address": address,
            "pic": (userinfo["headingImgUrl"] != undefined) ? userinfo["headingImgUrl"] : "http://p3.music.126.net/zwVS7DI_X0y1yhObWWz0Sw==/6652045349717340.jpg?param=200y200"
        }

        if (ducondotion == "all") {
           let  runlogs = yield runLogModel.find({"user": userId}, {
                "duration": 1,
                "matchRate": 1,
                "startedOn": 1,
                "actionType": 1,
                "_id": 0
            })
        } else {
           let runlogs = yield runLogModel.find({
                "user": userId,
                "duration": {"$gte": parseInt(ducondotion) * 60}
            }, {"duration": 1, "matchRate": 1, "startedOn": 1, "actionType": 1, "_id": 0})
        }

        runlogs.sort(function (a, b) {
            return a.startedOn - b.startedOn;
        });

        let runlogs_out = []
        _.map(runlogs,function(record){
            var hour = (Math.floor(record["duration"] / 3600) < 10) ? "0" + Math.floor(record["duration"] / 3600) : Math.floor(record["duration"] / 3600);
            var other =record["duration"] % 3600;
            var minute = (Math.floor(other / 60) < 10) ? "0" + Math.floor(other / 60) : Math.floor(other / 60);
            var second = ((other % 60) < 10) ? "0" + (other % 60).toFixed(0) : (other % 60).toFixed(0)
            var out = {
                "date": runlogs[i]["startedOn"].getFullYear() + "年" + (runlogs[i]["startedOn"].getMonth() + 1) + "月" + runlogs[i]["startedOn"].getDate() + "日",
                "duration": hour + ":" + minute + ":" + second,
                "actionType": runlogs[i]["actionType"],
                "matchRate": runlogs[i]["matchRate"] + "%",
                "index": i + 1
            }
            runlogs_out.push(out)
        })


        //console.log({"userinfo": userout,"runlogs": runlogs_out})
        this.body = yield render('user_log', {"userinfo": userout, "runlogs": runlogs_out})
    }
}