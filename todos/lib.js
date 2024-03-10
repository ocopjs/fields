const { Select, Translate, Editor } = require("@ocopjs/fields");
/** */
function editor(label) {
  return {
    type: Editor,
    label,
    adminConfig: {
      listKey: "UploadImage",
      fileField: "file",
      searchField: "alt",
    },
  };
}

const lang = {
  language: {
    type: Select,
    options: Translate._options,
    defaultValue: "vi",
    label: "Ngôn ngữ sử dụng",
    adminConfig: { className: "col-md-12 col-lg-6" },
  },
  translations: {
    type: Translate,
    many: true,
    label: "Các bản dịch",
    ref: "Translate",
    adminDoc: "Chọn một ngôn ngữ để dịch.",
    adminConfig: { className: "col-12", ref: "Translate", lang: "language" },
  },
};
module.exports = { editor, lang };
