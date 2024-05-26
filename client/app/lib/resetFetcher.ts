import { FetcherWithComponents } from "@remix-run/react";

export const resetFetcher = (fetcher: FetcherWithComponents<any>) => {
  fetcher.submit({}, { action: "/reset-fetcher", method: "post" });
};