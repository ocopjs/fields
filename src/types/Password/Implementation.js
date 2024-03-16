import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";
import dumbPasswords from "dumb-passwords";

const bcryptHashRegex = /^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/;

export class Password extends Implementation {
  constructor(
    path,
    { rejectCommon, minLength, workFactor, useCompiledBcrypt, bcrypt },
    { listKey },
  ) {
    super(...arguments);
    if (useCompiledBcrypt) {
      throw new Error(
        `The Password field at ${listKey}.${path} specifies the option "useCompiledBcrypt", this has been replaced with a "bcrypt" option which accepts a different implementation of bcrypt(such as the native npm package, "bcrypt")`,
      );
    }
    this.bcrypt = bcrypt || require("bcryptjs");

    // Sanitise field specific config
    this.rejectCommon = !!rejectCommon;
    this.minLength = Math.max(Number.parseInt(minLength) || 8, 1);
    // Min 4, max: 31, default: 10
    this.workFactor = Math.min(
      Math.max(Number.parseInt(workFactor) || 10, 4),
      31,
    );

    if (this.workFactor < 6) {
      console.warn(
        `The workFactor for ${this.listKey}.${this.path} is very low! ` +
          `This will cause weak hashes!`,
      );
    }
  }

  get _supportsUnique() {
    return false;
  }

  gqlOutputFields() {
    return [`${this.path}_is_set: Boolean`];
  }
  gqlOutputFieldResolvers() {
    return {
      [`${this.path}_is_set`]: (item) => {
        const val = item[this.path];
        return bcryptHashRegex.test(val);
      },
    };
  }

  gqlQueryInputFields() {
    return [`${this.path}_is_set: Boolean`];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }

  // Wrap bcrypt functionality
  // The compare() and compareSync() functions are constant-time
  // The compare() and generateHash() functions will return a Promise if no call back is provided
  compare(candidate, hash, callback) {
    return this.bcrypt.compare(candidate, hash, callback);
  }
  compareSync(candidate, hash) {
    return this.bcrypt.compareSync(candidate, hash);
  }
  generateHash(plaintext, callback) {
    this.validateNewPassword(plaintext);
    return this.bcrypt.hash(plaintext, this.workFactor, callback);
  }
  generateHashSync(plaintext) {
    this.validateNewPassword(plaintext);
    return this.bcrypt.hashSync(plaintext, this.workFactor);
  }

  extendAdminMeta(meta) {
    const { minLength } = this;
    return { ...meta, minLength };
  }

  // Force values to be hashed when set
  validateNewPassword(password) {
    if (this.rejectCommon && dumbPasswords.check(password)) {
      throw new Error(
        `[password:rejectCommon:${this.listKey}:${this.path}] Common and frequently-used passwords are not allowed.`,
      );
    }
    // TODO: checking string length is not simple; might need to revisit this (see https://mathiasbynens.be/notes/javascript-unicode)
    if (String(password).length < this.minLength) {
      throw new Error(
        `[password:minLength:${this.listKey}:${this.path}] Value must be at least ${this.minLength} characters long.`,
      );
    }
  }

  getBackingTypes() {
    return { [this.path]: { optional: true, type: "string | null" } };
  }
}

const CommonPasswordInterface = (superclass) =>
  class extends superclass {
    setupHooks({ addPreSaveHook }) {
      // Updates the relevant value in the item provided (by referrence)
      addPreSaveHook(async (item) => {
        const path = this.field.path;
        const plaintext = item[path];

        // Only run the hook if the item actually contains the field
        // NOTE: Can't use hasOwnProperty here, as the mongoose data object
        // returned isn't a POJO
        if (!(path in item)) {
          return item;
        }

        if (plaintext) {
          if (typeof plaintext === "string") {
            item[path] = await this.field.generateHash(plaintext);
          } else {
            // Should have been caught by the validator??
            throw `Invalid Password value given for '${path}'`;
          }
        } else {
          item[path] = null;
        }

        return item;
      });
    }
  };

export class MongoPasswordInterface extends CommonPasswordInterface(
  MongooseFieldAdapter,
) {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({ type: String }, this.config),
    });
  }

  getQueryConditions(dbPath) {
    return {
      [`${this.path}_is_set`]: (value) => ({
        [dbPath]: value
          ? { $regex: bcryptHashRegex }
          : { $not: bcryptHashRegex },
      }),
    };
  }
}
