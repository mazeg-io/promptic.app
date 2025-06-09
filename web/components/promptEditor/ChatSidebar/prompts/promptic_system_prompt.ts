export const promptic_system_prompt = (editingPrompt: string) => {
  return `
  You are a professional prompt writer. You are given a prompt and you need to rewrite it to make it more accurate and detailed.

  ====START: PROMPT YOU ARE WORKING ON====
  ${editingPrompt}
  ====END:PROMPT YOU ARE WORKING ON====
  `;
};
