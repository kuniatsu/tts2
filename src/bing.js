//　BingのTextToSpeechのAPI：https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/API-Reference-REST/BingVoiceOutput
//　無料アカウントでは：1 分あたり60の合計のための各機能の毎分20。1 ヶ月あたり 5,000 のトランザクション。

const request = require('superagent');
const fs = require('fs');

//　https://www.microsoft.com/cognitive-services/en-US/subscriptions?mode=NewTrials
//　に取れるAPIキーである
const BingSpeechAPIKey = 'a76339cc3c344e02b467cfdc8ec283ab';

//　渡されたテキストで、BingのAPIを呼び、
//　オーディオデータを取り、MP3ファイルに保存し、
//　callbackでファイルをクライアントに返す
//　https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/API-Reference-REST/BingVoiceOutput#Http
const textToSpeech = (text, callback) => {

  //　APIキーでアクセスたキーを取る
  //　https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/API-Reference-REST/BingVoiceOutput#Subscription
  request
    .post('https://api.cognitive.microsoft.com/sts/v1.0/issueToken')
    .set('Ocp-Apim-Subscription-Key', BingSpeechAPIKey)
    .buffer()
    .end((err, res) => {
      if (err) {
        console.error(err);
      } else {

        const accessKey = res.text;

        //　サーバに保存ための変数
        const fileName = `mp3/bing/${Date.now()}-${text}.mp3`;
        const outputStream = fs.createWriteStream('public/' + fileName);

        //　保存した後に、レスポンスを返す
        outputStream.on('finish', () => callback(fileName));

        // BingのTextToSpeechのAPIにリクエスト
        const req = request
            .post('https://speech.platform.bing.com/synthesize')
            .set('Authorization', 'Bearer ' + accessKey)
            .set('X-Microsoft-OutputFormat', 'audio-16khz-64kbitrate-mono-mp3')
            .set('Content-Type', 'application/ssml+xml')
            .send(`<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>${text}</voice></speak>`);

        //　bingAPIのサーバからのレスポンスを取り、ファイルに保存
        req.pipe(outputStream);
      }
    });
}

module.exports = {
  textToSpeech
};
