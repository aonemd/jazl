jazl
---

GitHub issue based commenting system made simple

### Features

- Built on top of a modern stack: Webpack 4, TypeScript, and PostCSS
- Supports Markdown
- More secure as it leaves handling the secret key of GitHub oauth app to the server side
- Simple and small code base

### Installation

- Deploy [the server app](https://github.com/aonemd/jazl-server) on something like Heroku for example
- To install the package, run
```sh
$ yarn add jazl
```

- Initialize `Jazl` in your script

```javascript
import Jazl from 'jazl';

// import the style theme
import 'jazl/dist/jazl.css';

new Jazl(
  'github ouath app client id',
  'the url to the jazl server you deployed',
  'the id of a hidden tag that contains the issue id/number, e.g., issueId'
).render();
  ```
- Add a comments tag and issueId tag to your markup

```html
<input type="hidden" id="issueId" value="11">
<div id="comments"></div>
```
- That's it!

### Customization

#### Style

Customization of the style of each element is possible by overriding the CSS
rules of the element. The current available rules are as follows:

- `#jazl__editor-container`: the container of the comment editor
- `#jazl__editor-container #jazl__editor-header`: the header of the comment editor. It has a single rule:
  * `#jazl__editor-container #jazl__editor-header a`: the anchor in the header element
- `#jazl__editor-container #jazl__editor`: the main comment editor
- `#jazl__editor-container #jazl__comment-button`: the comment submit button
- `.jazl__comment`: the container of a single comment
- `.jazl__comment .jazl__comment-header`: the header of a comment. It contains:
  * `.jazl__comment .jazl__comment-header a`: the link of the username
  * `.jazl__comment .jazl__comment-header img`: the image of the user
- `.jazl__comment .jazl__comment-body`: the actual comment body. It contains one rule:
  * `.jazl__comment .jazl__comment-body img`: the element of the attached images

### License

See [LICENSE](https://github.com/aonemd/jazl/blob/master/LICENSE).
