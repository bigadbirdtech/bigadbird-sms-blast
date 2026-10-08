import { redirect } from "next/navigation";

// the old workspace-root links ("/<slug>") land on the launcher
export default function Slug() {
  redirect("/");
}
