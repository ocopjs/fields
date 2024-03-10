<!--[meta]
section: api
subSection: field-types
title: JSON
[meta]-->

# JSON

A basic but versatile text field of arbitrary length.

## Usage

```js
const { JSON } = require("@ocopjs/fields");

buon.createList("Product", {
  fields: {
    description: { type: JSON },
  },
});
```

## Config

| Option        | Type      | Default | Description                                                     |
| ------------- | --------- | ------- | --------------------------------------------------------------- |
| `isRequired`  | `Boolean` | `false` | Does this field require a value?                                |
| `isUnique`    | `Boolean` | `false` | Adds a unique index that allows only unique values to be stored |
| `isMultiline` | `Boolean` | `false` | Makes the field render as a textarea                            |
