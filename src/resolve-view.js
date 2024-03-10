import path from "path";
const pkgDir = path.dirname(require.resolve("@ocopjs/fields/package.json"));

export const resolveView = (pathname) => {
  return path.join(pkgDir, pathname);
};
