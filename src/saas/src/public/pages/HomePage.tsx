import { useMeta } from "../hooks/useMeta";
import { DirectionA } from "../home/DirectionA";

export function HomePage() {
  useMeta({
    title: "UniCampus OS",
    description: "UniCampus OS is digital infrastructure for universities: mobile credentials, campus access, student services and institutional operations. Starting in Kenya.",
    path: "/",
  });
  return <DirectionA />;
}
