//　IBMのWatsonのTextToSpeechのAPI：https://github.com/watson-developer-cloud/node-sdk#text-to-speech
//　一つのアカウントでは、30日無料体験の程度があり、ご注意ください

const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// Watsonのイニット
// ユーザー名とパスワード制作は：https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials
const text_to_speech = new TextToSpeechV1({
  username: 'a51c86b6-b2f1-40d6-9804-40451e5c9a9e',
  password: 'vfDPYXegAdoj'
});

//　渡されたテキストで、WatsonのAPIを呼び、
//　オーディオデータを取り、一旦WAVファイルに保存し、
//　MP3ファイルに変換、WAVファイルを削除、
//　callbackでファイルをクライアントに返す
//　https://github.com/watson-developer-cloud/node-sdk#text-to-speech
const textToSpeech = (text, callback) => {

  //　サーバに保存ための変数
  const fileName = `mp3/watson/${Date.now()}-${text}`;
  const outputStream = fs.createWriteStream('public/' + fileName + '.wav');

  //　保存終わった
  outputStream.on('finish', () => {

    //　WatsonのAPIはMP3サーポットしないため、一旦WAVファイルに保存、
    //　保存できてから、ffmpegでMP3に変換
    const convertStream = fs.createWriteStream('public/' + fileName + '.mp3');

    // MP3に変換できた
    convertStream.on('finish', () => {
      //　WAVファイルを削除、レスポンスを返す
      fs.unlink('public/' + fileName + '.wav', () => {});
      callback(fileName + '.mp3');
    });

    //　変換を実施
    ffmpeg('public/' + fileName + '.wav').format('mp3').output(convertStream).run();
  });

  //　WatsonAPIを呼び、オーディオデータを取り、WAVファイルに保存
  text_to_speech.synthesize({
    text,
    accept: 'audio/wav'
  }).pipe(outputStream);
}

module.exports = {
  textToSpeech
};
