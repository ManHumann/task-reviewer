import React from 'react';

const RightSidebar = ({ selectedTask, aiAnalysis, aiLoading, onExecuteRecommendation, onMarkActive, onMarkOverride }) => {
  if (!selectedTask) {
    return (
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
        <div className="p-space-2xl bg-surface-container-lowest rounded shadow-sm flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline text-[42px] mb-space-xs">smart_toy</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">Select a task to see AI analysis</span>
        </div>
      </div>
    );
  }

  if (aiLoading) {
    return (
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
        <div className="p-space-md bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">AI Triage Terminal</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="font-label-code text-label-code bg-surface-container-highest px-space-xs py-0.5 rounded text-on-surface" id="ai-active-id">#{selectedTask.id}</span>
            <span className="font-badge-label text-badge-label bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded uppercase">CONFIDENCE 96%</span>
          </div>
        </div>
        <div className="p-space-lg flex flex-col gap-space-md relative">
          <div className="hidden absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-space-sm" id="ai-loader">
            <span className="material-symbols-outlined text-primary text-[36px] animate-spin">smart_toy</span>
            <span className="font-body-sm text-body-sm font-medium text-on-surface">Synthesizing Task Vectors...</span>
            <span className="font-badge-label text-badge-label text-outline">EMBEDDING_SPACE: 1536-D</span>
          </div>
        </div>
      </div>
    );
  }

  if (!aiAnalysis) {
    return (
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
        <div className="p-space-2xl bg-surface-container-lowest rounded shadow-sm flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline text-[42px] mb-space-xs">auto_awesome</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">No AI analysis available</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Unable to generate analysis for this task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
      <div className="bg-surface-container-lowest rounded shadow-md overflow-hidden flex flex-col">
        <div className="p-space-md bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">AI Triage Terminal</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="font-label-code text-label-code bg-surface-container-highest px-space-xs py-0.5 rounded text-on-surface" id="ai-active-id">#{selectedTask.id}</span>
            <span className="font-badge-label text-badge-label bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded uppercase">CONFIDENCE {aiAnalysis.confidence}%</span>
          </div>
        </div>
        <div className="p-space-lg flex flex-col gap-space-md relative">
          <div className="p-space-md rounded bg-surface-container-low flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-medium">DETECTED INTENT</span>
              <span className="font-label-code text-label-code px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-bold" id="ai-meta-cat">{aiAnalysis.category}</span>
            </div>
            <div>
              <span className="font-caption text-caption text-outline">AI TRIAGE SUMMARY</span>
              <p className="font-body-sm text-body-sm text-on-surface mt-0.5 font-medium leading-snug" id="ai-meta-summary">{aiAnalysis.summary}</p>
            </div>
            <div className="mt-space-xs pt-space-xs bg-surface-container-lowest p-space-sm rounded">
              <div className="flex items-center gap-space-xs text-tertiary mb-1">
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                <span className="font-caption text-caption font-semibold">RECOMMENDED ACTION</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface font-semibold" id="ai-meta-action">{aiAnalysis.recommendedAction}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-caption text-caption text-outline uppercase font-semibold">Extracted Evidence Tokens</span>
              <span className="font-badge-label text-badge-label text-secondary">{aiAnalysis.tokens.length} MATCHES</span>
            </div>
            <div className="flex flex-wrap gap-1.5" id="ai-meta-tokens">
              {aiAnalysis.tokens.map((token, index) => (
                <span key={index} className="font-label-code text-label-code px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">{token}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-outline uppercase font-semibold">Inference Graph Payload</span>
              <button className="inline-flex items-center gap-1 font-badge-label text-badge-label text-primary hover:underline" id="btn-copy-json">
                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                <span className="">Copy JSON</span>
              </button>
            </div>
            <pre className="p-space-sm rounded bg-inverse-surface text-inverse-on-surface font-label-code text-label-code text-[11px] leading-relaxed overflow-x-auto select-all max-h-48 scrollbar-none" id="ai-meta-json">
              {JSON.stringify({
                category: aiAnalysis.category,
                priority: selectedTask.priority, // note: we use the task's priority, not the AI's? In the reference, they use the task's priority? Actually in the reference, the AI analysis includes a priority field. We'll use the AI's priority for the summary, but the task's priority is stored separately. We'll show the AI's priority in the analysis.
                summary: aiAnalysis.summary,
                recommendedAction: aiAnalysis.recommendedAction
              }, null, 2)}
            </pre>
          </div>
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <button
              className="w-full py-space-sm px-space-md rounded bg-primary text-on-primary font-headline-sm text-body-md flex items-center justify-center gap-space-xs shadow hover:bg-primary-container transition-all"
              id="btn-execute-recommendation"
              onClick={onExecuteRecommendation}
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span id="btn-recommendation-label">{`Execute: ${aiAnalysis.shortAction}`}</span>
            </button>
            <div className="grid grid-cols-2 gap-space-xs">
              <button
                className="py-space-xs px-space-sm rounded bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-1"
                id="btn-mark-active"
                onClick={onMarkActive}
              >
                <span className="material-symbols-outlined text-[16px]">pending_actions</span>
                <span className="">Mark Progress</span>
              </button>
              <button
                className="py-space-xs px-space-sm rounded bg-surface-container text-error font-body-sm text-body-sm hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center gap-1"
                id="btn-mark-override"
                onClick={onMarkOverride}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span className="">Override Model</span>
              </button>
            </div>
          </div>
        </div>
        <div className="px-space-md py-space-xs bg-surface-container-low flex items-center justify-between">
          <span className="font-badge-label text-badge-label text-outline">MODEL: LLAMA3-FINOPS-70B</span>
          <span className="font-badge-label text-badge-label text-on-surface-variant flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
            LATENCY: 142ms
          </span>
        </div>
      </div>
      <div className="p-space-md rounded bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">verified_user</span>
        <div className="flex flex-col gap-0.5">
          <span className="font-body-sm text-body-sm text-on-surface font-semibold">Deterministic Policy Engine</span>
          <p className="font-caption text-caption text-on-surface-variant">
            Actions performed through this console are signed cryptographically with operator Vance's telemetry token.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;