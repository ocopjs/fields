import { MongoRelationshipInterface, Relationship } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Relationship",
  isRelationship: true, // Used internally for this special case
  implementation: Relationship,
  views: {
    Controller: resolveView("dist/types/Relationship/views/Controller"),
    Field: resolveView("dist/types/Relationship/views/Field"),
    Filter: resolveView("dist/types/Relationship/views/Filter"),
    Cell: resolveView("dist/types/Relationship/views/Cell"),
  },
  adapters: {
    mongoose: MongoRelationshipInterface,
  },
};
