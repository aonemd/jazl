import commentStyles from '../css/comments.css'

const moment = require('moment');
const script = document.currentScript;

let issueNumber  = script.getAttribute('issue');

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
