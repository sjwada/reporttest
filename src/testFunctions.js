function testMakeClassTable(){
  Logger.log(makeClassTable());
}

function testNameToAddress(){
  var addressTable = getAddressTable();
  
  Logger.log(_.zipObject(_.pluck(addressTable,'name'),_.pluck(addressTable,'email')));
  //Logger.log(addressTable);
}



function testSpreadSheetData(){
  //function lessonData() {return spreadSheetData(DATA_SSID)(LESSONS_SHEET)()}
  var lessonData = spreadSheetData(DATA_SSID)(LESSONS_SHEET);
  //lessonData['name'] = 'lessonData';
  //Logger.log(lessonData['name']);
  Logger.log(typeof lessonData);
  Logger.log(lessonData.name);
}

function testnameToAddress(){
  var names = ['大川内豊','和田重明','髙橋元','萩原茂','神尾守則','石井宏明'];
  Logger.log(nameToAddress(names));
  //Logger.log(nameToAddress2(names));
  //Logger.log(nameToAddress3(names));
}

function testPluck() {
  var array = _.pluck([{title: 'Chthon', author: 'Anthony'},
           {title: 'Grendel', author: 'Gardner'},
           {title: 'After Dark'}],
          'author');
  Logger.log(array);
}

function testTable(){
  var library = [{title: 'SICP', isbn: '0262010771', ed: 1},
                 {title: 'SICP', isbn: '0262510871', ed: 2},
                 {title: 'Joy of Clojure', isbn: '1935182641', ed: 1}];
  var array =
    project(
      as(library,{ed: 'edition'}),
      ['title', 'edition']);
  Logger.log(array);
}

function testComplement(){
  function complement(predfunc){
    return function (){
      return !predfunc.apply(null, _.toArray(arguments));
    };
  }
  
  function isEven(n) { return (n%2) == 0; }
  var isOdd = complement(isEven);
  
  Logger.log(isOdd([2,3,4]));
  
  
}

function testStringSprit(){
  var str1 = 'あいう，えおか，きくけ';
  var str2 = 'こかき';
  Logger.log(str1.split('，'));
  Logger.log(str2.split('，'));
  Logger.log(Object.keys(str1.split('，')));
}

function testObjectValues(){
  var obj = {key1: 1, key2: 2, key3: 3};
  Logger.log(Object.values(obj));
}

function allDataExtract_test(){
  Logger.log(allDataExtract()[136]);
}

function testnewgetData(){
  clearCachedData();
  Logger.log(getReplaceTable());
  //test
  //clearCachedData();
  //Logger.log(getReplaceObj().length); 
}

function testMakeToField(){
  Logger.log(makeToField(['和田重明','髙橋元']));  
}

function testReplaceObj(){
  Logger.log(getReplaceObj());
}

function testAddressTable(){
  var addressTable = getAddressTable();
  Logger.log(addressTable);
}

function testClassTable(){
  var classTable = getClassTable();
  Logger.log(classTable[0]);
}

function testCreateNewColors(){
  var fontColors = new Array(12);// = Array.apply(null, new Array(12)).map(function(){return '#000000';});
  for(var i = 0; i < fontColors.length; i++) fontColors[i] = '#000000';
  Logger.log(fontColors);
}

function testUserName(){
  Logger.log(getActiveUserName());
}

function testGetActiveUserName(){
  var addressTable = getAddressTable();
  var gmailAccount = Session.getActiveUser().getEmail();
  Logger.log(addressTable.filter(function(e){return e['account']==gmailAccount;})[0]['name']);
}

function testAlltutorList(){
  Logger.log(alltutorList());
}

function testTutorSort(){
  var data = getClassTable();
  var allTutors = data.filter(function(e){return e['tutor'] != '' && e['subject'].match(/[^a-zA-Z]+/);})
                      .map(function(e){return e['tutor'];});
  allTutors = uniqueArray(allTutors);
  //Logger.log(allTutors);
  Logger.log(tutorSort(allTutors));
}

function testAllList(){
  Logger.log(allList().map(function(e){return [e[2],e[3]];}));
}

function testNewstudentList(){
  //newstudentList(groupSubjectList,tutor);
  var lessonData = getLessonData();
  var groupSubjectList = [['RI','物理1'],['RG', '物理1']];
  var tutor = '和田重明';
  Logger.log(newstudentList(groupSubjectList,tutor));
  function newstudentList(groupSubjectList,tutor){//（クラス，科目，講師）でfilterした [クラス,生徒] のリストを取得
    var studentGroupList = lessonData.filter(
      function(ldElm){
        return ldElm[3]==tutor;
      });
    Logger.log(studentGroupList);
    studentGroupList = studentGroupList.filter(
      function(scElm){
        return groupSubjectList.some(
          function(csElm){
            return (csElm[0]==scElm[1] && csElm[1]==scElm[2]);
          });
      });
    return studentGroupList.map(function(stElm){return [stElm[1], stElm[0]];});//[クラス,生徒名]のリスト
  }//End studentList
}

function testTextList() {
  var subjectHash = {
    A: {sub:1, text:2},
    B: {sub:2, text:3}
  };
  
  Logger.log(subjectHash['C']);
}

function testRegEx(){
  var lessonData = getLessonData();
  var lessonNameList = [];
  var pattern = /^([A-Z]+)|^([^A-Z]+?)\d?(個人|特|強化)?$/;
  //var pattern = /((\w+$)|((\W+?)\d?(個人|特|強化)?$))/;
  lessonNameList = lessonData.map(function(e){
    return e[2].replace(pattern,'$2');
  });
  
  lessonNameList=uniqueArray(lessonNameList);
  
  Logger.log(lessonNameList);
}
  

function hashtest(){
  var tutors = getAddressData();
  //Logger.log(tutors);
  var tutorHash = {};
  for (var i=0; i<tutors.length; i++){
    tutorHash[tutors[i][0]] = tutors[i][2];
  }
  Logger.log(tutorHash['大川内豊']);
}

function extractFromTutorTest(){
  var result = extractFromTutor('高橋');
  Logger.log(result);
}

function tutorExtractTest(){
  var result = reducedTutorExtract(['RD','RG'],'数学3');
  Logger.log(result);
}

function getAddressDataTest(){
  Logger.log(getAddressData());
}

function extractAddressTest(){
  var result = extractAddress('大川内豊');
  Logger.log(result);
}

function testCompareElem(){
  var array = [[1,'c'],[3,'b'],[2,'a']];
  var result = array.sort(compareElem(0));
  Logger.log(result);
}

function uniqueTest(){
  var array = [1,1,2,3,4,4,5];
  //Logger.log(array.unique());
}
