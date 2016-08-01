/**
 * Created by ThinkPad on 2016/4/20.
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

module.exports = {
    day_summary: function *(req,res,next){
        let querydata={}
        _.map(this.querystring.toString().split("&"),function(data){
             querydata[data.split("=")[0]]=data.split("=")[1]
        });
        let time_start=parseInt(querydata.time_start) || new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()-604800000;
        let time_end= parseInt(querydata.time_end) || new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()
        let device=querydata.device || "all";
        let type_=querydata.type_ || "all";

      // var sss= yield  bodyParser.json(this.request)
        console.log(querydata)

        //console.log(new Date(time_end))
         var  data_raws=yield operatingModel.find({"date":{"$gte":new Date(time_start),"$lt":new Date(time_end)}}).lean()
        data_raws= _.sortBy(data_raws,["date"])

        var gte20=[],bte10_20=[],lt10=[],rihuo=[],datelist=[]
        _.map(data_raws,function(record){
                gte20.push(record["runlog"]["gte20"][type_][device]);
                bte10_20.push(record["runlog"]["bte10_20"][type_][device]);
                lt10.push(record["runlog"]["lt10"][type_][device]);
                rihuo.push(record["youmeng"]["activeUser"][device]);
                datelist.push(record.date.getFullYear()+"/"+(record.date.getMonth()+1)+"/"+record.date.getDate())
        });
        var total=[],gte20_zhanbi=[],gte20_rihuo_zhanbi=[],bte10_20_zhanbi=[],lt10_zhanbi=[],rihuozhanbi=[]
        for (let i=0;i<data_raws.length;i++){
            var total_elment=gte20[i]+bte10_20[i]+lt10[i];
            total.push(total_elment)
            gte20_zhanbi.push((gte20[i]/total_elment*100).toFixed(2));
            gte20_rihuo_zhanbi.push((gte20[i]/rihuo[i]*100).toFixed(2));
            bte10_20_zhanbi.push((bte10_20[i]/total_elment*100).toFixed(2));
            lt10_zhanbi.push((lt10[i]/total_elment*100).toFixed(2));
            rihuozhanbi.push((total_elment/rihuo[i]*100).toFixed(2));
        }

        //console.log({"datelist":datelist,"countlist":countlist,"realcountlist":realcountlist,"zhanbilist":zhanbilist})
        this.body = yield render('day_summary',{"datelist":datelist,"total":total,"gte20":gte20,"gte20_rihuo_zhanbi":gte20_rihuo_zhanbi,"bte10_20":bte10_20,"lt10":lt10,"rihuo":rihuo,"gte20_zhanbi":gte20_zhanbi,"bte10_20_zhanbi":bte10_20_zhanbi,"lt10_zhanbi":lt10_zhanbi,"rihuozhanbi":rihuozhanbi})
    }
}