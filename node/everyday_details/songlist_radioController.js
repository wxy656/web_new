/**
 * Created by ThinkPad on 2016/4/25.
 */
'use strict';
let mongoose = require('mongoose');
let _ = require('lodash');
let operatingModel= require('../analysis/db_models').operatingModel;

let views = require('co-views');

let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});

module.export={
    songlist_radio:function *(req, res, next) {
        let querydata = {}
        _.map(this.querystring.toString().split("&"), function (data) {
            querydata[data.split("=")[0]] = data.split("=")[1]
        });
        let dates = parseInt(querydata.date) || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
        var  data_raws=yield operatingModel.findOne({"startedOn": {"$gte": new Date(dates - 86400000), "$lt": new Date(dates)}}).lean()

        let radioNum=data_raws.gte20.radio.all + bte10_20.radio.all + lt10.radio.all
        let songlistNum=data_raws.gte20.songlist.all + bte10_20.songlist.all + lt10.songlist.all
        var top10=data_raws.top10_songlist
        top10.sort(function (a, b) {
            return b.count - a.count;
        });
        var index=0
        _.map(top10,function(songlist){
            index++;
            songlist.index=index;
        })

        this.body = yield render('songlist_radio', {"radioNum": radioNum,"songlistNum":songlistNum,topl0:top10})

    }
}

