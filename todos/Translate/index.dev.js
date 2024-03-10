const { Relationship } = require("@ocopjs/fields");

module.exports = {
  type: "Translate",
  isRelationship: true,
  implementation: Relationship.implementation,
  views: {
    Controller: require.resolve("./views/Controller"),
    Field: require.resolve("./views/Field"),
    Filter: Relationship.views.Filter,
    Cell: require.resolve("./views/Cell"),
  },
  adapters: Relationship.adapters,
  _options: [
    { flag: "🇻🇳", label: "Tiếng Việt", value: "vi" },
    { flag: "🇬🇧", label: "English", value: "en" },
    { flag: "🇨🇳", label: "中文 (Zhōngwén), 汉语, 漢語", value: "zh" },
    { flag: "🇯🇵", label: "日本語 (にほんご)", value: "ja" },
    { flag: "🇰🇷", label: "한국어", value: "ko" },
    { flag: "🇫🇷", label: "français, langue française", value: "fr" },
    { flag: "🇷🇺", label: "русский", value: "ru" },
  ],
};
