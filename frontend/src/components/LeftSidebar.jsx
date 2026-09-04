import React from 'react';

const LeftSidebar = ({ tasks, filter, setFilter, searchTerm, setSearchTerm, selectedTaskId, onTaskSelect, updateTaskStatus, updateTaskPriority, onAnalyseWithAI }) => {
  // Filter tasks based on filter and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' ||
                          (filter === 'NEW' && task.status === 'NEW') ||
                          (filter === 'IN_PROGRESS' && task.status === 'IN PROGRESS') ||
                          (filter === 'COMPLETED' && task.status === 'COMPLETED');
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort by priority (HIGH first) and then by date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Counts for the tabs
  const totalCount = tasks.length;
  const newCount = tasks.filter(t => t.status === 'NEW').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN PROGRESS').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <aside className="flex-1 w-full min-w-0 flex flex-col gap-space-md">
      {/* Filters, Status Tabs & Search Ribbon */}
      <div className="p-space-sm bg-surface-container-lowest rounded shadow-sm flex flex-wrap items-center justify-between gap-space-md">
        {/* Status Tab Buttons */}
        <div className="flex items-center gap-space-xxs bg-surface-container-low p-1 rounded">
          <button
            className={filter === 'All'
              ? "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface bg-primary text-on-primary"
              : "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant"
            }
            onClick={() => setFilter('All')}
          >
            ALL {totalCount}
          </button>
          <button
            className={filter === 'NEW'
              ? "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface bg-primary text-on-primary"
              : "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant"
            }
            onClick={() => setFilter('NEW')}
          >
            NEW {newCount}
          </button>
          <button
            className={filter === 'IN_PROGRESS'
              ? "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface bg-primary text-on-primary"
              : "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant"
            }
            onClick={() => setFilter('IN_PROGRESS')}
          >
            IN_PROGRESS {inProgressCount}
          </button>
          <button
            className={filter === 'COMPLETED'
              ? "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface bg-primary text-on-primary"
              : "px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant"
            }
            onClick={() => setFilter('COMPLETED')}
          >
            COMPLETED {completedCount}
          </button>
        </div>
        {/* Search Selector */}
        <div className="task-search relative w-full sm:w-64">
          <span className="material-symbols-outlined text-outline text-[16px]" aria-hidden="true">filter_list</span>
          <input
            className="w-full pr-2 py-1 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded focus:outline-none focus:bg-surface-container-lowest shadow-sm"
            id="table-search"
            placeholder="Filter current list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
          />
        </div>
      </div>
      {/* Main Operational Task Feed */}
      <div className="flex flex-col gap-space-md" id="task-feed">
        {sortedTasks.length === 0 ? (
          <p className="empty-state">No tasks found</p>
        ) :
          sortedTasks.map(task => (
            <div
              key={task.id}
              className={`border border-surface-container rounded-lg ${selectedTaskId === task.id ? 'border-primary' : 'border-surface-container'} bg-surface-container-lowest p-4`}
              onClick={() => onTaskSelect(task.id)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="task-badges flex items-center space-x-3">
                    <span className="task-id">#{task.id}</span>
                    <div className="task-select priority-select">
                        <select
                            value={task.priority}
                            onChange={(e) => {
                                e.stopPropagation();
                                updateTaskPriority(task.id, e.target.value);
                            }}
                            className="appearance-none bg-surface-container pl-1 pr-3 py-0.5 rounded font-body-sm text-body-sm text-on-surface cursor-pointer focus:outline-none focus:border-primary"
                        >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                        <span className="material-symbols-outlined text-outline text-[16px]" aria-hidden="true">expand_more</span>
                    </div>
                  </div>
                      <div className="task-select">
                    <select
                        value={task.status}
                        onChange={(e) => {
                            e.stopPropagation();
                            updateTaskStatus(task.id, e.target.value);
                        }}
                        className="appearance-none bg-surface-container pl-1 pr-3 py-0.5 rounded font-body-sm text-body-sm text-on-surface cursor-pointer focus:outline-none focus:border-primary"
                    >
                        <option value="NEW">NEW</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <span className="material-symbols-outlined text-outline text-[16px]" aria-hidden="true">expand_more</span>
                  </div>
                </div>
                <h3 className="task-title text-base font-semibold text-on-surface mb-2">{task.title}</h3>
                <p className="task-description text-sm text-on-surface-variant mb-4">{task.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* We don't have AI data in the list, so we show the priority as text for reference */}
                        <span className="text-xs font-medium text-on-surface">{task.priority}</span>
                    </div>
                    <div className="task-card-actions flex items-center space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTaskSelect(task.id);
                            }}
                            className="px-2 py-1 bg-surface-container text-on-surface font-body-sm text-body-sm rounded hover:bg-surface-container-high transition-colors"
                        >
                            View Details
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAnalyseWithAI(task.id);
                            }}
                            className="px-2 py-1 bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-all"
                        >
                            Analyse with AI
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Batch Action Floating Info Strip */}
      <div className="p-space-md rounded bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">verified</span>
          <span className="font-body-sm text-body-sm text-on-surface">Auto-triage runs confidence assessment on ingest. Human verification recommended for items flagged <span className="font-label-code text-label-code text-error font-semibold">HIGH</span>.</span>
        </div>
        <span className="font-badge-label text-badge-label text-outline uppercase tracking-wider">SYNC DELAY: 24ms</span>
      </div>
    </aside>
  );
};

export default LeftSidebar;