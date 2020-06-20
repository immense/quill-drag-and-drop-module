function init() {
  window.DragAndDropModule = DragAndDropModule.default;
  document.removeEventListener('DOMContentLoaded', init);
  console.log('foo');
  initBasicDemo();
  initAdvancedDemo();
}
document.addEventListener('DOMContentLoaded', init);

function initBasicDemo() {
  var image_content_type_pattern = DragAndDropModule.image_content_type_pattern;
  var getFileDataUrl = DragAndDropModule.utils.getFileDataUrl;

  function doSomethingWithBase64Image(base64_content) {
    return "https://immense.net/wp-content/uploads/2016/11/340x156_Logo.png";
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

function initAdvancedDemo() {
  function doSomethingWithBase64Image(base64_content) {
    return "https://immense.net/wp-content/uploads/2016/11/340x156_Logo.png";
  }

  var basic_editor = new Quill('#basic-editor-2', {
    modules: {
      dragAndDrop: {
        draggables: [
          {
            content_type_pattern: '^image/',
            tag: 'img',
            attr: 'src'
          }
        ],
        onDrop: function(file) {
          return DragAndDropModule.utils.getFileDataUrl(file).then(function(base64_content) {
            return doSomethingWithBase64Image(base64_content);
          })
          .then(function(response_from_do_something) {
            return response_from_do_something;
          })
          .catch(function(err) {return false;});
        },
        container: document.getElementById('#drag-and-drop-container')
      }
    }
  });
}
