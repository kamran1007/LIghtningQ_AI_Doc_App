// global.d.ts

declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// global.d.ts
interface FormData {
  entries(): IterableIterator<[string, FormDataEntryValue]>;
}
