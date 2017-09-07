function progressForEng3(data) {
  if(data['subject'].match('英語3')){
    
    var PROGRESS_Eng3_SSID = '1FYldKbL49-KYepoGh81TXhM7ms-T4Q1RtS_As0CEr8Y';
    var PROGRESS_Eng3_SHEET_NAME = '本科前期文法進度表';
    var sessionNumList = ['第01週(4/15～4/21)','第02週(4/22～4/28)','第03週(4/29～5/5)','第04週(5/6～5/12)','第05週(5/13～5/19)','第06週(5/20～5/26)','第07週(5/27～6/2)'
                          ,'第08週(6/3～6/9)','第09週(6/10～6/16)','第10週(6/17～6/23)','第11週(6/24～6/30)','第12週(7/1～7/7)','第13週(7/8～7/14)'];
    var groupRowHash = {'RA': 7, 'RB': 8, 'RC': 9, 'RD': 10, 'RE': 11, 'RF': 12, 'RG': 13, 'RH': 14, 'RI': 15, 'RJ': 16, 'RK': 17, 'RL': 18, 'RM': 19, 'RN': 20, 'RO': 21,
                        'RP': 22, 'RQ': 23, 'Z0': 27, 'Z1': 28, 'Z3': 29, '3G': 38, 'ZZ':25};
    var sessionNumSubList = ['1コマ目','2コマ目'];
    var ss = SpreadsheetApp.openById(PROGRESS_Eng3_SSID);
    var sheet = ss.getSheetByName(PROGRESS_Eng3_SHEET_NAME);
    
    var sessionNumData = data['session'].split(' ');
    var col = sessionNumList.indexOf(sessionNumData[1]) * 2 + 6 + sessionNumSubList.indexOf(sessionNumData[2]);
    var row = groupRowHash[data['groupArray'][0]];
    sheet.getRange(row, col).setValue(data['progress']);
  }
}
