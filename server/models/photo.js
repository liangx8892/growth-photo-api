'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve('./server/config/config')),
    Schema = mongoose.Schema;

/**
 * Settings Schema
 */
var PhotoSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        index: true,
        required: '请填写用户ID！',
        default: ''
    },
    localPath: {
        type: String,
        trim: true,
        required: '请指定本地路径！',
        default: ''
    },
    remotePath: {
        type: String,
        trim: true,
        default: ''
    },
    createDate: {
        type: Date,
        index: true,
        required: '请指定创建日期！'
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
});

mongoose.model('Photo', PhotoSchema);