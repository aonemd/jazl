export default class CommentDataService {
  serverURL: string = '';
  accessToken: string = '';
  issueID: string = '';

  constructor(serverURL: string, accessToken: string, issueID: string) {
    this.serverURL   = serverURL;
    this.accessToken = accessToken;
    this.issueID     = issueID;
  }

  async all(): Promise<any> {
    let response = await fetch(`${this.serverURL}/issues/${this.issueID}/comments`, {
      headers: { Accept: 'application/json' }
    });

    return response.json();
  }

  async create(content: string): Promise<any> {
    return await fetch(`${this.serverURL}/issues/${this.issueID}/comments`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ content: content })
    });
  }
}
