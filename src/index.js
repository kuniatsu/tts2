const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const app = express();

const bing = require('./bing.js');
const watson = require('./watson.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join('index.html'));
});

//　bingのAPIを使う
app.get('/bing', (req, res) => {
  bing.textToSpeech(req.query.text, fileName => {
    //　ここに着いたとき、ファイルはもうサーバに保存できた
    res.sendFile(path.resolve('public', fileName));
  });
});

//　watsonのAPIを使う
app.get('/watson', (req, res) => {
  watson.textToSpeech(req.query.text, fileName => {
    //　ここに着いたとき、ファイルはもうサーバに保存できた
    res.sendFile(path.resolve('public', fileName));
  });
});

//　両方を使い、二つの結果ファイルをマージして返す
app.get('/both', (req, res) => {

  const bingText = req.query.bing;
  const watsonText = req.query.watson;

  //　最初はundefinedで設定。ファイルが保存されたら、正しい値セット
  let bingFileName, watsonFileName;

  //　二つのファイルが準備され、マージして返す
  const callback = () => {
    if (bingFileName && watsonFileName) {

      const mergedFileName = `public/mp3/both/${Date.now()}-${bingText}-${watsonText}.mp3`;

      //　ffmpegでマージする
      //　まず、二つのファイル名で、ffmpegにファイルをインプットします
      ffmpeg('public/' + bingFileName)
            .input('public/' + watsonFileName)
      //　マージできたとき、クライエントにファイルを返す
            .on('end', () => res.sendFile(path.resolve('.', mergedFileName)))
      // マージし始まる
            .mergeToFile(mergedFileName, 'public/mp3/both');
    }
  }

  //　それぞれのAPIを呼ぶ
  bing.textToSpeech(bingText, fileName => {
    bingFileName = fileName; callback();
  });
  watson.textToSpeech(watsonText, fileName => {
    watsonFileName = fileName; callback();
  });
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
