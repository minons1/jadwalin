/* eslint-disable no-console */
const luxon = require('luxon');

(() => {
  // const timeInterval = luxon.Interval.fromDateTimes(
  //   luxon.DateTime.local(2017, 5, 15, 9, 0, 0),
  //   luxon.DateTime.local(2017, 5, 15, 10, 0, 0)
  // )

  // timeInterval.splitBy({ minutes: 30 }).forEach(time => {
  //   console.log('start', time.start.toISO())
  //   console.log('end', time.end.toISO())
  // })

  const dateInterval = luxon.Interval.fromDateTimes(
    luxon.DateTime.local(2017, 5, 15, 0, 0, 0),
    luxon.DateTime.local(2017, 5, 15, 0, 0, 1)
  )

  dateInterval.splitBy({ days: 1 }).forEach(date => {
    console.log('start', date.start.toISO())
    console.log('end', date.end.toISO())
  })
})()