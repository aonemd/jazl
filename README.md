jazl
---

GitHub Issue Based Commenting System made simple

### Features

- Built on top of a modern stack: Webpack 4, TypeScript, and PostCSS
- Simple and small code base
- More secure as it leaves handling the secret key of GitHub oauth app to the server side

### Installation

- Deploy [the server app](https://github.com/aonemd/jazl-server) on something like Heroku for example
- To install the package, run
```sh
  $ yarn add jazl
```

- Initialize `Jazl` in your script

```javascript
    import Jazl from 'jazl';

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

### License

See [LICENSE](https://github.com/aonemd/jazl/blob/master/LICENSE).
