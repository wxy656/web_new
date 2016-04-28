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

module.exports={
    songlistRadio:function *(req, res, next) {
        let querydata = {}
        _.map(this.querystring.toString().split("&"), function (data) {
            querydata[data.split("=")[0]] = data.split("=")[1]
        });
        let dates = parseInt(querydata.date) || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
        var  data_raws=yield operatingModel.findOne({"date": {"$gte": new Date(dates - 86400000), "$lt": new Date(dates)}}).lean();
        console.log(data_raws)
        let gte20=data_raws.runlog.gte20
        let bte10_20=data_raws.runlog.bte10_20
        let lt10=data_raws.runlog.lt10

        let radioNum=gte20.radio.all + bte10_20.radio.all + lt10.radio.all
        let songlistNum=gte20.songlist.all +bte10_20.songlist.all + lt10.songlist.all
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

