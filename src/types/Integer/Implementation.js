import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";

export class Integer extends Implementation {
  constructor() {
    super(...arguments);
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: Int`];
  }
  gqlOutputFieldResolvers() {
    return { [`${this.path}`]: (item) => item[this.path] };
  }

  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields("Int"),
      ...this.orderingInputFields("Int"),
      ...this.inInputFields("Int"),
    ];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: Int`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: Int`];
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "number | null" } };
  }
}

const CommonIntegerInterface = (superclass) =>
  class extends superclass {
    getQueryConditions(dbPath) {
      return {
        ...this.equalityConditions(dbPath),
        ...this.orderingConditions(dbPath),
        ...this.inConditions(dbPath),
      };
    }
  };

export class MongoIntegerInterface extends CommonIntegerInterface(
  MongooseFieldAdapter,
) {
  addToMongooseSchema(schema) {
    const schemaOptions = {
      type: Number,
      validate: {
        validator: this.buildValidator(
          (a) => typeof a === "number" && Number.isInteger(a),
        ),
        message: "{VALUE} is not an integer value",
      },
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config),
    });
  }
}
