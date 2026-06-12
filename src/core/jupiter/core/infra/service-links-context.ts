import { createContext } from "react";

// URLs of other services that core components link to or connect to. Each
// service provides these from its own service properties.
export interface ServiceLinks {
  webApiProgressReporterUrl: string;
  publishedUrl: string;
  docsUrl: string;
}

export const ServiceLinksContext = createContext<ServiceLinks>({
  webApiProgressReporterUrl: "FAKE-FAKE",
  publishedUrl: "FAKE-FAKE",
  docsUrl: "FAKE-FAKE",
});
