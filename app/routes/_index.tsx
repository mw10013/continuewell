import { redirect } from "@remix-run/node";
import { scenarios } from "./scenarios.$scenario";

export function loader() {
  return redirect(`/scenarios/${scenarios[0].dynamicSegment}`);
}
