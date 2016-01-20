# Quill Drag-and-Drop Module

[Quill](http://quilljs.com/) module to add drag-and-drop support to the Quill container

## Demo

Check out the [demo](http://immense.js.org/quill-drag-and-drop) to get a quick idea of how it works and how to use it.

## Installation

The quill drag-and-drop module is available as a [Bower](http://bower.io/) package and as an [npm](https://www.npmjs.com/) package.

To install with Bower:

`bower install quill-drag-and-drop-module`

Or, to install with npm:

`npm install --save quill-drag-and-drop-module`

## Usage

It is expected that `Quill` is accessible globally on your page.

Include the `quill-module.js` JavaScript file then instantiate a new Quill like so:

```javascript
var quill = new Quill('.basic-wrapper .editor-container', {
  modules: {
    ...
    dragAndDrop: {

      // draggables: array containing the types of files that are allowed to be dragged onto the editor, and the type
      // of html element & name of html attribute that will be added to the editor from this file
      draggables: [
        {
          // content_type_pattern: string regex pattern used to match a dropped file's `type`
          content_type_pattern: DragAndDropModule.image_content_type_pattern,
          // tag: the type of html element that will be added when a file matching this draggable is dropped on the editor
          tag: 'img',
          // attr: the attribute of the created html element that will be set based on the file's data & result of onDrop (see below)
          attr: 'src'
        },
        ...
      ],

      // onDrop: will be called any time a file (with valid type) is dropped on the editor
      // params:
      //    file - the File object that was dropped
      //    opts: {tag, attr} - the attr and tag which were defined for this type of file (see above)
      onDrop(file, {tag, attr}) {

        // `DragAndDropModule.utils.getFileDataUrl(file)` is a helper utility
        // returns a Promise of the file's dataUrl (i.e. base64 representation)
        return DragAndDropModule.utils.getFileDataUrl(file)

        // e.g. save file to server, resize image, convert markdown to text, etc.
        .then(base64 => {...})

        // whatever you return (or promise) from onDrop will be used as the
        // value of the `attr` attribute for the new html element, with a couple of exceptions:
        // returning false from onDrop =>
        //    this file will be ignored; no new element will be added to the editor
        // returning null from onDrop =>
        //    the file's data url (i.e. base64 representation) will be used
        //    it's the same as if you'd done `onDrop: DragAndDropModule.utils.getFileDataUrl`
        //    This is the default behavior (i.e., it's what will happen if you don't define `onDrop`)
        .then(response_from_server => response_from_server.url_of_resource);
      }
    }
  }
});
```

Refer to the [demo](http://immense.js.org/quill-drag-and-drop) page for detailed usage instructions.

## Building

To build quill-drag-and-drop-module from the ECMAScript2015 source, do the following in a Node.js enabled environment:

```
npm install
npm run compile
```

## License

The quill drag-and-drop module is released under the MIT License. Please see the LICENSE file for details.
