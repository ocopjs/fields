import { File, MongoFileInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "File",
  implementation: File,
  views: {
    Controller: resolveView("dist/types/File/views/Controller"),
    Field: resolveView("dist/types/File/views/Field"),
    Cell: resolveView("dist/types/File/views/Cell"),
  },
  adapters: {
    mongoose: MongoFileInterface,
  },
};
