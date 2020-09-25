import './index.css';

import HumanDate from './human-date';
import { GitHubCommentNode } from './types';
import GitHubLoginService from './github-login.service';
import CommentDataService from './comment-data.service';

import snarkdown from 'snarkdown';

export default class Jazl {
  ghLoginService: GitHubLoginService;
  commentDataService: CommentDataService;

  constructor(ghClientID: string, jazlServerURL: string, issueIDElementID: string) {
    let _issueIDElement: HTMLElement = document.getElementById(issueIDElementID) as HTMLElement;
    let issueID: string              = (<HTMLInputElement>_issueIDElement).value as string;

    this.ghLoginService     = new GitHubLoginService(ghClientID, jazlServerURL);
    this.commentDataService = new CommentDataService(jazlServerURL, this.ghLoginService.accessToken, issueID);
  }

  render() {
    this._renderEditor();
    this._loadButtonClickEvents();
    this._renderComments();
  }

  private _renderEditor() {
    let editorHTML: string = `
      <label id="jazl__editor-header" for="jazl__editor">
        ${this._getCurrentLogInButton()}
      </label>
      <textarea
                 id="jazl__editor"
                 name=""
                 placeholder="Join the Discussion..."
                 onfocus="this.placeholder = ''"
                 onblur="this.placeholder = 'Join the Discussion ...'"></textarea>

      <input type="button" id="jazl__comment-button" value="Submit">
    `;
    let container: HTMLElement = document.createElement("div");
    container.setAttribute('id', 'jazl__editor-container');
    container.innerHTML = editorHTML;

    (<HTMLElement>document.getElementById('comments')).appendChild(container);

    if (this.ghLoginService.isLoggedIn()) {
      (<HTMLInputElement>document.getElementById('jazl__editor')).disabled         = false;
      (<HTMLInputElement>document.getElementById('jazl__comment-button')).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById('jazl__editor')).disabled         = true;
      (<HTMLInputElement>document.getElementById('jazl__comment-button')).disabled = true;
    }
  }

  private _getCurrentLogInButton(): string {
    if (this.ghLoginService.isLoggedIn()) {
      return `<a href="javascript:void(0)" id="jazl__logout-button">Logout</a>`;
    } else {
      return `Login via <a href="javascript:void(0)" id="jazl__login-button">GitHub</a>`;
    }
  }

  private _loadButtonClickEvents() {
    (<HTMLElement>document.getElementById('jazl__comment-button')).onclick = () => {
      let content: string = (<HTMLInputElement>document.getElementById('jazl__editor')).value;
      this.commentDataService.create(content).then(() => {
        // clear the editor
        (<HTMLInputElement>document.getElementById('jazl__editor')).value = '';

        // reload comments after submitting a new comment
        this._renderComments();
      });
    }

    if (this.ghLoginService.isLoggedIn()) {
      (<HTMLElement>document.getElementById('jazl__logout-button')).onclick = () => {
        this.ghLoginService.logout();
      }
    } else {
      (<HTMLElement>document.getElementById('jazl__login-button')).onclick = () => {
        this.ghLoginService.login();
      }
    }
  }

  private _renderComments() {
    this.commentDataService.all().then((data) => {
      let comments: [] = data.repository.issue.comments.edges;

      // clear previous comments to prevent duplicate renders
      [...document.getElementsByClassName('jazl__comment')].forEach((element: Element) => {
        (<Element>element.parentElement).remove();
      });

      comments.forEach((comment: {node: GitHubCommentNode}) => {
        let commentNode: GitHubCommentNode = comment.node;
        let body: string = snarkdown(commentNode.body);
        let createdAt: string = new HumanDate(commentNode.createdAt).ago();
        let author = {
          username: commentNode.author.login,
          avatar:   commentNode.author.avatarUrl,
          url:      commentNode.author.url
        }

        let commentHTML: string = `
        <div class="jazl__comment">
          <div class="jazl__comment__header">
            <a href="${author.url}">
              <img src="${author.avatar}" alt="" width="40" height="40">
            </a>

            &nbsp;

            <a href="${author.url}"><b>${author.username}</b></a>&nbsp;
            commented ${createdAt}
          </div>

          <div class="jazl__comment__body">
            <span>
              ${body}
            </span>
          </div>
        </div>
      `;

        let container       = document.createElement("div");
        container.innerHTML = commentHTML;

        (<HTMLInputElement>document.getElementById('comments')).appendChild(container);
      });
    })
  }
}
