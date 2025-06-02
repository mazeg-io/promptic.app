import { Metadata } from "next";
import { FlowCanvas } from "@/components/flow/FlowCanvas";

export const metadata: Metadata = {
  title: "Flow Editor | Promptic",
  description: "Visual prompt flow editor with AI-powered enhancements",
};

export default function Home() {
  return (
    <div className="h-screen w-full">
      <FlowCanvas />
    </div>
  );
}
