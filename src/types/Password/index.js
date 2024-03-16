import { MongoPasswordInterface, Password } from "./Implementation";
import { resolveView } from "../../resolve-view";

export default {
  type: "Password",
  implementation: Password,
  views: {
    Controller: resolveView("dist/types/Password/views/Controller"),
    Field: resolveView("dist/types/Password/views/Field"),
    Filter: resolveView("dist/types/Password/views/Filter"),
    Cell: resolveView("dist/types/Password/views/Cell"),
  },
  adapters: {
    mongoose: MongoPasswordInterface,
  },
};
