
function addDays (date, days = 1) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString()
}

function maxDate (dates) {
  const max = Math.max(...dates.map(d => new Date(d || 0)))
  return addDays(max, 3)
}

function schedule (task, week, team) {
  while ((team.load[week] || 0) >= team.rate) week = addDays(week, 7)
  task.start = week
  let effort = Math.pow(2, task.size)
  while (effort) {
    while ((team.load[week] || 0) >= team.rate) week = addDays(week, 7)
    effort--
    team.load[week] = (team.load[week] || 0) + 1
  }
  task.end = addDays(week, 4)
  return week
}
function round (v, p = 2) {
  // return v
  const m = Math.pow(10, p)
  return Math.round(v * m) / m
}

function prioritize (tasks, depth = 2) {
  for (const t of Object.values(tasks)) t.rank += (5 - t.size) / 5
  const list = Object.values(tasks).sort((a, b) => a.deps.length - b.deps.length || b.rank - a.rank)
  while (depth--) for (const t of list) for (const d of t.deps) if (tasks[d].rank < t.rank) tasks[d].rank = round(t.rank + 0.1)
  return list.sort((a, b) => b.rank - a.rank || a.index - b.index)
}

function roadmap (tasks, teams) {
  const list = prioritize(tasks)
  for (const t of list) {
    const team = teams[t.team]
    if (!t.deps.length) team.next = schedule(t, team.next, team)
    else schedule(t, maxDate(t.deps.map(d => tasks[d].end)), team)
  }
  return tasks
}

module.exports = { schedule, prioritize, roadmap }
