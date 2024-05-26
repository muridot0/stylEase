import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import React from "react";

export type FetcherWithComponentsReset<T> = FetcherWithComponents<T> & {
  reset: () => void;
};

export function useFetcherWithReset<T>(): FetcherWithComponentsReset<T> {
  const fetcher = useFetcher<T>();
  const [data, setData] = React.useState(fetcher.data);
  React.useEffect(() => {
    if (fetcher.state === "idle") {
      setData(fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);
  return {
    ...fetcher,
    data: data as T,
    reset: () => setData(undefined),
  };
}