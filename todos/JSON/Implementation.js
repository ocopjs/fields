import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";
import { Schema } from "mongoose";

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
    return [`${this.path}: JSON`];
  }
  gqlOutputFieldResolvers() {
    return { [`${this.path}`]: (item) => item[this.path] };
  }
  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields("JSON"),
      ...this.stringInputFields("JSON"),
      ...this.equalityInputFieldsInsensitive("JSON"),
      ...this.stringInputFieldsInsensitive("JSON"),
      ...this.inInputFields("JSON"),
    ];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: JSON`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: JSON`];
  }
  extendAdminMeta(meta) {
    const { isMultiline } = this;
    return { isMultiline, ...meta };
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "object | null" } };
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
      [this.path]: this.mergeSchemaOptions(
        { type: Schema.Types.Mixed },
        this.config,
      ),
    });
  }
}
