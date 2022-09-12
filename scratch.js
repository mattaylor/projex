
function addDays (date, days = 1) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString()
}

function maxDate (dates) {
  const max = Math.max(...dates.map(d => new Date(d || 0)))
  return addDays(max, 3)
}

console.log('DAYS:', addDays('9/5/2022', 7))

function schedule (task, week, team) {
  while ((team.load[week] || 0) >= team.capacity) week = addDays(week, 7)
  task.start = week
  let effort = Math.pow(2, task.size)
  while (effort) {
    while ((team.load[week] || 0) >= team.capacity) week = addDays(week, 7)
    effort--
    team.load[week] = (team.load[week] || 0) + 1
  }
  task.end = addDays(week, 4)
  return week
}

function order (tasks) {
  for (const t of Object.values(tasks)) t.priority += (5 - t.size) / 5
  const list = Object.values(tasks).sort((a, b) => a.deps.length - b.deps.length || b.priority - a.priority)
  // for (const t of list) for (const d of t.deps) if (tasks[d].priority <= t.priority) tasks[d].priority = Math.round(100 * (t.priority + (tasks[d].priority / 5))) / 100
  // for (const t of list) for (const d of t.deps) if (tasks[d].priority <= t.priority) tasks[d].priority = Math.round(100 * (t.priority + (tasks[d].priority / 5))) / 100
  for (const t of list) for (const d of t.deps) if (tasks[d].priority <= t.priority) tasks[d].priority = Math.round(100 * (t.priority + 0.1)) / 100
  for (const t of list) for (const d of t.deps) if (tasks[d].priority <= t.priority) tasks[d].priority = Math.round(100 * (t.priority + 0.1)) / 100
  // return list.sort((a, b) => a._deps.length - b._deps.length || b.priority - a.priority)
  return list.sort((a, b) => b.priority - a.priority)
}

function _order (tasks) {
  for (const t of Object.values(tasks)) t.priority += (5 - t.size) / 5
  const list = Object.values(tasks).sort((a, b) => a._deps.length - b._deps.length || b.priority - a.priority)
  for (const t of list) for (const d of t._deps) if (t.priority <= tasks[d].priority) t.priority = Math.round(100 * (tasks[d].priority + (t.priority / 5))) / 100
  return list.sort((a, b) => a._deps.length - b._deps.length || b.priority - a.priority)
}

const start = '9/5/2022'

const teams = {
  team1: { capacity: 8, load: {}, start: start },
  team2: { capacity: 3, load: {}, start: start }
}

const tasks = {
  t1: { id: 't1', team: 'team1', size: 2, priority: 4, deps: ['t2'] },
  t2: { id: 't2', team: 'team1', size: 3, priority: 2, deps: ['t4', 't5', 't6'] },
  t3: { id: 't3', team: 'team2', size: 4, priority: 1, deps: ['t6', 't5'] },
  t4: { id: 't4', team: 'team2', size: 2, priority: 4, deps: ['t5'] },
  t5: { id: 't5', team: 'team1', size: 1, priority: 5, deps: ['t6'] },
  t6: { id: 't6', team: 'team2', size: 1, priority: 1, deps: [] }
}

const _tasks = {
  t1: { id: 't1', team: 'team1', size: 2, priority: 4, _deps: [] },
  t2: { id: 't2', team: 'team1', size: 3, priority: 2, _deps: ['t1', 't3'] },
  t3: { id: 't3', team: 'team2', size: 4, priority: 1, _deps: [] },
  t4: { id: 't4', team: 'team2', size: 2, priority: 2, _deps: ['t2', 't3'] },
  t5: { id: 't5', team: 'team1', size: 1, priority: 1, _deps: ['t2', 't4'] },
  t6: { id: 't6', team: 'team2', size: 1, priority: 1, _deps: [] }
}

const list = order(tasks)

for (const t of list) {
  const team = teams[t.team]
  if (!t.deps.length) team.start = schedule(t, team.start, team)
  else schedule(t, maxDate(t.deps.map(d => tasks[d].end)), team)
}
console.log('SCHEDULED:', list)

const _list = _order(_tasks)

for (const t of _list) {
  const team = teams[t.team]
  if (!t._deps.length) team.start = schedule(t, team.start, team)
  else schedule(t, maxDate(t._deps.map(d => tasks[d].end)), team)
}

// console.log('_SCHEDULED:', _list)

// console.log('TEAM:', teams)

// console.log('SCHEDULED:', list)
