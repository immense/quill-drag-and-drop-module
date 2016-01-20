export function convertDraggable(draggable) {
  if (draggable.content_type_pattern && draggable.tag && draggable.attr) {
    const ret = Object.assign({}, draggable);
    ret.content_type_regex = new RegExp(draggable.content_type_pattern);
    delete ret.content_type_pattern;
    return ret;
  } else {
    const e = new Error("draggables should have content_type_pattern, tag and attr keys");
    e.invalid_draggable = draggable;
    throw e;
  }
};

export function filesMatching(file_list, draggables) {
  const ret = [];
  for (let i = 0; i < file_list.length; i++) {
    const file = file_list.item(i);
    const draggable = draggables.find(d => d.content_type_regex.test(file.type));
    draggable && ret.push({file, tag: draggable.tag, attr: draggable.attr});
  }
  return ret;
};

export function getFileDataUrl(file) {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);
    reader.readAsDataURL(file);
  });
};

export function nullReturner() {
  return null;
};
