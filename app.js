"use strict";
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

const ws = new WebSocketServer({
    port:233,
})

ws.on('connection',function(conn){      //打开一个实例

   conn.on('message',function(str){     //接收客户端的消息
    
      var usermsg = JSON.parse(str);
      
      switch(usermsg.type) {
          case "setname" :
            var alluser = '{';
            conn.nickname = usermsg.msg;
            var i= -1;
            ws.clients.forEach(function(client,) {
                alluser += "\"username"+(++i)+"\":\"" + client.nickname + "\",";
            });
            alluser = alluser.substring(0,alluser.length-1);
            alluser += '}';
            alluser = JSON.parse(alluser);
            var json = {'msg':usermsg.msg,'username':alluser,'type':'name'};
          break;

          case "say" :
            var json = {'msg':usermsg.msg,'username':conn.nickname,'type':'say'};
          break;
      }

      ws.clients.forEach(function(client) {   //广播到每一个页面上
        client.send(JSON.stringify(json));
      }); 
   });


   
   conn.on('close',function(err){  //监听用户离开
        var alluser = '{';
        var i= -1;
        ws.clients.forEach(function(client,) {
            alluser += "\"username"+(++i)+"\":\"" + client.nickname + "\",";
        });
        alluser = alluser.substring(0,alluser.length-1);
        alluser += '}';
        if(alluser == '}') { 
            conn.close();
            return;
        }
        alluser = JSON.parse(alluser);
        var json = {'msg':conn.nickname,'username':alluser,'type':'leave'};
        ws.clients.forEach(function(client) {   //广播到每一个页面上
            client.send(JSON.stringify(json));
          });
    })
   
});


