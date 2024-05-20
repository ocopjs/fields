import { Float, MongoFloatInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Float",
  implementation: Float,
  views: {
    Controller: resolveView("dist/types/Float/views/Controller"),
    Field: resolveView("dist/types/Float/views/Field"),
    Filter: resolveView("dist/types/Float/views/Filter"),
  },
  adapters: {
    mongoose: MongoFloatInterface,
  },
};
