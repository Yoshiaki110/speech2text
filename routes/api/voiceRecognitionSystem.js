"use strict";

var express = require('express');
var router = express.Router();

var recaius = require('../../lib/recaius/speech2text');
var multer = require('multer');
var upload = multer({ dest: './upload/' });
var model_id;
/**
* RECAIUSのAPIをラップするAPI
* RECAIUSの音声合成APIはID/passwordを常に送る必要があるため、ブラウザから直接利用しない。
*/
router.post('/login', function (req, res, next) {
    var model = req.body.model;
    model_id = req.body.model.model_id;
    var voiceRecognition = recaius.createDefault(model_id);
    voiceRecognition.login(model).then(
        (data) => {
            res.status(data.status).send(data.data) ;   
        },
        (error) => {
            res.status(500).send({
                message: 'Unknown error'
            });
        }
    );
});

/**
* RECAIUSのAPIをラップするAPI
* RECAIUSの音声合成APIはID/passwordを常に送る必要があるため、ブラウザから直接利用しない。
*/
router.post('/:uuid/logout', function (req, res, next) {
    var uuid = req.params.uuid;
    var voiceRecognition = recaius.createDefault(model_id);
    voiceRecognition.logout(uuid).then(
        (data) => {
            res.status(data.status).send(data.data) ;   
        },
        (error) => {
            res.status(500).send({
                message: 'Unknown error'
            });
        }
    );
});

/**
* RECAIUSのAPIをラップするAPI
* RECAIUSの音声合成APIはID/passwordを常に送る必要があるため、ブラウザから直接利用しない。
*/
router.get('/:uuid/result', function (req, res, next) {
    var uuid = req.params.uuid;
    var voiceRecognition = recaius.createDefault(model_id);
    voiceRecognition.result(uuid).then(
        (data) => {
            res.status(data.status).send(data.data);
        },
        (error) => {
            res.status(500).send({
                message: 'Unknown error'
            });
        }
    );
});

/**
* RECAIUSのAPIをラップするAPI
* RECAIUSの音声合成APIはID/passwordを常に送る必要があるため、ブラウザから直接利用しない。
*/
router.put('/:uuid/voice',upload.single('voice'), function (req, res, next) {
    var uuid = req.params.uuid;
    var voice = req.file;
    var voiceid = req.body.voiceid;
    var voiceRecognition = recaius.createDefault(model_id);
    voiceRecognition.voiceSend(uuid,voiceid,voice).then(
        (data) => {
            res.status(data.status).send(data.data);
        },
        (error) => {
            res.status(500).send({
                message: 'Unknown error'
            });
        }
    );
});

module.exports = router;
