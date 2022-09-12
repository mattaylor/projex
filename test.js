const tasks = [
  { id: 0, name: 'task0', team: 'team1', size: 1, rank: 3, deps: [7] },
  { id: 1, name: 'task1', team: 'team1', size: 1, rank: 3, deps: [5] },
  { id: 2, name: 'task2', team: 'team1', size: 2, rank: 3, deps: [1] },
  { id: 3, name: 'task3', team: 'team1', size: 3, rank: 5, deps: [] },
  { id: 4, name: 'task4', team: 'team2', size: 4, rank: 2, deps: [3, 1] },
  { id: 5, name: 'task5', team: 'team2', size: 4, rank: 5, deps: [3] },
  { id: 6, name: 'task6', team: 'team2', size: 2, rank: 2, deps: [4] },
  { id: 7, name: 'task7', team: 'team3', size: 2, rank: 2, deps: [6] },
  { id: 8, name: 'task8', team: 'team3', size: 2, rank: 2, deps: [7] }
]

const teams = {
  team1: { rate: 4, load: {}, next: '9/5/2022' },
  team2: { rate: 2, load: {}, next: '9/5/2022' }
}

module.exports = { tasks, teams }
