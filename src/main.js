const $ = require('jquery');
const request = require('superagent');

// 「url」にあるMP3ファイルを「text」のファイル名でダウンロード
const downloadTextToSpeechFile = (url, text) => {
  const downloadLink = document.createElement("a");
  downloadLink.download = text;
  downloadLink.href = url;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  delete downloadLink;
}

//　DOMが準備した
$(() => {

  //　Bing
  $('#aplay').click(() => {
    const text = $('#atext').val();
    request
        .get('/bing')
        .query({ text })
        .responseType('blob')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            downloadTextToSpeechFile(URL.createObjectURL(res.body), 'bing_' + text);
          }
        });
  });

  // Watson
  $('#bplay').click(() => {
    const text = $('#btext').val();
    request
        .get('/watson')
        .query({ text })
        .responseType('blob')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            downloadTextToSpeechFile(URL.createObjectURL(res.body), 'watson_' + text);
          }
        });
  });

  // 両方
  $('#allplay').click(() => {
    const bing = $('#atext').val();
    const watson = $('#btext').val();
    request
        .get('/both')
        .query({ bing, watson })
        .responseType('blob')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            downloadTextToSpeechFile(URL.createObjectURL(res.body), 'both_' + bing + '_' + watson);
          }
        });
  });
});
