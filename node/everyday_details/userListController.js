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

        let group = {
            key: {user: 1},
            cond: {"startedOn": {"$gte": new Date(dates - 86400000), "$lt": new Date(dates)}},
            reduce: function (obj, prev) {
                prev.count += 1;
                if (obj.duration >= 1200) {
                    prev.gte20 += 1;
                }
                ;
                if (obj.duration >= 600) {
                    prev.gte10 += 1;
                }
            },
            initial: {count: 0, gte20: 0, gte10: 0},
            finalize: {}
        };
        let dataout = yield new Promise(function (resolve, reject) {
            runLogsModel.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true, function (err, results) {

                var gte20 = 0, gte10 = 0, index = 0
                results.sort(function (a, b) {
                    return b.gte20 - a.gte10;
                });
                _.map(results, function (record) {
                    if (record.gte20 > 0) {
                        gte20++;
                    }
                    if (record.gte10 > 0) {
                        gte100++;
                    }
                    record.user = record.user.toString();
                    index++;
                    results.index = index;
                })
                resolve({
                    "countNum": results.length,
                    "gte20Num": gte20,
                    "gte10Num": gte10,
                    "userlists": results
                })
            });
        });
        //console.log({"dataout":dataout["userlists"]})
        this.body = yield render('users_list', {"dataout": dataout})
    }
}