import { Decimal, MongoDecimalInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Decimal",
  implementation: Decimal,
  views: {
    Controller: resolveView("types/Decimal/views/Controller"),
    Field: resolveView("types/Decimal/views/Field"),
    Filter: resolveView("types/Decimal/views/Filter"),
  },
  adapters: {
    mongoose: MongoDecimalInterface,
  },
};
