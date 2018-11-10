import commentStyles from '../css/comments.css'

const moment = require('moment');

export class Jazl {
  constructor(githubClientId, issueIdTagId) {
    this.clientId = githubClientId;
    this.issueId  = document.getElementById(issueIdTagId).value;
    this.comments = {};

    this.renderDOM();
    this.loadComments();
    this.handleLoginRedirect();
  }

  get accessToken() {
    return localStorage.getItem('GH_ACCESS_TOKEN');
  }

  set accessToken(token) {
    localStorage.setItem('GH_ACCESS_TOKEN', token);
  }

  renderDOM() {
    this.renderEditor();

    if (this.isLoggedIn()) {
      document.getElementById('jazl__logout-button').onclick = () => {
        this.logout();
      }

      document.getElementById('jazl__editor').disabled         = false;
      document.getElementById('jazl__comment-button').disabled = false;
    } else {
      document.getElementById('jazl__login-button').onclick = () => {
        this.login();
      }

      document.getElementById('jazl__editor').disabled         = true;
      document.getElementById('jazl__comment-button').disabled = true;
    }
  }

  renderHeaderMessage() {
    if (this.isLoggedIn()) {
      return `<a href="javascript:void(0)" id="jazl__logout-button">Logout</a>`
    } else {
      return `Login via <a href="javascript:void(0)" id="jazl__login-button">GitHub</a>`
    }
  }

  renderEditor() {
    let editorHTML = `
      <label id="jazl__editor-header" class="text-right" for="jazl__editor">
        ${this.renderHeaderMessage()}
      </label>
      <textarea
                 id="jazl__editor"
                 name=""
                 placeholder="Join the Discussion ..."
                 onfocus="this.placeholder = ''"
                 onblur="this.placeholder = 'Join the Discussion ...'"></textarea>

      <input type="button" id="jazl__comment-button" value="Comment">
    `
    let container       = document.createElement("div");
    container.innerHTML = editorHTML;

    document.getElementById('comments').appendChild(container);

    document.getElementById('jazl__comment-button').onclick = () => {
      let content = document.getElementById('jazl__editor').value;
      this.createComment(content);
    }
  }

  login() {
    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${window.location.href}&scope=public_repo`;
  }

  handleLoginRedirect() {
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
  }

  logout() {
    localStorage.removeItem('GH_ACCESS_TOKEN');

    document.location.reload();
  }

  isLoggedIn() {
    return !!this.accessToken;
  }

  createComment(content) {
    window.fetch(`https://jazl-server.herokuapp.com/issues/${this.issueId}/comments`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ content: content })
    }).then(res => {
      // clear the editor
      document.getElementById('jazl__editor').value = '';

      // reload comments after submitting a new comment
      this.loadComments();
    });
  }

  loadComments() {
    window.fetch(`https://jazl-server.herokuapp.com/issues/${this.issueId}/comments`,
      { Accept: 'application/json' }
    ).then(response => {
      return response.json()
    }).then(data => {
      this.comments = data.repository.issue.comments.edges.reverse();
      this.renderComments();
    });
  }

  renderComments(commentsTagId = 'comments') {
    // clear comments to prevent duplicate renders
    this._clearComments();

    this.comments.forEach(comment => {
      let commentNode = comment.node;
      let body        = commentNode.body;
      let createdAt   = moment(commentNode.createdAt).fromNow();
      let author      = {
        username: commentNode.author.login,
        avatar:   commentNode.author.avatarUrl,
        url:      commentNode.author.url
      }

      let commentHTML = `
        <div class="jazl__comment">
          <div class="jazl__comment__header">
            <a href="">
              <img src="${author.avatar}" alt="" width="40" height="40">
            </a>

            <a href="${author.url}"><b>${author.username}</b></a>
            commented ${createdAt}
          </div>

          <div class="jazl__comment__body">
            <span>
              ${body}
            </span>
          </div>
        </div>
      `

      let container       = document.createElement("div")
      container.innerHTML = commentHTML
      document.getElementById(commentsTagId).appendChild(container);
    });
  }

  _clearComments() {
    [...document.getElementsByClassName('jazl__comment')].forEach(element => {
      element.parentElement.remove();
    });
  }
}

const jazl = new Jazl('fe4931bc81e99ec2522f', 'issueId');
