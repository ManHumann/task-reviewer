import React from 'react';

const TopNavigationBar = ({ onShowAddTaskModal }) => {
  return (
    <header className="w-full bg-surface-container-lowest border-b border-surface-container px-margin-page py-space-sm flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs">
          <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[20px]">splitscreen</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">TaskOps AI</span>
              <span className="font-badge-label text-badge-label px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-semibold">v2.4</span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant">AI-Assisted Task Review</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-space-sm">
        <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container text-on-surface font-badge-label text-badge-label">
          <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
          <span className="">GATEWAY ONLINE</span>
        </div>
        <button onClick={onShowAddTaskModal} className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="">New Task</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavigationBar;