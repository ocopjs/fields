import { DateTime, MongoDateTimeInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "DateTime",
  implementation: DateTime,
  views: {
    Controller: resolveView("dist/types/DateTime/views/Controller"),
    Field: resolveView("dist/types/DateTime/views/Field"),
    Filter: resolveView("dist/types/DateTime/views/Filter"),
    Cell: resolveView("dist/types/DateTime/views/Cell"),
  },
  adapters: {
    mongoose: MongoDateTimeInterface,
  },
};
