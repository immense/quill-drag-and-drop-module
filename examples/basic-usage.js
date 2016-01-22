const Quill = require('quill');
const DragAndDropModule = require('quill-drag-and-drop-module');

const image_content_type_pattern = DragAndDropModule.image_content_type_pattern;
const getFileDataUrl = DragAndDropModule.utils.getFileDataUrl;

function doSomethingWithBase64Image(base64_content) {

  // we'll just return an href as an example
  return "http://quilljs.com/images/quill-photo.jpg";
}

const basic_editor = new Quill('#basic-editor', {
  modules: {
    toolbar: {
      container: '#basic-toolbar'
    },
    dragAndDrop: {

      // draggables is an array containing the types of files that are allowed
      // to be dragged onto the editor, and the type of html element & name of
      // html attribute that will be added to the editor from this file
      draggables: [
        {

          // string regex pattern used to match a dropped file's `type`
          content_type_pattern: image_content_type_pattern,

          // the type of html element that will be added when a file matching
          // this draggable is dropped on the editor
          tag: 'img',

          // the attribute of the created html element that will be set based on
          // the file's data & result of onDrop (see below)
          attr: 'src'
        }
      ],

      // onDrop will be called any time a file with a type matching a
      // content_type_pattern defined in draggables is dropped on the editor
      // params:
      //    file - the File object that was dropped
      onDrop(file) {
        return getFileDataUrl(file).then(base64_content => {

          // do something with the base64 content
          // e.g. save file to server, resize image, add a watermark, etc.
          return doSomethingWithBase64Image(base64_content);
        })
        .then(response_from_do_something => {

          // whatever you return (or promise) from `onDrop` will be used as the
          // value of the `attr` attribute for the new html element,
          // with a couple of exceptions:
          //   returning `false` from `onDrop` =>
          //     this file will be ignored; no new element will be added to the
          //     editor
          //   returning `null` from `onDrop` =>
          //     the file's data url (i.e. base64 representation) will be used
          //     it's the same as if you'd done:
          //       `onDrop: DragAndDropModule.utils.getFileDataUrl`
          //     This is the default behavior (i.e., it's what will happen if
          //     you don't define `onDrop`)
          return response_from_do_something;
        })
        .catch(err => {

          // return false to tell Quill to ignore this dropped file
          return false;
        });
      }
    }
  }
});
