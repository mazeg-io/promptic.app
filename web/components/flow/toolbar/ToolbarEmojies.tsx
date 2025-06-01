import React, { useEffect, useRef } from "react";
import { db } from "@/instant";

// Emoji reactions configuration
const emojiReactions = [
  { emoji: "🔥", name: "fire" },
  { emoji: "👋", name: "wave" },
  { emoji: "🎉", name: "confetti" },
  { emoji: "❤️", name: "heart" },
];

const animateEmoji = (
  config: { emoji: string; directionAngle: number; rotationAngle: number },
  target: HTMLDivElement | null
) => {
  if (!target) return;

  const rootEl = document.createElement("div");
  const directionEl = document.createElement("div");
  const spinEl = document.createElement("div");

  spinEl.innerText = config.emoji;
  directionEl.appendChild(spinEl);
  rootEl.appendChild(directionEl);
  target.appendChild(rootEl);

  // Apply styles
  Object.assign(rootEl.style, {
    transform: `rotate(${config.directionAngle * 360}deg)`,
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
    zIndex: "9999",
    pointerEvents: "none",
  });

  Object.assign(spinEl.style, {
    transform: `rotateZ(${config.rotationAngle * 400}deg)`,
    fontSize: "40px",
  });

  setTimeout(() => {
    Object.assign(directionEl.style, {
      transform: "translateY(40vh) scale(2)",
      transition: "all 400ms",
      opacity: "0",
    });
  }, 20);

  setTimeout(() => rootEl.remove(), 800);
};

export const ToolbarEmojies = ({ room }: { room: any }) => {
  const emojiRefsRef = useRef<{
    [key: string]: React.RefObject<HTMLDivElement | null>;
  }>({});

  // Initialize refs for each emoji
  useEffect(() => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {};
    emojiReactions.forEach(({ name }) => {
      refs[name] = React.createRef<HTMLDivElement>();
    });
    emojiRefsRef.current = refs;
  }, []);

  // Reactions functionality
  const publishReaction = (db.rooms as any).usePublishTopic(room, "emoji");

  (db.rooms as any).useTopicEffect(
    room,
    "emoji",
    ({ name, directionAngle, rotationAngle }: any) => {
      const emojiConfig = emojiReactions.find((e) => e.name === name);
      if (!emojiConfig) return;
      console.log("name", name);
      animateEmoji(
        { emoji: emojiConfig.emoji, directionAngle, rotationAngle },
        emojiRefsRef.current[name]?.current || null
      );
    }
  );

  // Handle emoji click
  const handleEmojiClick = (emojiName: string, emoji: string) => {
    const params = {
      name: emojiName,
      rotationAngle: Math.random() * 360,
      directionAngle: Math.random() * 360,
    };

    // Animate locally
    animateEmoji(
      {
        emoji,
        rotationAngle: params.rotationAngle,
        directionAngle: params.directionAngle,
      },
      emojiRefsRef.current[emojiName]?.current || null
    );

    // Broadcast to other users
    if (publishReaction) {
      (publishReaction as any)(params);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {emojiReactions.map(({ emoji, name }) => (
        <div
          key={name}
          ref={emojiRefsRef.current[name]}
          className="relative cursor-pointer w-[40px] h-[40px] hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 transition-colors"
          title={`Send ${emoji} reaction`}
          onClick={() => handleEmojiClick(name, emoji)}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default ToolbarEmojies;
