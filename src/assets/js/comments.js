import commentStyles from '../css/comments.css'
const moment = require('moment');
const script = document.currentScript;

let issueNumber  = script.getAttribute('issue');


document.getElementById('login').onclick = function() {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=fe4931bc81e99ec2522f&redirect_uri=${window.location.href}&scope=public_repo`
}

const urlParams = new URLSearchParams(window.location.search);
let github_code = urlParams.get('code');

if (github_code) {
  window.fetch("https://jazl-server.herokuapp.com/access_tokens/fetch", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: github_code })
  }).then(response => {
    return response.json();
  }).then(data => {
    localStorage.setItem('GH_ACCESS_TOKEN', data.access_token);

    // redirect to the original page without any parameters
    window.location.href =window.location.href.split('?')[0];
  });
}

if (localStorage.getItem('GH_ACCESS_TOKEN')) {
  document.getElementById('unlogged-in-message').style.display = 'none';
}

document.getElementById('comments__add-button').onclick = function() {
  let github_access_token = localStorage.getItem('GH_ACCESS_TOKEN');
  let comment_content     = document.getElementById('comments__editor').value;

  window.fetch(`https://jazl-server.herokuapp.com/issues/${issueNumber}/comments`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${github_access_token}`
    },
    body: JSON.stringify({ content: comment_content })
  }).then(res => {
    document.getElementById('comments__editor').value = '';
  });
}

window.fetch(`https://jazl-server.herokuapp.com/issues/${issueNumber}/comments`,
  { Accept: 'application/json' }).then((response) => {
    return response.json()
  }).then((json) => {
    let comments = json.repository.issue.comments.edges;
    comments.reverse().forEach((comment) => {
      let commentNode = comment.node;
      let body        = commentNode.body;
      let createdAt   = moment(commentNode.createdAt).fromNow();
      let author      = {
        username: commentNode.author.login,
        avatar:   commentNode.author.avatarUrl,
        url:      commentNode.author.url
      }

      let commentHTML = `
        <div class="comment">
          <div class="comment__header">
            <a href="">
              <img src="${author.avatar}" alt="" width="40" height="40">
            </a>

            <a href="${author.url}">${author.username}</a>
            commented ${createdAt}.
          </div>

          <div class="comment__body">
            <span>
              ${body}
            </span>
          </div>
        </div>
      `

      let tempDiv       = document.createElement("div")
      tempDiv.innerHTML = commentHTML
      document.getElementById('comments').appendChild(tempDiv);
    })
  })
