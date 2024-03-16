import { resolveView } from "../../resolve-view";
import { Checkbox, MongoCheckboxInterface } from "./Implementation";

export default {
  type: "Checkbox",
  implementation: Checkbox,
  views: {
    Controller: resolveView("dist/types/Checkbox/views/Controller"),
    Field: resolveView("dist/types/Checkbox/views/Field"),
    Filter: resolveView("dist/types/Checkbox/views/Filter"),
    Cell: resolveView("dist/types/Checkbox/views/Cell"),
  },
  adapters: {
    mongoose: MongoCheckboxInterface,
  },
};
