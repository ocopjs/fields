import { Integer, MongoIntegerInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Integer",
  implementation: Integer,
  views: {
    Controller: resolveView("dist/types/Integer/views/Controller"),
    Field: resolveView("dist/types/Integer/views/Field"),
    Filter: resolveView("dist/types/Integer/views/Filter"),
  },
  adapters: {
    mongoose: MongoIntegerInterface,
  },
};
