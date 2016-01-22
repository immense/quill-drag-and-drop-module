# Quill Drag-and-Drop Module

[Quill](http://quilljs.com/) module to add drag-and-drop support to the Quill container

## Installation

The quill drag-and-drop module is available as a [Bower](http://bower.io/) package and as an [npm](https://www.npmjs.com/) package.

To install with Bower:

`bower install quill-drag-and-drop-module`

Or, to install with npm:

`npm install --save quill-drag-and-drop-module`

## Usage

It is expected that either:
  * `Quill` is globally accessible, or
  * `"quill"` is requirable via [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) or [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)

Instantiate a new Quill like so:

```javascript
const Quill = require('quill');
const DragAndDropModule = require('quill-drag-and-drop-module');
...
const quill = new Quill('#basic-wrapper .editor-container', {
  modules: {
    toolbar: {
      container: '#basic-toolbar'
    },
    dragAndDrop: {
      draggables: [
        {
          content_type_pattern: DragAndDropModule.image_content_type_pattern,
          tag: 'img',
          attr: 'src'
        },
      ],
      onDrop(file) {
        return DragAndDropModule.utils.getFileDataUrl(file)
        .then(base64 => {...})
        .then(response_from_server => response_from_server.url_of_resource);
      }
    }
  }
});
```

See the [examples](examples) for more details.

## Building

To build quill-drag-and-drop-module from the ECMAScript2015 source, do the following in a Node.js enabled environment:

```
npm install
npm run compile
```

## License

The quill drag-and-drop module is released under the MIT License. Please see the LICENSE file for details.
