import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";

export class Float extends Implementation {
  constructor() {
    super(...arguments);
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: Float`];
  }
  gqlOutputFieldResolvers() {
    return { [`${this.path}`]: (item) => item[this.path] };
  }

  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields("Float"),
      ...this.orderingInputFields("Float"),
      ...this.inInputFields("Float"),
    ];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: Float`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: Float`];
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "number | null" } };
  }
}

const CommonFloatInterface = (superclass) =>
  class extends superclass {
    getQueryConditions(dbPath) {
      return {
        ...this.equalityConditions(dbPath),
        ...this.orderingConditions(dbPath),
        ...this.inConditions(dbPath),
      };
    }
  };

export class MongoFloatInterface extends CommonFloatInterface(
  MongooseFieldAdapter,
) {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({ type: Number }, this.config),
    });
  }
}
