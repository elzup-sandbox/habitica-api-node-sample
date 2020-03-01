'use strict'
const axios = require('axios').default
const { format } = require('fecha')
const { HABITICA_USER_ID, HABITICA_TOKEN } = process.env

const client = axios.create({
  baseURL: 'https://habitica.com',
  headers: {
    Accept: 'application/json',
    'x-api-user': HABITICA_USER_ID,
    'x-api-key': HABITICA_TOKEN,
    'x-client': HABITICA_USER_ID + '-node',
  },
})

const main = async () => {
  const res = await client.get('/api/v3/tasks/user')

  // all data
  // console.log(JSON.stringify(res.data.data))

  const tasks = res.data.data
  const workout = tasks.find(v => /筋トレ/.exec(v.text))

  // const times = workout.history.map(commit => format(commit.date, 'YYYY-MM-DD'))
  // 後日 commit のタイムスタンプ
  // console.log(times.join('\n'))

  const times = workout.history.map(commit => [
    format(commit.date, 'YYYY-MM-DD'),
    commit.date,
  ])
  times.reverse()

  let prev = ''
  const strs = times.map(([s, t], i) => {
    // 一致する場合は前日に
    const ts = s === prev ? format(t - 24 * 60 * 60 * 1000, 'YYYY-MM-DD') : s
    return (prev = ts)
  })

  strs.reverse()
  console.log(strs.join('\n'))
}

main()
