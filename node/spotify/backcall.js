/**
 * Created by ThinkPad on 2016/5/13.
 */
"use strict";
let mongoose = require('mongoose');
let _ = require('lodash');
let tokenModel = require('./spotifyModels').tokenModel;
let views = require('co-views');

let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});

module.exports = {
    backcall:function *(req,res,next){
        if (this.request.method=="GET"){
            this.querystring.toString().split("&")
            let querydata={}
            _.map(this.querystring.toString().split("&"),function(data){
                querydata[data.split("=")[0]]=data.split("=")[1]
            });
            yield new tokenModel({
                "createdOn": new Date(),
                "type": "code",
                "value":querydata.code
            }).save();
            this.body = yield render('valid')

        }else{
            this.body = yield render('valid')
        }


    }
}
