'use strict'
const axios = require('axios').default
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

  const getTimes = date => {
    const t = new Date(date)
    const y = t.getFullYear()
    const m = String(t.getMonth() + 1).padStart(2, '0')
    const d = String(t.getDate()).padStart(2, '0')
    return [`${y}-${m}-${d}`, t]
  }

  // 後日 commit のタイムスタンプ
  // console.log(times.map(v => v[0]).join('\n'))

  const times = workout.history.map(commit => commit.date).map(getTimes)
  times.reverse()

  let prev = ''
  const strs = times.map((v, i) => {
    if (v[0] === prev) {
      // 一致する場合は前日に
      const time = getTimes(new Date(v[1] - 24 * 60 * 60 * 1000))
      prev = time[0]
      return time[0]
    }
    prev = v[0]
    return v[0]
  })

  strs.reverse()
  console.log(strs.join('\n'))
}

main()
