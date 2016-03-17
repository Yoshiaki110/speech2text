/**
 * @class Ricaius音声認識APIを利用する際に必要なJavaScriptファイルをインポートするためのクラス。<br>
 * ユーザからは本ファイルを読み込んで頂く<br>
 * @example 利用環境に応じて下記行を追加して必要なファイルを読み込むようにする。
 *   ■Cordova版を利用する場合（但し利用アプリ側で既にcordova.jsの設定をされている場合は、cordova.jsの読み込みは不要です）
 *   &lt;script type=&quot;text/javascript&quot; src=&quot;./cordova.js&quot;&gt;&lt;/script&gt;
 *   &lt;script type=&quot;text/javascript&quot; src=&quot;javascripts/recaius-speech-recognition-import.js&quot;&gt;&lt;/script&gt;
 *
 *   ■WebRCT版を利用する場合
 *   &lt;script type=&quot;text/javascript&quot; src=&quot;javascripts/recaius-speech-recognition-import.js&quot;&gt;&lt;/script&gt;
 *
 * @version 1.0.0
 */
var recaiusSpeechRecognitionImport = (function() {
	/**
	 * 環境に応じて必要なJavaScriptファイルを読み込む。
	 * @todo navigator.getUserMediaでの判定にしているが、モバイルでも取得できる可能性があるため要検討
	 */
	function importJS(){
		var hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		if (! new Array().push) return false;
		var scripts;
		// 先にCordova利用可能かを判定
		if (typeof(cordova) !== "undefined") {
			scripts = new Array(
					'javascripts/recaius-utils.js',
					'javascripts/recaius-recording-cordova.js',
					'javascripts/recaius-speech-recognition.js'
				);
		}else if(hasGetUserMedia){
			scripts = new Array(
					'javascripts/recaius-utils.js',
					'javascripts/recaius-recording-webrtc.js',
					'javascripts/recaius-speech-recognition.js'
				);
		}else{
			alert("Cordova又は、navigator.getUserMediaのどちらかが利用できないとご利用いただけません。");
			return;
		}
		for (var i=0; i<scripts.length; i++) {
			document.write('<script type="text/javascript" src="' +scripts[i] + '"><\/script>');
		}
	}
	return {
		import: importJS
	};
}());
recaiusSpeechRecognitionImport.import();
