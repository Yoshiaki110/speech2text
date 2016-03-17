var totalResultStr = '';
var timerId;
var intervalId;
var timelimitMs = 30000; //自動で録音停止するまでの時間(10秒)
var timelimitSec = timelimitMs/1000; //録音残り時間表示用

/**
 * RECAIUS音声認識ライブラリへの接続パラメーターセット
 */
function initialize() {
    var options = {};
    //接続用パラメータ
    options["format"] = ""
    options["host"] = "/api/voice-recognition"; //ID/PASSWORDを隠蔽するため、ラッパーAPIを立ててそこからアクセスする
    options["model"] = {};
    options["model"]["energy_threshold"] = 300;
    options["model"]["model_id"] = 1; //必須, 数値のみ(1:日本語、5:英語、7:北京語)
    options["model"]["audiotype"] = "audio/x-linear"; //WebRTCはリニアPCMのみ対応
    options["model"]["pushtotalk"] = false;
    options["model"]["resulttype"] = "nbest"; //本サンプルはnbestの結果1のみ対応
    options["model"]["resultcount"] = 1;
    options["buffer_time"] = 512; //音声データのバッファサイズを設定(ミリ秒) 必要な最小バッファサイズ以下の場合、最小バッファサイズが採用される。
    recaiusSpeechRecognition.setConfig(
        function(ret){
            for(var key in ret){
                console.log(key +":" + ret[key]);
            }
        }, options);
}

/**
 * 録音開始
 * 
 * ログイン-> 成功なら録音開始
 */
var captureStart = function () {
    clearAll();

    //自動停止用カウントダウン開始
    timerId = setTimeout(captureStop,timelimitMs);
    
    //1秒単位で残り録音時間を表示
    intervalId = setInterval(function(){
        if(timelimitSec > 0){
            $('#js-recording-button').html('音声認識中:'+ timelimitSec);
        }else{
            timelimitSec =  timelimitMs/1000;
            clearInterval(intervalId);
            $('#js-recording-button').removeClass('btn-warning');
            $('#js-recording-button').addClass('btn-primary');
            $('#js-recording-button').html('音声認識開始');
        }
        timelimitSec--;
    },1000);
    
    //コールバック用パラメータ
    var options = {};
    options["temp_result"] = true; //途中結果を受け取るかどうかを指定する。{true | false}。デフォルト:true;
    recaiusSpeechRecognition.recognitionStart(captureSuccessCallback, captureErrorCallback, options);
    $('#js-recording-button').html('音声認識中');
    $('#js-recording-button').removeClass('btn-primary');
    $('#js-recording-button').addClass('btn-warning');
    $("#js-recording-button").unbind("click");
    $("#js-recording-button").bind("click", function (e) {
        captureStop();
    });
}

var captureStop = function() {
    clearTimeout(timerId);
    clearInterval(intervalId);
    $('#js-recording-button').removeClass('btn-warning');
    $('#js-recording-button').addClass('btn-primary');
    $('#js-recording-button').html('音声認識開始');

    recaiusSpeechRecognition.recognitionStop(stopSuccessCallback, stopErrorCallback);
}

function captureSuccessCallback(resultObj) {
    var code = resultObj["code"]; // 結果コード
    var message = resultObj["message"]; // 結果コードに対応するメッセージ
    var resultType = resultObj["result_type"]; // 認識結果の場合のみ。{TMP_RESULT:暫定結果 | RESULT:結果}
    var resultJson = resultObj["result"]; // 認識結果の場合のみ。WebAPIからのレスポンス。※参照：ASR-WebAPI_Specification.pdf 但し時間に関しては書式変換する
    var resultStr = resultObj["str"]; //
    //アプリ側での認識成功時の処理を記述
    
    if (code.indexOf("S00") > -1 && resultType === "TMP_RESULT" && resultJson.length > 0) {
        var tmpResultText = resultStr; //暫定結果
        if (tmpResultText) {
            typeResultText(tmpResultText);
        }

    } else if (code.indexOf("S00") > -1 && resultType === "RESULT" && resultJson.length > 0) {
        totalResultStr = totalResultStr + resultStr + "\n";
        typeResultText('');
    } else {
        //nothing to do
    }
}

function captureErrorCallback(resultObj) {
    var code = resultObj["code"]; // 結果コード
    var message = resultObj["message"]; // 結果コードに対応するメッセージ
    //アプリ側での認識成功時の処理を記述
}

function stopSuccessCallback(resultObj) {
    var code = resultObj["code"]; // 結果コード。成功の場合はSxxx。xxxは任意のコード
    var message = resultObj["message"]; // 結果コードに対応するメッセージ
    
    //アプリ側での認識停止成功時の処理を記述
    $('#js-recording-button').removeClass('btn-warning');
    $('#js-recording-button').addClass('btn-primary');
    $('#js-recording-button').html('音声認識開始');
    $("#js-recording-button").unbind("click");
    $("#js-recording-button").bind("click", function (e) {
        captureStart();
    });

}

function stopErrorCallback(resultObj){
    var code = resultObj["code"]; // 結果コード。成功の場合はSxxx。xxxは任意のコード
    var message = resultObj["message"]; // 結果コードに対応するメッセージ
    //アプリ側での認識停止成功時の処理を記述    
}


/**
 * 結果を画面に表示
 */
function typeResultText(appendText) {
    $('#js-text-textview').html(totalResultStr + appendText);
    $('#js-text-textview')[0].focus();
    $('#js-text-textview').scrollTop($('#js-text-textview')[0].scrollHeight);
}


var clearAll = function () {
    totalResultStr = '';
    timelimitSec = timelimitMs/1000;
}


$(document).ready(
    function () {
        //ボタンに音声キャプチャFunctionを紐付ける
        $("#js-recording-button").bind("click",
            function (e) {
                captureStart();
            }
            );
        //音声録音イニシャライズ
        initialize();
    }
 );
