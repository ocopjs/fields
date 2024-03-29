import React from "react";

import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  FieldInput,
} from "@arch-ui/fields";
import { Input } from "@arch-ui/input";

const CurrencyField = ({
  onChange,
  autoFocus,
  field,
  value,
  errors,
  isDisabled,
}) => {
  var nf = new Intl.NumberFormat();
  const handleChange = (event) => {
    const value = event.target.value;
    onChange(value.replace(/\D/g, "").replace(/,/g, ""));
  };

  const valueToString = (value) => {
    // Make the value a string to keep react happy.
    if (typeof value === "string") {
      return value ? nf.format(value) : "";
    } else if (typeof value === "number") {
      return value ? String(nf.format(value)) : "";
    } else {
      // If it is neither string nor number then it must be empty.
      return "";
    }
  };

  const htmlID = `ks-input-${field.path}`;

  return (
    <FieldContainer>
      <FieldLabel htmlFor={htmlID} field={field} errors={errors} />
      <FieldDescription text={field.adminDoc} />
      <FieldInput>
        <Input
          autoComplete="off"
          autoFocus={autoFocus}
          required={field.isRequired}
          type="text"
          value={valueToString(value)}
          onChange={handleChange}
          id={htmlID}
          disabled={isDisabled}
        />
      </FieldInput>
    </FieldContainer>
  );
};

export default CurrencyField;
