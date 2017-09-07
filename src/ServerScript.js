function makeClassTable() {
  const orgData = spreadSheetData(GROUP_SSID)(MAIN_SHEET)
    .map(function(row){
      return row.map(function(str){// 全角英数字を半角に変換
        return !_.isString(str) ? str :str.replace(/^[\s　]+$/,'').replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(chr) {
          return String.fromCharCode(chr.charCodeAt(0) - 0xFEE0);
        });});});
  
  //Logger.log(orgData[7]);
  
  // 使うデータの行と列を取得
  const titleRowStr = 'コード',//タイトル行に固有の文字列
      startRowStr = BSTNAME,//開始行の生徒名
      endRowStr   = ESTNAME;//最終行の生徒名
  
  var rowNum = rowOf(orgData),
      titleRowNum = rowNum(titleRowStr),
      startRowNum = rowNum(startRowStr),
      endRowNum   = rowNum(endRowStr);
  
  //使う行番号の配列
  var dataRowNums = [titleRowNum].concat(_.range(startRowNum, endRowNum+1));
  var isDataRow = hasElement(dataRowNums);

  //使う列番号の配列を作る
  var titleRow = orgData[titleRowNum];
  //最新のクラス(列番号が最大)の列を探す．
  var matchGroupNameCol = strHasExp(/^\s*((春|夏|冬)期|\d+月)\s*$/);
  var groupNameCol = _.findLastIndex(titleRow,matchGroupNameCol);
  orgData[titleRowNum][groupNameCol] = 'クラス名';//破壊的代入
  //使うデータの列番号の配列
  var matchTitle = strHasExp(/^\s*(氏名|フリガナ|学年|学校名|(英語|数学|化学|生物|物理)[1-3]|小論|小面|現国|古典|(社会|他[1-4])(科目|講師)|E|M|C|B|P|J|S|sr)\s*$/);
  var dataCols = _.compact(titleRow.map(function(colName,col){
    return matchTitle(colName) && col;
  })).concat(groupNameCol);
  var isDataCol = hasElement(dataCols);

  /* For Debug
  Logger.log(dataCols);
  Logger.log(filtData[0].filter(function(elm,col){return dataCols.indexOf(col) !== -1;}));
  */
  
  //使うデータのみの配列を作る
  var lastData = orgData.filter(isDataRow).
    map(function(row){
      return row.filter(isDataCol);
    });
  
  /* For Debug
  Logger.log(lastData[0]);
  Logger.log(lastData[1]);
  Logger.log(lastData[lastData.length-1]);
  */
  
  return convert(lastData);
  
  //dataのexpにマッチする行番号を返す関数を返す．
  function rowOf(data){
    return function(exp){ return _.findIndex(data,function(row){
      return row.some(strHasExp(exp));
    }); };
  }
  
  //array がiを要素に持っている時にtrueを返すpredicateを返す．
  function hasElement(array){ return function(e,i){ return array.indexOf(i) !== -1; };}
}


function allList(){//[studentName, groupName, subject, tutor]のリストを返す．
  const classTable = makeClassTable();
  const matchSubjectKeys1 = strHasExp(/^\s*((英語|数学|化学|生物|物理)[1-3]|小論|小面|現国|古典|E|M|C|B|P|J|S|sr)\s*$/);
  const matchSubjectKeys2 = strHasExp(/^\s*(社会|他[1-4])科目\s*$/);
  var result = [];
  classTable.forEach(function(student){
    Object.keys(student).forEach(function(p){
      if(student[p] !== ''){
        if(matchSubjectKeys1(p)){
          result.push([student['氏名'],student['クラス名'],p,student[p]]);
        }
        else if(matchSubjectKeys2(p)){
          result.push([student['氏名'],student['クラス名'],student[p],student[p.replace(/科目/,'講師')]]);
        }
      }
    });
  });
  //Logger.log(result);
  const replaceTable = getReplaceTable();
  const replaceHash = _.zipObject(_.pluck(replaceTable,'shortName'),_.pluck(replaceTable,'fullName'));
  //replaceTable.forEach(function(e,i){replaceHash[e['shortName']] = e['fullName'];});//(key:略称,value:フルネーム)のハッシュを作る
  
  result.forEach(function(klass){
    if(strHasExp(/P$/)(klass[3])){
      klass[2] += '個人';
      klass[3] = klass[3].replace('P','');
    }
    klass[3] = klass[3].split('，')
                       .map(function(e){return replaceHash[e];})//略称をフルネームに変換
                       .join('，');
  });
  
  return result;
}

function getActiveUserName(){//ログインユーザーのフルネームを返す．Scriptのオーナードメインが異なると空白を返す．
  const addressTable = getAddressTable();
  const gmailAccount = Session.getActiveUser().getEmail();
  if(gmailAccount == '') return '';
  return addressTable.filter(function(e){return e['account'] == gmailAccount;})[0]['name'];
}

function alltutorList() {//called by update()
  const classTable = getClassTable();
  var allTutors = classTable.filter(function(student){return student['tutor'] != '' && student['subject'].match(/[^a-zA-Z]+/);})//空欄と授業担当以外の講師を除く
                            .map(function(student){return student['tutor'];})//講師欄のみ取り出す
                            .concat(['神尾守則', '石井宏明']);//←こういうデータも別の場所に書いた方が良い．
  allTutors = uniqueArray(allTutors);//講師のダブりを取る．
  //Logger.log(allTutors);
  return tutorSort(allTutors);//ソートして返す
}

function tutorSort(tutorList) {//called by alltutorList()
  const addressTable = getAddressTable();
  var furiganaHash = _.zipObject(_.pluck(addressTable,'name'),_.pluck(addressTable,'furigana'));
  //getAddressTable().forEach(function(e){furiganaHash[e['name']] = e['furigana'];});//ふりがな付きのハッシュを作る．
  //Logger.log(furiganaHash);
  return tutorList.map(function(name){return [name,furiganaHash[name]];})//ふりがな付きのリストにする．
//                  .map(function(e){
//                    Logger.log(e);
//                    return e;})
                  .sort(compareElem(1))//ふりがなでソート
                  .map(function(e){return e[0];});//名前だけ取り出す．
}

//略称であればtureを返すpredicateを返す
function isShortName(name) {//called by checkClassTable()
  if(!isShortName.replaceTable) isShortName.replaceTable = getReplaceTable();
  if(!isShortName.shortnameList) isShortName.shortNameList = _.pluck(isShortName.replaceTable,'shortName');
  return _.contains(isShortName.shortNameList,name);
}

//str文字列かつstrがexpにマッチするpredicateを返す
function strHasExp(exp){ return function(str){ return (_.isString(str) && str.match(exp) !== null); };}

function compareElem(key){//2次元配列またはオブジェクトの配列を同じキーでソートするための関数
  return function(a, b){
    if(a[key]<b[key]) return -1;
    else if(a[key]>b[key]) return 1;
    return 0;
  };
}

function uniqueArray(array) {//配列の重複を取り除く
  var storage = {},
      uniqueArray = [],
      value,
      len = array.length;
  for (var i = 0; i < len; i++) {
    value = array[i];
    if (!(value in storage)) {
      storage[value] = true;
      uniqueArray.push(value);
    }
  }
  return uniqueArray;
}
