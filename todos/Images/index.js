import { Relationship } from "../../";
import { resolveView } from "../../resolve-view";

export default {
  type: "Images",
  isRelationship: true, // Used internally for this special case
  implementation: Relationship.implementation,
  views: {
    Controller: resolveView("types/Images/views/Controller"),
    Field: resolveView("types/Images/views/Field"),
    Filter: Relationship.views.Filter,
    Cell: resolveView("types/Images/views/Cell"),
  },
  adapters: Relationship.adapters,
};
