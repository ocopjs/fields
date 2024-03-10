import { DateTime } from "luxon";
import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";

export class DateTimeUtcImplementation extends Implementation {
  constructor(path, { format = "yyyy-MM-dd[T]HH:mm:ss.SSSxx" }) {
    super(...arguments);
    this.isOrderable = true;
    this.format = format;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }
  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: (item) =>
        item[this.path] && item[this.path].toISOString(),
    };
  }
  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields("String"),
      ...this.orderingInputFields("String"),
      ...this.inInputFields("String"),
    ];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }
  getGqlAuxTypes() {
    return [`scalar String`];
  }

  extendAdminMeta(meta) {
    return { ...meta, format: this.format };
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "Date | null" } };
  }
}

// All values must have an offset
const toDate = (str) => {
  if (str === null) {
    return null;
  }
  if (!str.match(/([zZ]|[\+\-][0-9]+(\:[0-9]+)?)$/)) {
    throw `Value supplied (${str}) is not a valid date time with offset.`;
  }
  return DateTime.fromISO(str).toJSDate();
};

export class MongoDateTimeUtcInterface extends MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({ type: Date }, this.config),
    });
  }
  getQueryConditions(dbPath) {
    return {
      ...this.equalityConditions(dbPath, toDate),
      ...this.orderingConditions(dbPath, toDate),
      ...this.inConditions(dbPath, toDate),
    };
  }
}
