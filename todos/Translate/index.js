import { Relationship } from "../../";
import { resolveView } from "../../resolve-view";

export default {
  type: "Translate",
  isRelationship: true, // Used internally for this special case
  implementation: Relationship.implementation,
  views: {
    Controller: resolveView("types/Translate/views/Controller"),
    Field: resolveView("types/Translate/views/Field"),
    Filter: Relationship.views.Filter,
    Cell: resolveView("types/Translate/views/Cell"),
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
