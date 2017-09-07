function checkClassTable(){
  /*
  main.gsの
  BSTNAME
  ESTNAME
  GROUP_SSID
  GROUP_SS_NNAME
  MAIN_SHEET
  ADDRESS_SSID
  ADDRESS_SHEET
  を設定すればチェックできる． 
  */
  var classTable = makeClassTable();

  /* For Debug
  Logger.log(classTable[0]);
  Logger.log(classTable[classTable.length-1]);
  */
  
  var matchTutorKeys = strHasExp(/^\s*((英語|数学|化学|生物|物理)[1-3]|小論|小面|現国|古典|(社会|他[1-4])講師)\s*$/);
  var matchAnotherKeys = strHasExp(/^\s*(E|M|C|B|P|J|S|sr)\s*$/);
  var message = '';
  
  //講師名のチェック．
/*  function alt(func1,func2){ return function(val){ return func(val)||func2(val);};}
  function identity(func){ return function(val){ retun val;};}
  var printMsg = function(obj,p,tutor) { return obj['氏名'] + ' ' + p + ' ' + 'の短縮名' + ' ' + tutor + 'は定義されていません．';}
  classTabe.map(function(obj){
    Object.keys(obj).map(function(p){
      alt(identity(obj[p])
    });
  });
*/
  classTable.forEach(function(obj){
    Object.keys(obj).forEach(function(p){
      if(obj[p] !== ''){
        if(matchTutorKeys(p)){
          var tutor = obj[p].replace(/P\s*$/,'');
          if(!isShortName(tutor))
            //Logger.log('%s %s の短縮名 %s は定義されていません．',obj['氏名'], p, tutor);
            message += obj['氏名'] + ' ' + p + ' ' + 'の短縮名' + ' ' + tutor + 'は定義されていません．\n';
        }
        else if(matchAnotherKeys(p)){
          var tutors = obj[p].split('，');
          tutors.forEach(function(tutor){
            if(!isShortName(tutor))
              //Logger.log('%s %s の短縮名 %s は定義されていません．',obj['氏名'], p, tutor);
              message += obj['氏名'] + ' ' + p + ' ' + 'の短縮名' + ' ' + tutor + 'は定義されていません．\n';
          });
        }
      }
    });
  });
  
  Logger.log(message);
}

function update(){//データペース用シートの初期化及びアップデート
  var ss = SpreadsheetApp.openById(DATA_SSID); 
  var sheet = ss.getSheetByName(LESSONS_SHEET);
    
  sheet.clear()
       .clearNotes();
  var columnWidthList = [100, 40, 100, 80, 30, 800];
  columnWidthList.forEach(function(e,i) {sheet.setColumnWidth(i+1,e);});
  
  var classData = allList();
  sheet.getRange(1,1,classData.length,classData[0].length)
       .setValues(classData);  
  
  var tutorsSheet = ss.getSheetByName(TUTORS_SHEET);
  tutorsSheet.clear()
             .clearNotes();
  var tutorList = alltutorList().map(function(e){return [e];});
  tutorsSheet.getRange(1,1,tutorList.length,1)
             .setValues(tutorList);
  clearCachedData();
}

//授業報告用シートの初期化
//これは最初に一度走らせるだけ．運用が始まったあとでこれを走らせるとそれまでの報告が消えてしまうので注意！
function defaultsheet(){
  var ss = SpreadsheetApp.openById(REPORT_SSID);
  
  //シートを1枚だけ残して全消去．
  ss.getSheets()
    .forEach(function(e,i){if(i!=0){ss.deleteSheet(e);}});
  
  //最後に残った1枚のシートをデフォルトのシートにする
  
  var sheet = ss.getActiveSheet();
  var allrange = sheet.getDataRange();
  var row = sheet.getMaxRows();
  var column = sheet.getMaxColumns();
  var columnWidthList = [70, 70, 80, 180, 70, 180, 180, 180, 60, 400, 400, 200];
  var titleList = [['クラス', '科目', '担当講師', '授業日など', '出欠状況', 'テキスト', '進度',
                    '復習テスト範囲', '成績', 'この生徒に対するコメント', 'クラス全体に対するコメント', '送信日時']];

  /*setWraps用設定*/
  var wrap_row = [],
      wraps = [];
  for(var i=0; i<column; i++){wrap_row.push(true);}
  for(var j=0; j<row-1; j++){wraps.push(wrap_row);}
  
  sheet.setName('default'); 
  allrange.clear()
          .clearNote();
  sheet.getRange(2, 1, row-1, column)
       .setWraps(wraps)
       .setVerticalAlignment('top')
       .setHorizontalAlignment('left');
  sheet.setRowHeight(1, 30);
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,titleList[0].length)
       .setBackground('#FFFF66')
       .setVerticalAlignment('center')
       .setHorizontalAlignment('center')
       .setFontWeight('bold').setFontSize('11');
  columnWidthList.forEach(function(e,i) {sheet.setColumnWidth(i+1,e);});
  sheet.getRange(1,1,1,titleList[0].length)
       .setValues(titleList);
  sheet.getRange(1, 9)
       .setValue('成績')
       .setNote('赤数字は不合格\n青数字は優秀');
}

//classTableから生徒名を読み取り，その生徒分だけ「defaultsheet」で作成したシートをコピーし，各シートに生徒名をつける．
function newsheet(){
  var reportSS = SpreadsheetApp.openById(REPORT_SSID);
  var classTable = makeClassTable()
                  .sort(compareElem('フリガナ'));//五十音順で並べ替え
  var tempSheet = reportSS.getSheetByName('default');
  
  classTable.forEach(function(student,i){
    reportSS.insertSheet(student['氏名'], i+1, {template:tempSheet})
            .getRange(1,10)
            .setNote('フリガナ：' + student['フリガナ'] + '\n'
                   + '学年：'     + student['学年'] + '\n'
                   + '高校名：'   + student['学校名']);
  });
}
