import { UuidImplementation, MongoUuidInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

const Uuid = {
  type: "Uuid",
  implementation: UuidImplementation,
  views: {
    Controller: resolveView("types/Uuid/views/Controller"),
    Field: resolveView("types/Uuid/views/Field"),
    Filter: resolveView("types/Uuid/views/Filter"),
  },
  adapters: {
    mongoose: MongoUuidInterface,
  },

  primaryKeyDefaults: {
    mongoose: {
      getConfig: () => {
        throw (
          `The Uuid field type doesn't provide a default primary key field configuration for mongoose. ` +
          `You'll need to supply your own 'id' field for each list or use a different field type for your ` +
          `ids (eg '@ocop/fields-mongoid').`
        );
      },
    },
  },
};

export default Uuid;
