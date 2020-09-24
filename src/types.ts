export interface GitHubCommentNode {
  author: { login: string, avatarUrl: string, url: string };
  body: string;
  createdAt: string;
}
