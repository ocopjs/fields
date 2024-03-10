import { MongoTextInterface, Text } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "JSON",
  implementation: Text,
  views: {
    Controller: resolveView("types/JSON/views/Controller"),
    Field: resolveView("types/JSON/views/Field"),
    Filter: resolveView("types/JSON/views/Filter"),
    Cell: resolveView("types/JSON/views/Cell"),
  },
  adapters: {
    mongoose: MongoTextInterface,
  },
};
