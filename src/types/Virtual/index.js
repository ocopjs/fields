import { Virtual, MongoVirtualInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Virtual",
  implementation: Virtual,
  views: {
    Controller: resolveView("dist/types/Virtual/views/Controller"),
    Cell: resolveView("dist/types/Virtual/views/Cell"),
    Field: resolveView("dist/types/Virtual/views/Field"),
    Filter: resolveView("dist/types/Virtual/views/Filter"),
  },
  adapters: {
    mongoose: MongoVirtualInterface,
  },
};
