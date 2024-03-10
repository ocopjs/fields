/** @jsx jsx */

import { jsx } from "@emotion/core";

export default ({ data }) => {
  if (!data) return null;

  return <code>{JSON.stringify(data?.value || "{}").slice(0, 80)}</code>;
};
