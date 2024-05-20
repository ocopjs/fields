import { SlugImplementation, MongoSlugInterface } from "./Implementation";
import { resolveView } from "../../resolve-view";

const Slug = {
  type: "Slug",
  implementation: SlugImplementation,
  views: {
    Controller: resolveView("dist/types/Text/views/Controller"),
    Field: resolveView("dist/types/Text/views/Field"),
    Filter: resolveView("dist/types/Text/views/Filter"),
  },
  adapters: {
    mongoose: MongoSlugInterface,
  },
};

export default Slug;
