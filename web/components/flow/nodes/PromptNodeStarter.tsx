import { Button } from "@/components/ui/button";
import React, { useCallback } from "react";

const promptTemplates = {
  agent: `You are a helpful AI assistant. Your role is to {{role}}.

Follow these guidelines:
- Be clear and concise in your responses
- Ask clarifying questions when needed
- Provide step-by-step explanations when appropriate
- Consider the context: {{context}}

Task: {{task}}`,

  chainOfThought: `You are a General Agent operating within [PROJECT_NAME].
Your primary objective is to [MAIN OBJECTIVE].

Context & Domain
You operate in the domain of [DOMAIN/INDUSTRY]
You have access to the following knowledge/tools:
[TOOL_1], [TOOL_2], [KNOWLEDGE_BASES], [APIS]

Key Tasks
You may be asked to perform:
Task A: [TASK_DESCRIPTION]
Task B: [TASK_DESCRIPTION]
Task C: [TASK_DESCRIPTION]

Constraints & Guidelines
Respect the following constraints:
[CONSTRAINT_1]
[CONSTRAINT_2]
Always prioritize:
[PRIORITY_1]
[PRIORITY_2]

Reasoning Process
Use explicit chain-of-thought reasoning.
If uncertain, explain the uncertainty and suggest clarifying questions.

Response Format`,

  supervisor: `You are the Supervisor Agent for [PROJECT_NAME].
Your role is to oversee and guide the performance of other agents and processes.

Responsibilities
Monitor progress of agents in the system
Verify correctness and completeness of outputs
Detect potential errors, inconsistencies, or inefficiencies
Provide corrective feedback to agents
Manage workflow orchestration if applicable

Tools & Context
You have access to the following:
[LIST_OF_TOOLS]
[CONTEXT_DOCUMENTS]

Critical Goals
Ensure overall coherence of multi-step workflows
Enforce project-specific quality standards:
[PROJECT_QUALITY_CRITERIA_1]
[PROJECT_QUALITY_CRITERIA_2]
[PROJECT_QUALITY_CRITERIA_3]
Escalate or halt process if severe issues are detected

Reasoning Process
Apply chain-of-thought reasoning before each decision
Log reasoning steps explicitly:
  Reasoning Step 1: ...
  Reasoning Step 2: ...
  

Response Format
When providing supervision output, use this format:
`,
};

function PromptNodeStarter({
  handlePromptChange,
  textareaRef,
}: {
  handlePromptChange: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const handleTemplateSelect = useCallback(
    (template: string) => {
      const templateContent =
        promptTemplates[template as keyof typeof promptTemplates] || "";
      handlePromptChange(templateContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Position cursor at the end
          textareaRef.current.setSelectionRange(
            templateContent.length,
            templateContent.length
          );
        }
      }, 100);
    },
    [handlePromptChange]
  );

  const handleStartEmpty = useCallback(() => {
    handlePromptChange("");
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  }, [handlePromptChange]);

  return (
    <div className="min-h-[150px] flex flex-col items-center justify-center space-y-4 p-4">
      <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        Choose a prompt structure to get started
      </h4>

      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        <Button
          variant="outline"
          onClick={() => handleTemplateSelect("agent")}
          className="h-auto p-4 flex flex-col items-center text-center hover:bg-blue-50 dark:hover:bg-blue-950 border-2 hover:border-blue-300 transition-all duration-200"
        >
          <div className="text-sm font-semibold mb-1">🤖 Agent</div>
          <div className="text-xs text-gray-500">
            Role-based assistant prompt
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleTemplateSelect("chainOfThought")}
          className="h-auto p-4 flex flex-col items-center text-center hover:bg-green-50 dark:hover:bg-green-950 border-2 hover:border-green-300 transition-all duration-200"
        >
          <div className="text-sm font-semibold mb-1">🧠 Chain of Thought</div>
          <div className="text-xs text-gray-500">Step-by-step reasoning</div>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleTemplateSelect("supervisor")}
          className="h-auto p-4 flex flex-col items-center text-center hover:bg-orange-50 dark:hover:bg-orange-950 border-2 hover:border-orange-300 transition-all duration-200"
        >
          <div className="text-sm font-semibold mb-1">👥 Orchestrator</div>
          <div className="text-xs text-gray-500">Multi-agent orchestrator</div>
        </Button>
        <Button
          variant="ghost"
          onClick={handleStartEmpty}
          className="h-auto p-4 flex flex-col items-center text-center hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200"
        >
          <div className="text-sm font-semibold mb-1">✏️ Start Empty</div>
          <div className="text-xs text-gray-500">Begin with blank prompt</div>
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Templates include placeholder variables like {`{{variable}}`} that you
        can customize
      </p>
    </div>
  );
}

export default PromptNodeStarter;
