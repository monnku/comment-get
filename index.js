const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const fetch = require('node-fetch');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
let data = {};
app.get('/comment', (req, res) => {
  console.log('第四関門')
  res.send(data);
});
let url = 'https://api.scratch.mit.edu/users/uk-300/projects/926688945/comments?limit=40&offset=0';
let comments = [];
let users = [];
let func_res = 'next';
async function get_comments(){
  users = [];
  comments = [];
  console.log('第一関門')
  let ur = 0;
  while (func_res == 'next'){
    url = 'https://api.scratch.mit.edu/users/uk-300/projects/926688945/comments?limit=40&offset='+String(ur * 40);
    func_res = await get_once();
    ur ++;
    if (ur == 20){
      break;
    }
  }
  console.log(ur);
}
async function get_once(){
  try {
    const res = await fetch(url);
    const datas = await res.json();
    if (datas.response == 'Too many requests'){
      return 'stop';
    }
    if (datas.length === 0){
      return 'stop';
    }
    for (const data of datas){
      comments[comments.length] = data.content;
      let username = data.author.username;
      users[users.length] = username;
    }
    console.log('第二関門')
    data = {'result':'success', 'users':users, 'datas':comments};
    return 'next';
  } catch(error){
    console.error("Error fetching comments:", error);
    console.log('第三関門')
    data = {'result':'failed'};
    return 'next';
  }
}
get_comments();
setInterval(()=>{
  get_comments();
}, 3600000)
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
