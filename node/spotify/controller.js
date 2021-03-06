/**
 * Created by ThinkPad on 2016/5/13.
 */
"use strict";
let rp = require('request-promise');
let _ =require("lodash");
let tokenModel = require('./spotifyModels').tokenModel;
let views = require('co-views');
let bodyParser = require('co-body');
let render = views('./views/', {
    map: { html: 'swig' },
    md: 'hogan'
});



function *get_token(){
    let token=yield tokenModel.findOne({"type":"token","createdOn":{"$gte":new Date(new Date().getTime()-3500000)}}).lean();
    if (! token){
        let code=yield tokenModel.findOne({"type":"code","createdOn":{"$gte":new Date(new Date().getTime()-3500000)}}).lean();
          if (code){
             // 换token
              var options = {
                  method: 'POST',
                  uri: 'https://accounts.spotify.com/api/token',
                  form: {
                      grant_type: 'authorization_code', // Will be urlencoded
                      redirect_uri:'http://songcheck.paohaile.com:8030/backcall',
                      code:code.value
                  },
                  headers: {
                      'content-type': 'application/x-www-form-urlencoded', // Set automatically
                      Authorization:'Basic  YWU0MWEzMTA5ZmVmNGZmNjkxYmI2Yzk4ZWZlODc2NDg6Y2JlYTVhMzk4YjE0NDU5ZDliN2I1NWEwOGJiMDg2Zjc='
                  }
              };
              let data= yield rp(options).then(function(resultStr) {
                  var result = JSON.parse(resultStr);
                  return result.access_token
              });
              yield tokenModel.update({"type":"token"}, { $set :{"createdOn": new Date(),"value":data}},{ upsert :true  });
              return data
          }else{
              //let url="https://accounts.spotify.com/en/authorize?response_type=code&redirect_uri=http:%2F%2Fsongcheck.paohaile.com:8030%2Fbackcall&client_id=ae41a3109fef4ff691bb6c98efe87648";
              //换code
              //code=yield tokenModel.findOne({"type":"code","createdOn":{"$lte":new Date(new Date().getTime()-3500000)}}).lean();
              ////换token
              //var options = {
              //    method: 'POST',
              //    uri: 'https://accounts.spotify.com/api/token',
              //    form: {
              //        grant_type: 'authorization_code', // Will be urlencoded
              //        redirect_uri:'http://songcheck.paohaile.com:8030/backcall',
              //        code:code
              //    },
              //    headers: {
              //        'content-type': 'application/x-www-form-urlencoded', // Set automatically
              //        Authorization:'Basic  YWU0MWEzMTA5ZmVmNGZmNjkxYmI2Yzk4ZWZlODc2NDg6Y2JlYTVhMzk4YjE0NDU5ZDliN2I1NWEwOGJiMDg2Zjc='
              //    }
              //};
              //let data= rp(options).then(function(resultStr) {
              //    var result = JSON.parse(resultStr);
              //    return result.access_token
              //});
              return "code invalid"
          }
    }else{
        return token.value
    }

}

module.exports = {
    search: function *(req,res,next){
        let querydata={};
        _.map(this.querystring.toString().split("&"),function(data){
            querydata[data.split("=")[0]]=data.split("=")[1]
        });

        console.log(querydata.query);
        let url = "https://api.spotify.com/v1/search?offset=0&limit=20&type=track&query=" + querydata.query;
        let data=yield rp(url).then(function(resultStr) {
            var result = JSON.parse(resultStr);
            return result.tracks.items

        });
        //console.log(data)
        if (data.length>0){
            let temp=[];
            let index=0;
            _.map(data,function(record){
                let artist=[];
                _.map(record.artists,function(xx){
                    artist.push(xx.name)
                });
                index++;
                temp.push({
                    "name": record.name,
                    "id": record.id,
                    "index":index,
                    "album": record.album.name,
                    "artist": artist.join("/")
                })
            });
            this.body = yield render('spotifySearch', {"data":temp})
        }else{
            this.body="对不起没有找到符合您条件的歌曲";
        };
    },

    getfeature : function *(req,res,next){
        let querydata={};
        _.map(this.querystring.toString().split("&"),function(data){
            querydata[data.split("=")[0]]=data.split("=")[1]
        });

        let token=yield get_token();
        console.log(token);
        //if (token=={}){
        //    this.body={
        //        "dd":11,
        //        "33":1134
        //    }
        //}
        if (token=="code invalid"){
            let out= {
                queryUrl:"https://api.spotify.com/v1/audio-features/"+querydata.spotifyId,
                redirectUrl:"https://accounts.spotify.com/en/authorize?response_type=code&redirect_uri=http:%2F%2Fsongcheck.paohaile.com:8030%2Fbackcall&client_id=ae41a3109fef4ff691bb6c98efe87648"
            };
            this.body=yield render('change_code',{"out":out,"type":"fail"})
        }else{
            let options = {
                method: 'GET',
                uri:"https://api.spotify.com/v1/audio-features/"+querydata.spotifyId,
                headers: {"Authorization": "Bearer "+token}
            };
            let out=yield rp(options).then(function (resultStr) {
                //var resultStr= JSON.parse(resultStr);
                return resultStr;
                console.log(resultStr);
                //return result["sharingListUrl"]
            });
            this.body=yield render('change_code',{"out":out,"type":"sucess","song":decodeURIComponent(querydata.song)})
        }

    }




};