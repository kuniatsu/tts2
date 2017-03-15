# TextToSpeechのAPIを使ってみ #
https://texttospeech11.herokuapp.com/

### サマリ ###

TextToSpeechのAPIから取得したMP3の結合サンプルWebアプリ


```
#!html

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
</head>
<body>
  <div>
  　<input type="text" id="atext">
    <button type="button" id="aplay">Aplay</button>
  </div>
  <div>
  　<input type="text" id="btext">
    <button type="button" id="aplay">Bplay</button>
  </div>
<hr>
    <button type="button" id="allplay">Allplay</button>
</body>
</html>
```

上記のHTMLで
aplayが押された場合にはBingのTextToSpeechでatextに書かれているテキストを読み上げるMP3がDLされる。

bplayが押された場合にはgoogleのTextToSpeechでbtextに書かれているテキストを読み上げるMP3がDLされる。

Allplayが押された場合にはaplayとbplayでDLされるMP3を結合して１つのファイルとしてDLされる。

### セットアップ ###
⓵ nodeとnpmをインストール

⓶ ```npm install```でnode_modulesをインストール

⓷ クライアントでのJavascriptを変更したい場合、
```npm run watch```を実施したら、新変更があると、**public/bundle.js**が自動にアップデートされる

**public/bundle.js**はブラウザで使うJavascriptファイル

⓸ ```npm run start```でローカルサーバを起動

### Heroku設定 ###
オーディオファイルを修理ため、ffmpegを使ってる。そのため、Herokuサーバでffmpegをインストールしなければならない

⓵ ```https://dashboard.heroku.com/apps/｛アプリ名｝/settings```画面に移動

⓶ Buildpacksのところ、「Add buildpack」ボータンを押し、```https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git```のURLでffmpegのbuildpackを追加。欲しい結果は：

![無題.png](https://bitbucket.org/repo/z8j9nEz/images/1703188403-%E7%84%A1%E9%A1%8C.png)

⓷ herokuアプリを再デプロイ

### BingのAPI ###

⓵ https://www.microsoft.com/cognitive-services/en-US/subscriptions?mode=NewTrials
に移動、SignUp/Loginする

⓶ ```Bing Speech - Free```を選び、申し込みます。

⓷ https://www.microsoft.com/cognitive-services/en-US/subscriptions にあるAPIキーを取り、**src/bing.js**ファイルにある**BingSpeechAPIKey**変数に置く

**長所**：MP3をサーポット、英語のボイスは7種類、日本語のボイスは2種類

**短所**：無料アカウントでは：1 ヶ月あたり 5,000 のトランザクションしかない

### WatsonのAPI ###

⓵ https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson
に移動、SignUpする

⓶ https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials
に書いてある手順で**text-to-speech**APIを申し込む

⓷ usernameとpasswordを取ったら、**src/watson.js**ファイルにある**text_to_speech**変数に置く

**長所**：毎月、百万の文字以内は無料。

```I am Peter and I like Iron Maiden```は35文字ぐらい。全部のトランザクションはこの長さなら、1 ヶ月あたり 28,000以上のトランザクションができるようである

**短所**：MP3をサーポットしない、英語のボイスは4種類、日本語のボイスは一個しかない