let button = document.getElementById('button');
var paragraph = document.getElementById('question');
let ansBox = document.getElementById('answer');
let correct = document.getElementById('correct');
let incorrect = document.getElementById('incorrect');
let hint = document.getElementById('hint');
let result = document.getElementById('result');
let form = document.querySelector('form');
function init(question){
  getCsvData('csv/morizumi.csv');
}
function* main(question) {
  let row;
  let a;
  let type;
  let choice;
  let loop;
  let format;
  let formatImg = ['jpg','png','jpeg','jfif'];
  let formatVideo = ['mp4','avi'];
  let correctNum = 0;
  for (let k = 0;k<question.length;k++){
    let ans = document.getElementsByClassName('answer');
    loop = ans.length;
    for (let i = 0;i<loop;i++){
      ans[0].remove();
    }
    row = question[k];
    paragraph.textContent = row[0];
    format = (row[1].split('.')[1]);
    while (hint.firstChild){
      hint.firstChild.remove();
    }
    if (formatImg.includes(format)){
      hint.insertAdjacentHTML('beforeend','<img id="img"class="hint"src="'+row[1]+'">');
    }else if(formatVideo.includes(format)){
      hint.insertAdjacentHTML('beforeend','<video id="video"class="hint"src="'+row[1]+'">');
    }
    type = row[2];
    a = row[4];
    switch(type){
      case 'text':
        ansBox.insertAdjacentHTML('beforeend', '<input type="text"id="answer"class="answer">');
        break;
      case 'checkbox':
        choice = row[5];
        for (var j = 0;j<choice.length;j++){
          ansBox.insertAdjacentHTML('beforeend',('<input type="checkbox"id="answer"name="empty"class="answer"value="'+choice[j]+'">'));
          ansBox.insertAdjacentHTML('beforeend','<label name="empty"class="answer"for="'+choice[j]+'">'+choice[j]+'</choice><br>');
        }
        break;
      case 'radio':
        choice = row[5];
        for (var j = 0;j<choice.length;j++){
          ansBox.insertAdjacentHTML('beforeend',('<input type="radio"id="answer"name="empty"class="answer"value="'+choice[j]+'">'));
          ansBox.insertAdjacentHTML('beforeend','<label name="empty"class="answer"for="'+choice[j]+'">'+choice[j]+'</choice><br>');
        }
        break;
    }
    yield;
    let data = new FormData(form);
    let dataList = [];
    for (const entry of data){
      dataList[dataList.length] = entry[entry.length-1];
    }
    if (type=='text') {
      dataList[0] = document.querySelector('.answer');
      dataList[0] = dataList[0].value;
    }
    if (dataList.length == a.length&&dataList.every(x => a.includes(x))) {
      correct.play();
      result.textContent='正解!'+row[3];
      correctNum++;
    } else {
      incorrect.play();
      result.textContent='不正解!'+row[3];
    }
  }
  result.textContent+='正解数は'+correctNum+'/'+question.length+'です';
}
function getCsvData(dataPath){
  var req = new XMLHttpRequest();
  req.open('get',dataPath,true);
  req.send(null);
  req.onload = function() {
    let dat = convertCSVtoArray(req.responseText);
    const iter = main(dat);
    iter.next();
    button.addEventListener('click',function(){
      iter.next();
      });
  };
}
function convertCSVtoArray(csv){
  var result = [];
  var tmp = csv.split('\n');
  var row;
  for (let i = 0; i < tmp.length; i++){
		if (tmp[i] != ""){
		  row = tmp[i].split(',');
			if (row.length>5){
        result[i] = row.slice(0,4);
  			result[i][4] = row.slice(4).filter(x => x[0] === '\\').map(x => x.slice(1));
  			if (result[i][2] === 'radio'){
  			  if (result[i][4].length>1){
  			    alert('radioタイプの問題が選択されていますが、答えが複数存在します。一つ目の答えを反映します');
  			  }
  			  result[i][4] = [result[i][4][0]];
  			}
        result[i][5] = row.slice(4).map(function(x) {
  			  if (x[0]=='\\'){
  			    return x.slice(1);
  			  } else {
  			    return x;
  			  }
  			});
			} else {
        result[i] = row.slice(0,4);
        result[i][4] = [row[4]];
      }
		}
	}
	return result;
}
