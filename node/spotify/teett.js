/**
 * Created by ThinkPad on 2016/5/13.
 */
"use strict";
let co=require('co');
let tokenModel = require('./spotifyModels').tokenModel;

co(function *(){
    let token=yield tokenModel.findOne({"type":"token","createdOn":{"$lte":new Date(new Date().getTime()-3500000)}}).lean();
    if (token){
        console.log(token)
    }

}).then(function() {console.log('done')});