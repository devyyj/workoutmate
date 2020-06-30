const m = require('moment')
// require('moment-timezone')
// m.tz.setDefault('Asia/Seoul')

const date = m().format('YYYY-MM-DD')
const time = m().format('HH:mm:ss')

console.log(m())
console.log(date)
console.log(time)
console.log(m(`${date} ${time}`))
