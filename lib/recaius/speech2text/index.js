"use strict";

var stream = require('stream');
var request = require('request');
var fs = require('fs');

/**
 * 音声認識APIHelperクラス
 */
class Speech2Text {

    static createDefault(model_id) {
        var recaiusAsrId;
        var recaiusAsrPassword;
        switch(model_id) {
          case 1: // 日本語
            recaiusAsrId = process.env.RECAIUS_ASR_JAJP_ID;
            recaiusAsrPassword = process.env.RECAIUS_ASR_JAJP_PASSWORD;
            break;
          case 5: // 英語
            recaiusAsrId = process.env.RECAIUS_ASR_ENUS_ID;
            recaiusAsrPassword = process.env.RECAIUS_ASR_ENUS_PASSWORD;
            break;
          case 7: // 北京語
            recaiusAsrId = process.env.RECAIUS_ASR_ZHCN_ID;
            recaiusAsrPassword = process.env.RECAIUS_ASR_ZHCN_PASSWORD;
            break;
          default: //
            recaiusAsrId = process.env.RECAIUS_ASR_JAJP_ID;
            recaiusAsrPassword = process.env.RECAIUS_ASR_JAJP_PASSWORD;
        }
        return new Speech2Text(
            recaiusAsrId,
            recaiusAsrPassword
        );
    }
  
    /**
     * 初期化設定
     * @param {string} [url] - url of SpeechSystem 'http(s)://server_address:port_number/context_path'
     * @param {string} [id] - id of SpeechSystem that used synthesize request
     * @param {string} [password] - password of SpeechSystem that used synthesize request
     */
    constructor(id, password, model_id) {
        this.url = 'https://try-api.recaius.jp/asr/v1';
        this.id = id;
        this.password = password;

        this.loginPath = '/login';
        this.voiceSendPath = '/voice';
        this.getResultPath = '/result';
        this.logoutPath = '/logout';

    }

    /**
     * ID/Passwordを付けてRECAIUSのloginAPIを呼ぶ
     * @param  {?Object} [model] - model of /asr/v1/login API
     */
    login(model) {
        var uri = `${this.url}${this.loginPath}`;

        return new Promise((resolve, reject) => {
            var body = {
                id: this.id,
                password: this.password,
                model: model
            }
            request({
                uri: uri,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            },
                (error, response, body) => {

                    if (!error) {
                        resolve({ status: response.statusCode, data: body });
                    } else {
                        reject(error);
                    }
                }
                );
        });
    }

    /**
     * /asr/v1/:uuid/voice　のラッパーAPI
     * 
     */
    voiceSend(uuid, voiceid, voice) {
        return new Promise((resolve, reject) => {
            var pcmData = fs.createReadStream(voice.path);

            if (uuid && voiceid) {
                var uri = this.url + '/' + uuid + this.voiceSendPath;
                
                //音声認識APIに送信するFormを作成
                var formData = {
                    voiceid: voiceid,
                    voice: {
                        value: pcmData, //音声ファイルストリーム
                        options: {
                            filename: 'data.wav',//ファイル名はなんでも良い
                            contentType: 'application/octet-stream'
                        }
                    }
                };

                request({
                    uri: uri,
                    method: 'PUT',
                    formData: formData //multipart/form-data
                },
                    (error, response, body) => {
                        if (!error) {
                            console.log('voiceid:' + voiceid + ' data:' + body);
                            resolve({ status: response.statusCode, data: body });
                        }
                        else {
                            reject(error);
                        }
                        //送り終わったら一時フォルダから削除
                        fs.unlink(voice.path);
                    }
                    );
            } else {
                resolve();
            }
        });
    }

    result(uuid) {
        var uri = this.url + '/' + uuid + this.getResultPath;

        return new Promise((resolve, reject) => {


            request({
                uri: uri,
                method: 'GET'
            },
                (error, response, body) => {
                    if (!error) {
                        console.log(body);
                        resolve({ status: response.statusCode, data: body });
                    }
                    else {
                        reject(error);
                    }
                }
                );
        });
    }

    logout(uuid) {
        var uri = this.url + '/' + uuid + this.logoutPath;

        return new Promise((resolve, reject) => {
            request({
                uri: uri,
                method: 'POST'
            },
                (error, response, body) => {

                    if (!error) {
                        resolve({status: response.statusCode, data:body});
                    } else {
                        reject(error);
                    }
                }
           );
        });
    }

};

module.exports = Speech2Text;
