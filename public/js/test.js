const myuser = document.getElementsByClassName('username')[0];
const html_result = document.getElementsByClassName('result')[0];
document.getElementById('get').addEventListener('click', get);
const copy_element = document.getElementById('copy');
copy_element.addEventListener('click', copy);
function copy(){
  navigator.clipboard.writeText(html_result.innerHTML).then(
  () => {
    copy_element.innerHTML = 'copied!';
    setTimeout(() => {
      copy_element.innerHTML = 'copy';
    }, 1500)
  },
  () => {
    alert('コピー失敗');
  });
}
let get_user = localStorage.getItem('username');
if (get_user !== null){
  myuser.value = get_user;
}
let times = 0;
async function get(){
  times = 0;
  const func = setInterval(() => {
    html_result.innerHTML = 'loading'+'.'.repeat(times);
    times ++
    if (times > 3){
      times = 0;
    }
  }, 30);
  localStorage.setItem('username', myuser.value);
  let result = myuser.value + '\n\n';
  const res = await fetch('/comment');
  const json = await res.json();
  if (!res.ok || json.result == 'failed'){
    html_result.innerHTML = '取得に失敗しました。'
  } else {
    let i = 0;
    for (i = 0; i < json.datas.length-1; i++) {
      result += json.users[i] + '\nリンクをコピー報告\n' + json.datas[i] + '\n返信\n\n';
    }
    result += json.users[i] + '\nリンクをコピー報告\n' + json.datas[i] + '\n返信\n';
    clearInterval(func);
    html_result.innerHTML = result;
  }
}
