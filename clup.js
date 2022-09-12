const axios = require('axios').default
const test = require('./test')
const conf = require('./.config.js')


function configure (opts) {
  Object.assign(conf, opts)
  axios.defaults.headers.common.Authorization = conf.authToken
  axios.defaults.baseURL = 'https://api.clickup.com/api/v2/' || conf.baseURL
  // console.log('CONFIG:', conf)
}

configure()

async function fetchList (listId = conf?.listId, states = ['backlog']) {
  const path = 'list/' + listId + '/task?subtasks=true'
  // for (const s of states) path += '&statuses[]=' + s
  return (await axios.get(path)).data.tasks
}

async function updateItem (taskId, body) {
  return (await axios.put('task/' + taskId, body)).data
}

async function updateField (taskId, fieldId, value) {
  fieldId = this.opts.fields[fieldId] || fieldId
  return (await axios.post('task/' + taskId + '/field/' + fieldId, { value: value })).data
}

async function getTeams (listId =  conf.teamList) {
  return test.teams
}

async function getTasks (listId = conf.taskList) {
  // return test.tasks
  const tasks = {}
  const items = await fetchList(listId)

  for (const t of items) {
    tasks[t.id] = {
      id: t.id,
      name: t.name,
      parent: t.parent,
      // status: t.status.status,
      team: (t.custom_fields.find(_ => _.name.toLowerCase() === 'team').value || [{}])[0].name,
      size: parseInt(t.custom_fields.find(_ => _.name.toLowerCase() === 'size')?.value) || 1,
      rank: parseInt(t.custom_fields.find(_ => _.name.toLowerCase() === 'rank')?.value) || 1,
      deps: t.dependencies.filter(_ => _.task_id === t.id)?.map(_ => _.depends_on),
      index: parseInt(t.orderindex)
    }
  }
  items.forEach(i => {
    let t = tasks[i.id]
    let p = tasks[t.parent]
    if (p) {
      t.deps.push(...p.deps)
      p.deps.push(t.id)
      if (p.team && !t.team) t.team = p.team
      if (p.rank > t.rank) t.rank = p.rank
      if (t.rank > p.rank) p.rank = t.rank
      while (!t.team && p.parent) {
        p = tasks[p.parent]
        t.team = p.team
      }
    }
  })
  return tasks
}

async function setTasks (tasks) {
  const taskIds = Object.keys(tasks)
  
  for (let t of taskIds) if (tasks[t].parent) {
    let p = tasks[t].parent
    if (new Date(tasks[t].end) > new Date(tasks[p].end)) tasks[p].end = tasks[t].end 
    if (new Date(tasks[t].start) < new Date(tasks[p].start)) tasks[p].start = tasks[t].start
  }
  
  for (let t of taskIds) await updateItem(t, { 
    start_date: new Date(tasks[t].start).getTime(),
    due_date: new Date(tasks[t].end).getTime() 
  })
}

module.exports = { getTasks, getTeams, setTasks, updateItem, updateField, fetchList, configure }
