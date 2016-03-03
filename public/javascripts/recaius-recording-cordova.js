var recaiusRecordingWebRTC;
/*
 * @fileOverview CordovaPluginを利用した音声録音ロジッククラス
 *
 */
/**
 * @class CordovaPluginを利用した音声録音ロジッククラス<br>
 * recaiusSpeechRecognitionクラスからの呼び出されるクラス。<br>
 * ■公開関数<br>
 * ・initialize:初期化処理をする<br>
 * ・recordingStart:録音開始<br>
 * ・recordingStop:録音停止<br>
 *
 */
var recaiusRecordingCordova = (function() {
	/**
	 * デバイス状態フラグ<br>
	 * デバイス準備ができた場合はtrue, できていない場合はfalseが設定される<br>
	 */
	var isDeviceReady = false;

	/**
	 * 初期化処理を実行する<br><br>
	 * deviceready検出用のイベント登録関数を呼び出す<br>
	 */
	function initialize() {
		recaiusUtils.debug("call recaiusRecordingCordova.initialize");
		document.addEventListener('deviceready', onDeviceReady, false);
	}

	/**
	 * devicereadyイベント発生時に呼び出される関数<br>
	 * デバイス状態をtrueに設定する<br>
	 */
	function onDeviceReady() {
		recaiusUtils.debug("call recaiusRecordingCordova.onDeviceReady");
		isDeviceReady = true;
	}

	/**
	 * ログイン処理をする<br>
	 * isSettingがfalseの場合、エラーコールバックが呼び出される。<br>
	 *
	 * @return trueの場合、ログイン成功又は既にログイン済み。falseの場合、ログイン処理失敗
	 */
	function login(successCallback, errorCallback, options){
		recaiusUtils.debug("call recaiusRecordingCordova.login");
		// 接続先URLの取得
		var url = options["url"]
		delete options["url"];
		// JSON文字列へ変換
		var jsonText = JSON.stringify(options);
		recaiusUtils.debug(jsonText);
		// リクエスト実行
		recaiusUtils.requestApi("POST", url, "application/json", jsonText, false, successCallback, errorCallback);
	}

	/**
	 * ログアウト処理をする<br>
	 */
	function logout(successCallback, errorCallback, options){
		recaiusUtils.debug("call recaiusRecordingCordova.logout");
		var url = options["url"];
		recaiusUtils.requestApi("POST", url, "application/json", "", false, successCallback, errorCallback);
	}

	/**
	 * 録音を開始する<br>
	 * コールバック関数に引き渡される返却値は成功時はBLOB<br>
	 * 失敗時は、コード及びメッセージ<br>
	 *
	 * @param successCallback 成功時のコールバック関数。recaiusSpeechRecognition.recordingStartSuccessを指定する。
	 * @param errorCallback 失敗時のコールバック関数。recaiusSpeechRecognition.recordingStartErrorを指定する。
	 * @param options 録音関連情報を指定する引数<br>
	 * options =<br>
	 * {<br>
	 *   "buffer_time":音声データのバッファサイズを設定(ミリ秒)を指定する。必要な最小バッファサイズ以下の場合、最小バッファサイズが採用される。<br>
	 * }
	 *
	 **/
	function recordingStart(successCallback, errorCallback, options){
		recaiusUtils.debug("call recaiusRecordingCordova.recordingStart");
		if(!isDeviceReady){
			errorCallback("E802", "Device情報が読み込めていません。");
			return;
		}
		try{
			cordova.exec(function(byteArray) {
				recaiusUtils.debug("call recStart success");
				recaiusUtils.debug("len=[" + byteArray.byteLength + "][" + byteArray + "]");
				successCallback(byteArray);
			},
			function(message) {
				recaiusUtils.debug("call recStart error");
				recaiusUtils.debug(message);
				errorCallback("E80X", message);
			},
			'RecaiusRecordingPlugin', 'recordingStart', [options]);
    	}catch(e){
    		recaiusUtils.debug("call recStart Exception " + e);
    	}
	}

	/**
	 * 録音を停止する<br>
	 * コールバック関数に引き渡される返却値はコード及びメッセージ<br>
	 *
	 * @param successCallback 成功時のコールバック関数。recaiusSpeechRecognition.recordingStopSuccessを指定する。
	 * @param errorCallback 失敗時のコールバック関数。recaiusSpeechRecognition.recordingStopErrorを指定する。
	 *
	 **/
	function recordingStop(successCallback, errorCallback){
		recaiusUtils.debug("call recaiusRecordingCordova.recordingStop");
		try{
			cordova.exec(function(message) {
				recaiusUtils.debug("call recStop success");
				recaiusUtils.debug(message);
				successCallback("S00X", message);
			},
			function(message) {
				recaiusUtils.debug("call recStop error");
				recaiusUtils.debug(message);
				errorCallback("E80X", message);
			},
			'RecaiusRecordingPlugin', 'recordingStop', []);
    	}catch(e){
    		recaiusUtils.debug("call recStart Exception " + e);
    	}
	}

	// 公開API
	return {
		initialize: initialize,
		login: login,
		logout: logout,
		recordingStart: recordingStart,
		recordingStop: recordingStop,
	}
})();
