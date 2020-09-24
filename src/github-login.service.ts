export default class GitHubLoginService {
  ghClientID: string = '';
  serverURL: string = '';
  ghAccessTokenLocalStorageKey: string = 'GH_ACCESS_TOKEN';

  constructor(ghClientID: string, serverURL: string) {
    this.ghClientID                   = ghClientID;
    this.serverURL                    = serverURL;
    this.ghAccessTokenLocalStorageKey = this.ghAccessTokenLocalStorageKey

    this._handleLoginRedirect();
  }

  login() {
    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${this.ghClientID}&redirect_uri=${window.location.href}&scope=public_repo`;
  }

  logout() {
    localStorage.removeItem(this.ghAccessTokenLocalStorageKey);
    document.location.reload();
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  get accessToken(): string {
    return localStorage.getItem(this.ghAccessTokenLocalStorageKey) as string;
  }

  private _handleLoginRedirect() {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    let githubCode: string           = urlParams.get('code') as string;

    if (githubCode) {
      fetch(`${this.serverURL}/access_tokens/fetch`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: githubCode })
      }).then(response => {
        return response.json();
      }).then(data => {
        localStorage.setItem(this.ghAccessTokenLocalStorageKey, data.access_token);

        // redirect to the original page without any parameters
        window.location.href = window.location.href.split('?')[0];
      });
    }
  }
}
