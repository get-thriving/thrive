import "luxon";

declare module "luxon" {
  interface TSSettings {
    throwOnInvalid: true;
  }
}
