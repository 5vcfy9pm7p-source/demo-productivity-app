import { FormEvent, useEffect, useMemo, useState } from 'react';

type Task = {
  id: number;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  createdAt: string;
};

const initialTasks: Task[] = [
  { id: 1, title: 'Review project brief', priority: 'High', completed: false, createdAt: '2026-10-14T08:30:00.000Z' },
  { id: 2, title: 'Update onboarding flow', priority: 'Medium', completed: true, createdAt: '2026-10-13T09:10:00.000Z' },
  { id: 3, title: 'Prepare client status report', priority: 'Low', completed: false, createdAt: '2026-10-14T10:45:00.000Z' }
];

const priorityStyles: Record<Task['priority'], string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  High: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('pulseboard-tasks');
    return stored ? JSON.parse(stored) : initialTasks;
  });
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('pulseboard-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' ? true : filter === 'active' ? !task.completed : task.completed;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const addTask = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: Date.now(),
      title: trimmed,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks((current) => [newTask, ...current]);
    setTitle('');
    setPriority('Medium');
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-500">PulseBoard</p>
              <h1 className="mt-2 text-3xl font-bold">Productivity dashboard</h1>
            </div>

            <button
              onClick={() => setDarkMode((value) => !value)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {darkMode ? 'Light mode' : 'Dark mode'}
            </button>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total tasks</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-bold">{tasks.length}</span>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">Live</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-bold">{activeCount}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">On track</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Progress</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-bold">{progress}%</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">{completedCount} done</span>
              </div>
            </div>
          </section>

          <main className="mt-8 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Add a task</h2>

              <form onSubmit={addTask} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Task name</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Example: Finish dashboard polish"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Task['priority'])}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Add task
                </button>
              </form>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-semibold">Today's tasks</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Keep momentum going</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value as 'all' | 'active' | 'done')}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    No tasks match your current view.
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700 dark:hover:bg-slate-800/90"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                            task.completed
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 bg-transparent text-transparent dark:border-slate-500'
                          }`}
                          aria-label={`Toggle ${task.title}`}
                        >
                          ✓
                        </button>

                        <div>
                          <p className={`font-medium ${task.completed ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                            {task.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(task.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
