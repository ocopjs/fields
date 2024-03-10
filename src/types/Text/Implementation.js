import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";

export class Text extends Implementation {
  constructor(path, { isMultiline }) {
    super(...arguments);
    this.isMultiline = isMultiline;
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }
  gqlOutputFieldResolvers() {
    return { [`${this.path}`]: (item) => item[this.path] };
  }
  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields("String"),
      ...this.stringInputFields("String"),
      ...this.equalityInputFieldsInsensitive("String"),
      ...this.stringInputFieldsInsensitive("String"),
      ...this.inInputFields("String"),
    ];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }
  extendAdminMeta(meta) {
    const { isMultiline } = this;
    return { isMultiline, ...meta };
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "string | null" } };
  }
}

const CommonTextInterface = (superclass) =>
  class extends superclass {
    getQueryConditions(dbPath) {
      return {
        ...this.equalityConditions(dbPath),
        ...this.stringConditions(dbPath),
        ...this.equalityConditionsInsensitive(dbPath),
        ...this.stringConditionsInsensitive(dbPath),
        // These have no case-insensitive counter parts
        ...this.inConditions(dbPath),
      };
    }
  };

export class MongoTextInterface extends CommonTextInterface(
  MongooseFieldAdapter,
) {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({ type: String }, this.config),
    });
  }
}
