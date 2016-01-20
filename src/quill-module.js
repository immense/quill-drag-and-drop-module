import Quill from 'quill';
import {convertDraggable, filesMatching, getFileDataUrl, nullReturner} from './utils';

const image_content_type_pattern = '^image\/';
const DEFAULT_OPTIONS = {
  container: null,
  onDrop: null,
  draggable_content_type_patterns: [
    image_content_type_pattern
  ]
};

const private_data = new WeakMap();

export default class DragAndDropModule {

  constructor(quill, options) {
    const _private = new Map();

    private_data.set(this, _private);

    _private
      .set('quill', quill)
      .set('options', Object.assign({}, DEFAULT_OPTIONS, options))
      .set('container', options.container || quill.container.querySelector('.ql-editor'))
      .set('draggables', this.options.draggables.map(convertDraggable))
      .set('listeners', new Set());

    // Drop listener
    this.addListener(this.container, 'drop', event => {
      const onDrop = this.options.onDrop;
      const node = event.target['ql-data'] ? event.target : this.container;
      const files = event.dataTransfer.files;
      const file_infos = filesMatching(files, this.draggables);

      if (file_infos.length === 0) return;

      event.stopPropagation();
      event.preventDefault();

      // call onDrop for each dropped file
      Promise.all(file_infos.map(file_info => {
        return Promise
          .resolve((onDrop || nullReturner)(file_info.file, {tag: file_info.tag, attr: file_info.attr}))
          .then(ret => ({on_drop_ret_val: ret, file_info}));
      }))

      // map return vals of onDrop/nullReturner to file datas
      .then(datas => Promise.all(datas.map(({on_drop_ret_val, file_info}) => {
        if (on_drop_ret_val === false) {
          // if onDrop() returned false (or a false-bearing promise), it
          // means that we shouldn't do anything with this file
          return;
        }
        const {tag, attr} = file_info;
        // if ret is null, either onDrop() returned null (or a null-
        // bearing promise), or onDrop isn't defined, so just use the
        // file's base64 as the value for tag[draggable.attr]
        //
        // if ret is non-false and non-null, it means onDrop returned
        // something (or promised something) that isn't null or false.
        // Assume it's what we should use for tag[draggable.attr]
        let data;
        if (on_drop_ret_val === null)
          data = getFileDataUrl(file_info.file);
        else
          data = on_drop_ret_val;

        return Promise
          .resolve(data)
          .then(ret => ({data: ret, tag, attr}));
      })))
      .then(datas => datas.forEach(file_info => {
        // loop through each file_info and attach them to the editor

        // file_info is undefined if onDrop returned false
        if (file_info) {
          const {data, tag, attr} = file_info;
          // create an element from the given `tag` (e.g. 'img')
          const new_element = document.createElement(tag);

          // set `attr` to `data` (e.g. img.src = "data:image/png;base64..")
          new_element.setAttribute(attr, data);

          // attach the tag to the quill container
          // TODO: maybe a better way to determine *exactly* where to append
          // the node? Currently, we're guessing based on event.target, but
          // that only gets us the node itself, not the position within the
          // node (i.e., if the node is a text node, maybe it's possible to
          // split the text node on the point where the user to dropped)
          node.appendChild(new_element);
        }
      }));
    });
  }

  destroy() {
    // remove listeners
    const listeners = private_data.get(this).get('listeners');
    listeners.forEach(({node, event_name, listener}) => {
      node.removeEventListener(event_name, listener);
    });
  }

  addListener(node, event_name, listener_fn) {
    const listener = listener_fn.bind(this);
    node.addEventListener(event_name, listener, false);
    private_data.get(this).get('listeners').add({node, event_name, listener});
  }

  get quill() {
    return private_data.get(this).get('quill');
  }

  get draggables() {
    return private_data.get(this).get('draggables');
  }

  get container() {
    return private_data.get(this).get('container');
  }

  get options() {
    return private_data.get(this).get('options');
  }

  static get image_content_type_pattern() {
    return image_content_type_pattern;
  }

  static get utils() {
    return {
      getFileDataUrl
    };
  }
}

Quill.registerModule('dragAndDrop', DragAndDropModule);
