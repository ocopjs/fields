import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";

export class Checkbox extends Implementation {
  constructor() {
    super(...arguments);
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return false;
  }

  gqlOutputFields() {
    return [`${this.path}: Boolean`];
  }
  gqlOutputFieldResolvers() {
    return { [`${this.path}`]: (item) => item[this.path] };
  }

  gqlQueryInputFields() {
    return this.equalityInputFields("Boolean");
  }
  gqlUpdateInputFields() {
    return [`${this.path}: Boolean`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: Boolean`];
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "boolean | null" } };
  }
}

export class MongoCheckboxInterface extends MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({ type: Boolean }, this.config),
    });
  }
  getQueryConditions(dbPath) {
    return this.equalityConditions(dbPath);
  }
}
