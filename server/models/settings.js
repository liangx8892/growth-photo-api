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
var SettingsSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: '请填写用户ID！',
        unique: '用户设置已存在！',
        default: ''
    },
    babyName: {
        type: String,
        trim: true,
        required: '请填写宝宝名字！',
        default: ''
    },
    expectedBirthDate: {
        type: Date,
        required: '请选择宝宝预产期！'
    },
    birthDate: {
        type: Date
    },
});

mongoose.model('Settings', SettingsSchema);
