
import React from "react";

export default function DemoSection() {
  return (
    <section className="w-full max-w-4xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">
        See Promptic in Action
      </h2>
      <div
        style={{
          position: "relative",
          paddingBottom: "64.63195691202873%",
          height: 0,
        }}
      >
        <iframe
          src="https://www.loom.com/embed/e3682fdf53424837a62c17dd08854b4c?sid=c36e521a-0b81-4b68-8913-0334d69dc68b"
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
      <div className="text-slate-600 dark:text-slate-400 text-base pt-10">
        Clean, intuitive, and powerful prompt management.
      </div>
    </section>
  );
}
