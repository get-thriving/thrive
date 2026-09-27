import { useLoaderData } from "react-router";
import { useEffect, useRef } from "react";

// React Router 7 keeps `SerializeFrom` internal, but it is exactly what
// `useLoaderData` returns, so name it through that.
export type LoaderDataOf<T> = ReturnType<typeof useLoaderData<T>>;

export function useLoaderDataSafeForAnimation<T>(): LoaderDataOf<T> {
  const lastData = useRef({});
  const data = useLoaderData<T>() || lastData.current;

  useEffect(() => {
    if (data) lastData.current = data;
  }, [data]);

  return data as LoaderDataOf<T>;
}
