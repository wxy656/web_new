/**
 * Created by ThinkPad on 2016/4/15.
 */
"use strict";
let mongoose = require('mongoose');
let _ = require('lodash');
let db =mongoose.createConnection("mongodb://54.223.227.163/paohaile")
let Schema = mongoose.Schema;


let runLogSchema = new mongoose.Schema(_.extend({
    _id: {type:String, trim:true},
    startedOn: Date,
    duration: Number,
    stepCount: Number,   //�Ʋ�
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    songs: [
        {
            _id:false,
            songId: {type: mongoose.Schema.Types.ObjectId, ref: 'songs'},
            startedOn: Date,
            duration: Number,
            durationPlayed: Number,
            ratioPlayed: Number,
            typeStopped: String,
            cadence: Number, // steps per minute
            distance: Number,
            geo: {
                lng: Number,
                lat: Number
            }
        }
    ],
    songList: {type: mongoose.Schema.Types.ObjectId, ref:'songlists'},
    actionType: {type: String, trim: true},
    matchRate: Number,
    durationPlaned: Number,
    distancePlaned: Number,
    tempoPlaned: Number,
    isUserDeleted: Boolean,
    device: {
        os: String,
        version: String
    }
}));
let songListSchema = new mongoose.Schema(_.extend({
    name: {type:String, trim: true},
    description: {type:String, trim: true},
    createdBy: {type: Schema.Types.ObjectId, ref:'users'},
    // list: system user created, runLog: with run log, import: import from wechat, favorite, user-list: user created
    type: {type: String, trim: true, enum:['list', 'runLog', 'import', 'favorite', 'user-list', 'radio']},
    subType: {type: String, trim: true, enum:['kuaizou', 'manpao', 'zhongpao', 'kuaipao', 'all']},
    tempoType: {type: String, trim: true, enum:['kuaizou', 'manpao', 'zhongpao', 'kuaipao', 'all']},
    tempoRange: {
        min: Number,
        max:Number
    },
    expiredOn: Date,
    songs: [{type:Schema.Types.ObjectId, ref:'songs'}],

    coverImageUrl: {type:String, trim: true},
    energy: {type: String, trim: true},
    language: [{type: String, trim: true}],
    durationPlaned: Number,
    distancePlaned: Number,
    tempoPlaned: Number,
    tags: [{type: String}],
    unionid: {type: String, trim: true},
    runCount: {type: Number, default: 0},
    count: {type: Number, default: 0},
    countInit: Boolean, // just used for the onceoff patching application for count and runCount
    duration: Number,
    mode: {type: Number, enum: [1,2,3,4]},

    isUserDeleted: Boolean

}));
let userSchema=new mongoose.Schema(_.extend({

    // for backwards compatibilities for the original java implementations
    clientCredentials: {
        channelId: {type: String, trim: true},
        clientId: {type: String, trim: true, index: { unique: true, sparse: true }},
        clientSecret: {type:String, trim: true}
    },

    // the rest is for the new user registration implementations
    nickname: {type: String, trim: true},
    email: {type: String, trim: true},
    mobile: {type: String, trim: true},
    gender: {type: String, trim: true},
    residence: {
        country: {type: String, trim: true},
        province: {type: String, trim: true},
        city: {type: String, trim: true}
    },
    headingImgUrl: {type: String, trim: true},
    height: Number, // in cm
    weight: Number,
    birthday: Date,
    deviceIds: [String],
    credentials: {
        local: {
            passwordHash: {type:String, trim:true}
        },
        oAuths: [
            {
                provider: {type: String, trim: true},     //should validate from a enum
                profileId: {type: String, trim: true},    // from oauth like facebook profile ID
                token: {type: String, trim: true}         // also form oauth like facebook token
            }
        ],

        wechat: mongoose.Schema.Types.Mixed
    },
    radios: [
        {
            _id:false,
            distance: Number,
            duration: Number,
            tempo: Number
        }
    ],
    tags: {
        artist: mongoose.Schema.Types.Mixed,
        lastMonth: {
            styles: [{
                _id: false,
                class: String,
                weight: Number
            }],
            popularity: Number,
            createdOn: Date
        },
        histories: [
            {
                _id: false,
                styles: [{
                    _id: false,
                    style: String,
                    weight: Number
                }],
                popularity: Number,
                createdOn: Date
            }
        ],
        timesOfReGenerateTags: Number,
        favoriteArtist: {
            favorRaw: [String],
            favorSimilar: [String]
        }
    }
}));
let operatingSchema=new mongoose.Schema(_.extend({
    date:Date,
    //runlog:{
    //    lt10: {radio:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}},
    //        songlist:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}},
    //        all:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}}},
    //    bte10_20: {radio:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}},
    //        songlist:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}},
    //        all:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}}},
    //    gte20: {radio:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}},
    //        songlist:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}},
    //        all:{ios:{type: Number, trim: true}, android:{type: Number, trim: true}}}
    // },
    runlog:{
        lt10: {
            radio:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}},
            songlist:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}},
            all:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}}
        },
        bte10_20: {radio:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}},
            songlist:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}},
            all:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}}},
        gte20: {radio:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}},
            songlist:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}},
            all:{ios:{type: Number, trim: true}, android:{type: Number, trim: true},all:{type: Number, trim: true}}}},
    youmeng:{},
    top10_songlist:[]

}));






//let runLogsModel=db.model('runlogs', runLogSchema,'runlogs');
//co(function *(){
//    let records= yield runLogsModel.find({"createdOn":{"$gte":new Date(time_end-stepcount),"$lt":new Date(time_end)}})
//    .populate('songList', {type: 1})
//    .lean()
//    console.log(records)}
//)

//let operatingModel=db.model('operating_datas', operatingSchema,'operating_datas')
//var bb=new operatingModel({"date":new Date()});
//bb.save()
module.exports ={
    runLogsModel: db.model('runlogs', runLogSchema,'runlogs') ,
    songlistModel:db.model('songlists', songListSchema,'songlists'),
    userModel:db.model('users', userSchema,'users'),
    operatingModel:db.model('operating_datas', operatingSchema,'operating_datas')
}

