/**
 * Created by ThinkPad on 2016/4/25.
 */
'use strict';
let mongoose = require('mongoose');
let _ = require('lodash');
let operatingModel= require('../analysis/db_models').operatingModel;
let runLogsModel= require('../analysis/db_models').runLogsModel;

let views = require('co-views');

let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});

module.exports = {
    userList: function *(req, res, next) {
        let querydata = {}
        _.map(this.querystring.toString().split("&"), function (data) {
            querydata[data.split("=")[0]] = data.split("=")[1]
        });
        let dates = parseInt(querydata.date) || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
        let startNum= parseInt(querydata.pageNum)*50 || 0


        let group = {
            key: {user: 1},
            cond: {"startedOn": {"$gte": new Date(dates - 86400000), "$lt": new Date(dates)}},
            reduce: function (obj, prev) {
                prev.count += 1;
                if (obj.duration >= 1200) {
                    prev.gte20 += 1;
                };
                if (obj.duration >= 600) {
                    prev.gte10 += 1;
                };
            },
            initial: {count: 0, gte20: 0, gte10: 0},
            finalize: {}
        };
        let dataout = yield new Promise(function (resolve, reject) {
            runLogsModel.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true, function (err, results) {

                var gte20 = 0, gte10 = 0, index = 0;
                results=_.sortBy(results, function(o) { return o.gte20; }).reverse();
                let endNum=(startNum+50<results.length)?startNum+50:results.length;
                _.map(results, function (record) {
                    if (record.gte20 > 0) {
                        gte20++;
                    }
                    if (record.gte10 > 0) {
                        gte10++;
                    }
                    record.user = record.user.toString();
                    index++;
                    record.index = index;

                });
                let resultsOut=[];
                for (let i=startNum;i<endNum;i++){
                    results[i].nickname=yield userModel.findOne({"_id": results[i].user},{"nickname":1}).lean().nickname
                    resultsOut.push(results[i]);
                }

                resolve({
                    "countNum": results.length,
                    "totalPage":Math.ceil(results.length/50),
                    "gte20Num": gte20,
                    "gte10Num": gte10,
                    "userlists": resultsOut
                })
            });
        });
        //console.log({"dataout":dataout["userlists"]})
        this.body = yield render('users_list', {"dataout": dataout})
    }
}