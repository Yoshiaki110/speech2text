RECAIUS音声認識APIサンプルアプリケーション
====

このプロジェクトは、RECAIUSの音声認識APIの利用方法を理解するためのサンプルアプリケーションです。

## Description
このプロジェクトのアプリケーションを動作させる場合は、事前にRECAIUS APIのディベロッパー登録が必要です。
登録は、[こちらのサイト](https://developer.recaius.io/jp/top.html)から行えます。

ディレクトリの構成は下記のとおりです。

```
bin/
  www                 // 実行スクリプト
lib/                  // ライブラリ
  recaius/            // RECAIUS WebAPIのHelperクラス
    speech2text/      // 音声認識API
      index.js
public/               // フロント向けリソース
  javascript/
    speech2text.js
  styleseet/
    style.css
routes/               // ルーティング
  api/                // WebAPI
  page/               // Webページ
  index.js            // 
views/                // 画面のテンプレート
  layout.jade         // 共通テンプレート
  speech2text.jade    // 音声認識サンプル画面テンプレート
```
## Demo
このアプリケーションを起動すると下記のサイトと同じような機能を試せます。

[https://app.developer.recaius.io/speech2text](https://app.developer.recaius.io/speech2text)

## Requirement
[node.js](https://nodejs.org/en/)をインストールして下さい。
推奨バージョンは長期サポート版の4系です。(2016年2月現在)
5系は動作未検証です。

## Usage & Install
[ディベロッパーサイトのチュートリアル](https://developer.recaius.io/jp/tutorial.html)を参考にして下さい。

RECAIUS Developerサイトから送られてくるログイン情報(サービス利用IDとパスワード)は、プログラムに直接書き込むのではなく、環境変数に設定することをおすすめします。

なお、ログイン情報は、/lib/recaius/speech2text/index.js で利用されています。
音声認識を行うモデルにより利用するサービス利用IDとパスワードが変更されます。

```js
    static createDefault() {
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
```

Herokuを利用する場合は下記のボタンをクリックし、ログイン情報を設定すれば簡単にアプリケーションがデプロイできます。

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Licence
* MIT
    * This software is released under the MIT License, see LICENSE.txt.
本プログラムを利用して宣伝などを行う場合、[こちらのサイト](https://developer.recaius.io/jp/contact.html)からご連絡ください。

## Author

[recaius-dev-jp](https://github.com/recaius-dev-jp)
