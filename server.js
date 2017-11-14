
var http = require('http');
var path = require('path');
var URL = require('url');
var express = require('express');
var app = express();
app.use(express.static(__dirname));
var urls = [];
var queryHistory = [];


var port = process.env.PORT || 3000;
app.get('/imagesearch/*', function(req, res){
  var keyword = req.params[0];
  var offset = req.query.offset;
  
  queryHistory.push({'keyword' : keyword, 'time' : new Date()});
  
  var imageInfoJson = '';
  http.get('http://image.baidu.com/search/index?tn=resultjson&word=' + keyword + '&pn=' + offset +'&rn=10&ie=utf8', function (res) {
      //console.log("statusCode: ", res.statusCode);
      //console.log("headers: ", res.headers);
      
      res.on('data', function (d) {
          imageInfoJson += d;
      });
      res.on('end',function(){
          //获取到的数据
          imageInfoJson = JSON.parse(imageInfoJson);
          returnResult();
      });
  }).on('error', function (e) {
      console.error(e);
  });
    
    function returnResult(){
      var arr = [];
      var data = imageInfoJson.data;
      for(var i = 0; i < data.length ;i++) {
        
        arr.push({
        'imageUrl': data[i].objURL,
        'pageUrl': data[i].fromURL,
        'content' : data[i].fromPageTitleEnc
      });
      }
      res.json(arr);
    }
   
}
);

app.get('/latest/imagesearch/', function(req, res){
  res.json(queryHistory);
});

app.get('/', function(req, res){
    var indexhttp = path.join(__dirname, 'index.html');
    res.send(indexhttp);
});
app.listen(port, function () {
  console.log('Node app listening on port ' + port + '!');
});