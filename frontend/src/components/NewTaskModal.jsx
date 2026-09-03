import React from 'react';

const NewTaskModal = ({ taskForm, onTaskFormChange, onAddTask, onCancel, loading }) => {
  return (
    <div id="new-task-drawer" className="hidden p-space-md rounded bg-surface-container-lowest border border-surface-container-highest shadow-md transition-all flex flex-col gap-space-md">
      <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">add_task</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Add New Task</h2>
        </div>
        <button onClick={onCancel} className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onAddTask();
      }} className="flex flex-col gap-space-sm">
        <div className="flex flex-col gap-1">
          <label for="task-title-input" className="font-caption text-caption uppercase text-outline font-semibold">Task Title</label>
          <input
            id="task-title-input"
            type="text"
            placeholder="e.g. Identity document verification anomaly"
            value={taskForm.title}
            onChange={(e) => onTaskFormChange({ target: { name: 'title', value: e.target.value } })}
            required
            className="w-full px-space-sm py-1.5 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded border border-surface-container focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label for="task-desc-input" className="font-caption text-caption uppercase text-outline font-semibold">Description</label>
          <textarea
            id="task-desc-input"
            rows="3"
            placeholder="Detailed summary of the operational issue or validation discrepancy..."
            value={taskForm.description}
            onChange={(e) => onTaskFormChange({ target: { name: 'description', value: e.target.value } })}
            className="w-full px-space-sm py-1.5 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded border border-surface-container focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label for="task-priority-input" className="font-caption text-caption uppercase text-outline font-semibold">Priority</label>
            <div className="relative">
              <select
                id="task-priority-input"
                className="w-full appearance-none bg-surface-container-low pl-space-sm pr-8 py-1.5 rounded font-body-sm text-body-sm text-on-surface cursor-pointer border border-surface-container focus:outline-none focus:border-primary"
                value={taskForm.priority}
                onChange={(e) => onTaskFormChange({ target: { name: 'priority', value: e.target.value } })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-outline text-[18px]">expand_more</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-caption text-caption uppercase text-outline font-semibold">Initial Status</label>
            <input type="text" value="NEW" readOnly className="w-full px-space-sm py-1.5 bg-surface-container text-on-surface-variant font-label-code text-label-code rounded border border-surface-container cursor-not-allowed" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-space-xs pt-space-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-space-md py-1.5 rounded bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-space-md py-1.5 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-all disabled={loading}"
          >
            {loading ? 'Adding...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskModal;