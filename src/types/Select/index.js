import { MongoSelectInterface, Select } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Select",
  implementation: Select,
  views: {
    Controller: resolveView("dist/types/Select/views/Controller"),
    Field: resolveView("dist/types/Select/views/Field"),
    Filter: resolveView("dist/types/Select/views/Filter"),
    Cell: resolveView("dist/types/Select/views/Cell"),
  },
  adapters: {
    mongoose: MongoSelectInterface,
  },
};
