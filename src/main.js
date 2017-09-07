/**
 * Serves HTML of the application for HTTP GET requests.
 * If folderId is provided as a URL parameter, the web app will list
 * the contents of that folder (if permissions allow). Otherwise
 * the web app will list the contents of the root folder.
 *
 * @param {Object} e event parameter that can contain information
 *     about any URL parameters provided.
 */
//////////以下は global constant//////////
var TableData = {//実験用
  REPORT_FOLDER_NAME: 'newReportTest',//覚書のファイル類を置くフォルダ名

  GROUP_SSID: '1Z1oxOkC0u5cp_IrZUjV0Uf3ElHlRlk8fIOrH3QP4Xiw',//クラス表のSpreadsheet ID '2015年09月' コピー
  GROUP_SS_NAME: '2016年04月',
  MAIN_SHEET: '2016class04',//クラス表のシート名
  
  DATA_SSID: '1wAO1Z9406Zhnl-9Oj1ztpnpaQGRRjvzr6H-ABz6YO_E',//データをセットする Spreadsheet ID 'alldata201509' マイドライブのコピー
  DATA_SS_NAME: 'alldata201507',
  LESSONS_SHEET: 'lessons',
  TUTORS_SHEET: 'tutors',
  
  //ADDRESS_SSID: '1U_vyFluLydQdnYI8GmwQrdtUMYeNV4tGCD0YXGEhqNU',//email address の Spreadsheet ID マイドライブのコピー
  ADDRESS_SSID: '1mzdpO56I_rxgZpoSIYBpQ6RrWgTSWFg33ug140qcO-k',//オリジナル
  ADDRESS_SS_NAME: '講師アドレス',
  ADDRESS_SHEET: '2016',
  REPLACE_SHEET: 'replace',
  
  //PROGRESS_SSID: '0AlJwaXHsI_ZJdHNQNHdVb0g4LUtVUkFuV1BIS2loeXc'//数学科進度表のSpreadsheet ID '2013前期数学科進度表'
  
  REPORT_SSID: '1dHNz0kb-ilXvrGUojRlr2WTEpoNXwN4VHamZGUjhGeE',//授業報告一覧Spreadsheet ID '2015後期授業報告一覧' コピー
  REPORT_SS_NAME: '2015後期授業報告一覧',
  
  URL: 'https://sites.google.com/site/sjwadahome/test',//メビオのURじ
  REGISTRAR: 'sjwada@gmail.com',//教務のメールアドレス
  EXPIRATIONTIME: 1
};
var REPORT_FOLDER_NAME = 'newReportTest';//覚書のファイル類を置くフォルダ名
var GROUP_SSID = '1Z1oxOkC0u5cp_IrZUjV0Uf3ElHlRlk8fIOrH3QP4Xiw';
//var GROUP_SSID = '1Jp_JBmLdIx2gia2eMuKZAkj5BpV6ejrVvl4wDUFxdys';//クラス表のSpreadsheet ID '2015年09月' コピー
var GROUP_SS_NAME = '2016年04月';
var MAIN_SHEET = '2016class04';//クラス表のシート名

var DATA_SSID = '1wAO1Z9406Zhnl-9Oj1ztpnpaQGRRjvzr6H-ABz6YO_E';//データをセットする Spreadsheet ID 'alldata201509' コピー
var DATA_SS_NAME = 'alldata201507';
var LESSONS_SHEET = 'lessons';
var TUTORS_SHEET = 'tutors';

//var ADDRESS_SSID = '1U_vyFluLydQdnYI8GmwQrdtUMYeNV4tGCD0YXGEhqNU';//email address の Spreadsheet ID コピー
var ADDRESS_SSID = '1mzdpO56I_rxgZpoSIYBpQ6RrWgTSWFg33ug140qcO-k';//オリジナル
var ADDRESS_SS_NAME = '講師アドレス';
var ADDRESS_SHEET = '2016';
var REPLACE_SHEET = 'replace';

//var PROGRESS_SSID = '0AlJwaXHsI_ZJdHNQNHdVb0g4LUtVUkFuV1BIS2loeXc'//数学科進度表のSpreadsheet ID '2013前期数学科進度表'

var REPORT_SSID = '1dHNz0kb-ilXvrGUojRlr2WTEpoNXwN4VHamZGUjhGeE';//授業報告一覧Spreadsheet ID '2015後期授業報告一覧' コピー
var REPORT_SS_NAME = '2015後期授業報告一覧';

var URL = 'https://sites.google.com/site/sjwadahome/test';//メビオのURL
var REGISTRAR = 'sjwada@gmail.com';//教務のメールアドレス
var EXPIRATIONTIME = 1;

var BSTNAME = '福田　静香';//開始行の生徒の名前
var ESTNAME = '吉岡　克浩';//終了行の生徒の名前
/*
var ALLDATA_RANGE = 'B11:BO147';
var TUTOR_START_COL = 11;//1列目を0列目とカウントして，英語の講師名が書いてある最初の列
var STUDENT_NAME_COL = 2;//1列目を0列目とカウントして，生徒名が書いてある列
var FURIGANA_COL = 3;//1列目を0列目とカウントして，生徒名のフリガナが書いてある列
var AGE_COL = 4;//1列目を0列目とカウントして，年齢が書いてある列
var SCHOOL_NAME_COL = 5;//1列目を0列目とカウントして，出身高校名が書いてある列
var GROUP_NAME_COL = 9;//1列目を0列目とカウントして，クラス名が書いてある列
*/
//For lodash.js library
var _ = _.load();

//////////global constant ここまで//////////
// It's reporttest6
function doGet() {
  var pageTitle = 'Lecture Report test6';
  var index = reportCache(indexHtml);
  return HtmlService.createHtmlOutput(index)//indexの中身をhtmlとしてクライアントに渡す
                    .setTitle(pageTitle)
                    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  function indexHtml(){
    var template = HtmlService.createTemplateFromFile('Index');//Index.htmlをテンプレートとして読み出す
    template.tData = JSON.stringify(getTutorData());//tutorDataもtemplateにくっつける
    template.loginUserName = '';// getActiveUserName();//ログインユーザー名をフルネームで返す．これはcacheできない
    return template.evaluate().getContent();//evaluate,getcontentでhtml テキストを返す． 
  }
}