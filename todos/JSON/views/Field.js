/** @jsx jsx */

import { jsx } from "@emotion/core";

import {
  FieldContainer,
  FieldDescription,
  FieldInput,
  FieldLabel,
} from "@arch-ui/fields";
// import { Input } from "@arch-ui/input";
// import { useState } from "react";
// import { createEditor } from "slate";
// import { Editable, Slate, withReact } from "slate-react";

const TextField = ({
  onChange,
  autoFocus,
  field,
  errors,
  value = "",
  isDisabled,
}) => {
  // const [editor] = useState(() => withReact(createEditor()));
  // Render the Slate context.
  const handleChange = (event) => {
    try {
      const json = JSON.parse(event.target.value);
      onChange(json);
    } catch (error) {
      console.log("input valid json");
    }
  };

  const { isMultiline } = field.config;
  const htmlID = `ks-input-${field.path}`;
  const canRead = errors.every(
    (error) => !(error instanceof Error && error.name === "AccessDeniedError"),
  );
  const error = errors.find(
    (error) => error instanceof Error && error.name === "AccessDeniedError",
  );
  return (
    <FieldContainer>
      <FieldLabel htmlFor={htmlID} field={field} errors={errors} />
      <FieldDescription text={field.adminDoc} />
      <code>{JSON.stringify(value).slice(0, 100)}...</code>
    </FieldContainer>
  );
};

export default TextField;

// <Slate
//   editor={editor}
//   initialValue={[
//     {
//       type: "paragraph",
//       children: [{ text: "A line of text in a paragraph." }],
//     },
//   ]}
// >
//   <Editable style={{ width: "100%", height: "200px" }} />
// </Slate>

// <FieldInput>
//   <Input
//     autoComplete="off"
//     autoFocus={autoFocus}
//     required={field.isRequired}
//     type="text"
//     value={canRead ? JSON.stringify(value) : undefined}
//     placeholder={canRead ? undefined : error.message}
//     onChange={handleChange}
//     id={htmlID}
//     isMultiline={isMultiline}
//     disabled={isDisabled}
//   />
// </FieldInput>
