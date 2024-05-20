import { Text, MongoTextInterface } from "../Text/Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Url",
  implementation: Text,
  views: {
    Controller: resolveView("dist/types/Text/views/Controller"),
    Field: resolveView("dist/types/Url/views/Field"),
    Filter: resolveView("dist/types/Text/views/Filter"),
    Cell: resolveView("dist/types/Url/views/Cell"),
  },
  adapters: {
    mongoose: MongoTextInterface,
  },
};
