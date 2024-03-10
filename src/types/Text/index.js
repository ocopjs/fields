import { MongoTextInterface, Text } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Text",
  implementation: Text,
  views: {
    Controller: resolveView("dist/types/Text/views/Controller"),
    Field: resolveView("dist/types/Text/views/Field"),
    Filter: resolveView("dist/types/Text/views/Filter"),
  },
  adapters: {
    mongoose: MongoTextInterface,
  },
};
