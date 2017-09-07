function spreadSheetData(ssId){
  return function (sheetName){
    return SpreadsheetApp.openById(ssId)
                         .getSheetByName(sheetName)
                         .getDataRange().getValues();
  };
}

var functions = {
  getClassTable: {
    cachename:'classData',
    ssid:DATA_SSID,
    sheetname:LESSONS_SHEET,
    haeder:['student', 'groupName', 'subject', 'tutor']
  },
  getAddressTable: {
    cachename:'addressData',
    ssid:ADDRESS_SSID,
    sheetname:ADDRESS_SHEET,
    header:['name','furigana','email','account','S','英','数','化','生','物','国','社','test']
  },
  getReplaceTable: {
    cachename:'replaceData',
    ssid:ADDRESS_SSID,
    sheetname:REPLACE_SHEET,
    header:['fullName','furigana','shortName']
  }
};

function getDataFromTable() {
  var data = reportCache2(cachename,spreadSheetData(ssid)(sheetname));//reportCache2の引数はreportCacheより多い
  Logger.log(data[0]);
  data.unshift(header);
  return convert(data);
}


/**
全ての授業の
{ student: '生徒名', groupName: 'クラス名', subject: '教科', tutor: '担当講師名'}
の形のオブジェクトのリストを返す．
オブジェクトのリストをキャッシュしないのはキャッシュの容量制限への対処．
生のデータをキャッシュしてやれば容量は足りる．
*/
function getClassTable() {
  var data = reportCache(classData);
  Logger.log(data[0]);
  data.unshift(['student', 'groupName', 'subject', 'tutor']);
  return convert(data);

  function classData(){ return spreadSheetData(DATA_SSID)(LESSONS_SHEET);}
}

/**
全ての講師の
{ name: '名前', furigana: 'ふりがな', email: 'xxxx@xxxx.jp', account: 'xxxx@gmail.com', attr: ['S','数'] }
の形のオブジェクトのリストを返す．attrはスタッフ，担当教科などの属性．
*/
function getAddressTable(){
  var data = reportCache(addressData);
  data.unshift(['name','furigana','email','account','S','英','数','化','生','物','国','社','test']);
  return convert(data);
  
  function addressData(){ return spreadSheetData(ADDRESS_SSID)(ADDRESS_SHEET);}
}

/* 全ての講師名とふりがな，短縮名のリストを返す */
function getReplaceTable(){
  var data = reportCache(replaceData);
  data.unshift(['fullName','furigana','shortName']);
  return convert(data);
  
  function replaceData(){ return spreadSheetData(ADDRESS_SSID)(REPLACE_SHEET);}
}

/* 2次元配列をテーブルに変換 */
function convert(array){
  var keys = _.head(array);
  return _.tail(array).map(function(row){
    return _.zipObject(keys,row);
  });
}


/* 授業を持っている講師名のリストを返す */
function getTutorData(){
  return reportCache(tutorData);
  
  function tutorData() { return spreadSheetData(DATA_SSID)(TUTORS_SHEET);}
}

/*
function allDataExtract() {
  return SpreadsheetApp.openById(GROUP_SSID)
                       .getSheetByName(MAIN_SHEET)
                       .getRange(ALLDATA_RANGE).getValues();
}
*/


/* cacheKeyのキャッシュがあれば読み出し，なければdataFuncのデータをキャッシュに書き込んでから返す． */
function reportCache(dataFunc) {
  var cacheKey = dataFunc.name;//dataFuncの名前をcacheKeyに設定
  var expirationTime = EXPIRATIONTIME;//60*60*24; //cache for 24 hours
  var cache = CacheService.getScriptCache();//このスクリプトのcacheserviceを呼び出す．
  var cached = cache.get(cacheKey);//cacheからcachekeyのデータを取り出す．
  if (cached != null) {
    return JSON.parse(cached);
  }
  var orgData = dataFunc();
  var contents = JSON.stringify(orgData);
  cache.put(cacheKey, contents, expirationTime);
  return orgData;
}

/* 全てのキャッシュをクリアする */
function clearCachedData(){
  var cache = CacheService.getScriptCache();
  cache.removeAll(['indexHtml','tutorData','lessonData','classData','addressData','replaceData',]);
}
