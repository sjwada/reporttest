function sendEmailAndReport(emailSubject,emailBody,reportJSONData){
  var reportData = JSON.parse(reportJSONData);
  var addressList = nameToAddress(reportData.recipients.concat(reportData.addTutorArray));
  var replyTo = nameToAddress([reportData.sender])[0];
  sendMail(addressList, emailSubject, emailBody, {replyTo: replyTo/*, bcc: REGISTRAR*/});
  report(reportData);
  return true;
}

function nameToAddress(names){
  var addressTable = getAddressTable();
  var addressHash = _.zipObject(_.pluck(addressTable,'name'),_.pluck(addressTable,'email'));
  return names.map(function(name){ return addressHash[name]; });
}

function nameToAddress2(names){//遅い
  var addressTable = getAddressTable();
  return names.map(function(name){ return _.result(_.find(addressTable,'name',name),'email'); });
}

function sendMail(to,subject,emailBody,option) {
  //GmailApp.sendEmail(to, subject, emailBody,option);
  Logger.log(emailBody);
}

function report(data){//データを受け取ってスプレッドシートに書き込む
  var ss = SpreadsheetApp.openById(REPORT_SSID);
  var dataLength = data['studentArray'].length;
  for (var i=0; i<dataLength; i++){
    var stData = data['studentArray'][i];
    var sheet = ss.getSheetByName(stData['studentName']);
    var rownum = sheet.getLastRow();
    var values = personalData(data, stData);
    //var lengthOfValues = values.length;
    var fontColors = new Array(12);//←マジックナンバー
    for(var j = 0; j < fontColors.length; j++) fontColors[j] = '#000000';

    if(stData['check']=='遅刻') fontColors[4] = 'green';//マジックナンバー
    else if(stData['check']=='欠席') fontColors[4] = 'red';//マジックナンバー
    
    if(stData['evaluation']=='不合格') fontColors[8] = 'red';//マジックナンバー
    else if(stData['evaluation']=='優秀') fontColors[8] = 'blue';//マジックナンバー
    
    sheet.getRange(rownum+1, 1, 1, 12).setValues(values).setFontColors([fontColors]);//マジックナンバー
  }
  // progressForEng3(data);//ForEng3
}

function personalData(data,stData) {
  var values = [[stData['groupName'], data['subject'], data['sender'], data['session'], stData['check'], data['textNames'],
                data['progress'], data['testRange'], '', stData['comment'], data['totalComment'], getCurrentTimeStamp()]];
  if(stData['testResult']!=''){//テスト結果があれば満点の値を付して記録．
    values[0][8] = "'"+stData['testResult']+'/'+data['totalScore'];//マジックナンバー
  }
  return values;
}

function getCurrentTimeStamp() {//スプレッドシートに書き込み時刻を書いておくための関数
    var weeks = new Array('日', '月', '火', '水', '木', '金', '土');
    var d = new Date();
 
    // 年月日・曜日・時分秒の取得
    var month  = d.getMonth() + 1;
    var day    = d.getDate();
    var week   = weeks[ d.getDay() ];
    var hour   = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
 
    // 1桁を2桁に変換する
    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}
    if (hour < 10) {hour = '0' + hour;}
    if (minute < 10) {minute = '0' + minute;}
    if (second < 10) {second = '0' + second;}
 
    // 整形して返却
    return d.getFullYear()  + '/' + month + '/' + day + '（' + week + '） ' + hour + ':' + minute + ':' + second;
}


/*
function nameToAddress(names){
  return getAddressTable().filter(inNames)//namesでfilter
                          .map(function(person){return person['email'];});//アドレスの要素のみ抽出
  
  function inNames(person){
    return names.some(function(name){return person['name'] == name;});
  }
}

*/
