import { redirect, ShouldRevalidateFunction } from "react-router";

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export async function loader() {
  return redirect("/app");
}
