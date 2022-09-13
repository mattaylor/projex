
const plan = require('./planner')
const clup = require('./clickUp')

async function main () {
  
  const tasks = await clup.getTasks()
  const teams = await clup.getTeams()
  //console.log('BEFORE:', tasks)
  plan.roadmap(tasks, teams, '10/19/2022')
  // console.log('TEAMS:', teams)
  console.log('AFTER :', tasks)
  await clup.setTasks(tasks)
}

main()
