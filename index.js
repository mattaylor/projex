
const plan = require('./plan')
const clup = require('./clup')

async function main () {
  
  const tasks = await clup.getTasks()
  const teams = await clup.getTeams()
  plan.roadmap(tasks, teams)
  // console.log('TEAMS:', teams)
  console.log('TASKS:', tasks)
  await clup.setTasks(tasks)
}

main()
