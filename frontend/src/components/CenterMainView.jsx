import React from 'react';

const CenterMainView = ({ selectedTask, onUpdateTaskStatus, onUpdateTaskPriority }) => {
  if (!selectedTask) {
    return (
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
        <div className="p-space-2xl bg-surface-container-lowest rounded shadow-sm flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline text-[42px] mb-space-xs">inbox</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">Select a task from the queue to view details</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-1">Click on any task in the left panel to see its full details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
      <div className="task-detail-card bg-surface-container-low rounded shadow-md p-space-lg">
        <div className="task-header flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Task ID: #{selectedTask.id}</h2>
          <div className="task-status">
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusClass(selectedTask.status)}`}>
              {selectedTask.status}
            </span>
          </div>
        </div>

        <div className="task-meta-grid grid grid-cols-2 gap-4 mb-6">
          <div className="task-meta-item">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Priority</p>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getPriorityClass(selectedTask.priority)}`}>
              {selectedTask.priority}
            </span>
          </div>
          <div className="task-meta-item">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Created</p>
            <p className="text-base font-semibold text-on-surface">{new Date(selectedTask.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="task-description mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">Task Description</h3>
          <p className="text-body-sm text-body-sm text-on-surface-variant">{selectedTask.description}</p>
        </div>

        <div className="task-actions flex justify-end space-x-4">
          <button
            onClick={() => {
              onUpdateTaskStatus(selectedTask.id, 'COMPLETED');
            }}
            className="px-4 py-2 bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-all"
          >
            Complete Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for status and priority colors
function getStatusClass(status) {
  switch (status) {
    case 'NEW': return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case 'HIGH': return 'bg-red-100 text-red-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    case 'LOW': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default CenterMainView;