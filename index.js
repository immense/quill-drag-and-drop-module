function init() {
  window.DragAndDropModule = DragAndDropModule.default;
  document.removeEventListener('DOMContentLoaded', init);
  console.log('foo');
  initBasicDemo();
}
document.addEventListener('DOMContentLoaded', init);

function initBasicDemo() {
  var image_content_type_pattern = DragAndDropModule.image_content_type_pattern;
  var getFileDataUrl = DragAndDropModule.utils.getFileDataUrl;

  function doSomethingWithBase64Image(base64_content) {
    return "http://quilljs.com/images/quill-photo.jpg";
  }

  var basic_editor = new Quill('#basic-editor', {
    modules: {
      dragAndDrop: {
        draggables: [
          {
            content_type_pattern: image_content_type_pattern,
            tag: 'img',
            attr: 'src'
          }
        ],
        onDrop: function(file) {
          return getFileDataUrl(file).then(function(base64_content) {
            return doSomethingWithBase64Image(base64_content);
          })
          .then(function(response_from_do_something) {
            return response_from_do_something;
          })
          .catch(function(err) {return false;});
        }
      }
    }
  });
}
