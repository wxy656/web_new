/**
 * Created by ThinkPad on 2016/5/13.
 */
"use strict";
let mongoose = require('mongoose');
let _ = require('lodash');
let db =mongoose.createConnection("mongodb://localhost/search_record");
let Schema = mongoose.Schema;

let tokenSchema = new mongoose.Schema(_.extend({
    createdOn: Date,
    type: {type: String, trim: true},
    value: {type: String, trim: true}
}));

module.exports = {
    tokenModel: db.model('spotify_token', tokenSchema, 'spotify_token')
};