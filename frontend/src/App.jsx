import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavigationBar from './components/TopNavigationBar';
import LeftSidebar from './components/LeftSidebar';
import CenterMainView from './components/CenterMainView';
import RightSidebar from './components/RightSidebar';
import NewTaskModal from './components/NewTaskModal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'HIGH', // default priority
    customerName: '',
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const taskData = {
        title: newTaskForm.title,
        description: newTaskForm.description,
        priority: newTaskForm.priority,
      };
      const response = await axios.post('http://localhost:8000/tasks', taskData);
      // Add the new task to the list
      setTasks(prev => [...prev, response.data]);
      // Reset the form and close modal
      setNewTaskForm({
        title: '',
        description: '',
        priority: 'HIGH',
        customerName: '',
      });
      setShowAddTaskModal(false);
    } catch (err) {
      setError('Failed to add task: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Select a task and trigger AI analysis
  const handleTaskSelect = async (taskId) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    setSelectedTask(task);
    setAiAnalysis(null);
    setAiLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/tasks/${taskId}/analyse`);
      setAiAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze task: ' + (err.response?.data?.detail || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/tasks/${taskId}/status`, { status: newStatus });
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError('Failed to update task status: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Update task priority
  const updateTaskPriority = async (taskId, newPriority) => {
    try {
      await axios.patch(`http://localhost:8000/tasks/${taskId}/priority`, {
        title: '', // dummy values required by TaskCreate model
        description: '',
        priority: newPriority
      });
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError('Failed to update task priority: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Load tasks on initial mount and auto-select first task
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
      setSelectedTask(tasks[0]);
      setAiLoading(true);
      axios.post(`http://localhost:8000/tasks/${tasks[0].id}/analyse`)
        .then(response => setAiAnalysis(response.data))
        .catch(err => setError('Failed to analyze task: ' + (err.response?.data?.detail || err.message)))
        .finally(() => setAiLoading(false));
    }
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavigationBar
        onShowAddTaskModal={() => setShowAddTaskModal(true)}
      />
      {showAddTaskModal && (
        <NewTaskModal
          taskForm={newTaskForm}
          onTaskFormChange={(e) => {
            const { name, value } = e.target;
            setNewTaskForm(prev => ({ ...prev, [name]: value }));
          }}
          onAddTask={addTask}
          onCancel={() => setShowAddTaskModal(false)}
          loading={loading}
        />
      )}
      <main className="w-full bg-background">
        <div className="flex flex-col w-full">
          <div className="flex-1 w-full min-w-0 flex flex-col lg:flex-row gap-space-lg items-start">
            {/* LEFT / MAIN: Stream Control & Task Matrix */}
            <div className="flex-1 w-full min-w-0 flex flex-col gap-space-md">
              <LeftSidebar
                tasks={tasks}
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedTaskId={selectedTaskId}
                onTaskSelect={handleTaskSelect}
                updateTaskStatus={updateTaskStatus}
                updateTaskPriority={updateTaskPriority}
                onAnalyseWithAI={handleTaskSelect}
              />
            </div>
            {/* CENTER: Task Detail */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
              <CenterMainView selectedTask={selectedTask} />
            </div>
            {/* RIGHT: AI Analysis & Detailed Inspector Terminal */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md sticky top-0">
              <RightSidebar
                selectedTask={selectedTask}
                aiAnalysis={aiAnalysis}
                aiLoading={aiLoading}
                onExecuteRecommendation={() => {
                  // In a real app, we would call an API to execute the recommendation
                  console.log('Executing recommendation');
                }}
                onMarkActive={() => {
                  // Mark task as in progress
                  if (selectedTask) {
                    updateTaskStatus(selectedTask.id, 'IN_PROGRESS');
                  }
                }}
                onMarkOverride={() => {
                  // Override model
                  console.log('Overriding model');
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;