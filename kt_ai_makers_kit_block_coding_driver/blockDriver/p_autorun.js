var system = require('system');
var args = system.args;
const fs = require('fs')

var autorunPath;
if (args.length === 1) {
  console.log('자동 실행 시킬 xml 스크립트의 주소를 입력해 주세요.');
  phantom.exit();
} else {
  autorunPath = args[1];
  console.log(autorunPath);
  if(!fs.exists(autorunPath)){
    console.log('파일의 위치를 찾을 수 없습니다.');
    phantom.exit();
  }

}

var page = require('webpage').create();
//console.log('start Autorun');
page.viewportSize = { width: 1024, height: 768 };
var isPageLoaded = false;
function onLoad(status) {
    if ( status === "success" ) {
        console.log('pageLoad success');
        isPageLoaded = true;
    }
    else
    {
        console.log('pageLoad fail'+status);

    }
}

page.open("http://14.63.226.234/block", onLoad);
console.log("try open page!");
page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
  if(msg == "runCode Stop"){
    console.log("Autorun Code stop!!");
    phantom.exit();
  }
  if(msg == "ready aimk"){
    console.log("start autorun!!");
    WaitStartAutorun();
  }
};

page.onFilePicker = function(oldFile) {
  console.log("called onFilePicker");
  return autorunPath;
};

StartAutorun = function(){
  page.evaluate(function() {
    Killdos.preprocessAutorun();
  });
  page.uploadFile('input[id=CodeUpload]',autorunPath);
  page.render('screenshot.png');
}

WaitStartAutorun = function(){
  if(isPageLoaded){
    StartAutorun();
  }
  else{
    setTimeout(function(){
      console.log("waiteStartAutorun!");
      WaitStartAutorun();
    },1000);
  }
}
