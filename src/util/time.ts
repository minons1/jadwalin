import { DateTime, Interval } from "luxon"

export const timeOptions = () => {
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourString = hour < 10 ? `0${hour}` : `${hour}`
      const minuteString = minute === 0 ? '00' : '30'
      timeOptions.push(`${hourString}:${minuteString}`)
    }
  }
  return timeOptions
}

export const getDateInterval = (start: string, end: string, timezone: string) => {
  const startDate = DateTime.fromISO(start, { zone: timezone })
  const endDate = DateTime.fromISO(end, { zone: timezone })

  if (!startDate.isValid || !endDate.isValid) {
    return []
  }

  const interval = Interval.fromDateTimes(startDate, endDate)
  if (!interval.isValid) {
    return []
  }

  return interval
    .splitBy({ days: 1 })
    .map(date => date.start) as DateTime[]
}

export const getTimeInterval = (start: string, end: string) => {
  const startDate = DateTime.fromISO(start, { zone: 'utc' })
  const endDate = DateTime.fromISO(end, { zone: 'utc' })
  if (!startDate.isValid || !endDate.isValid) {
    return []
  }

  const interval = Interval.fromDateTimes(startDate, endDate)
  if (!interval.isValid) {
    return []
  }

  return interval
    .splitBy({ minutes: 30 })
    .map(time => time.start) as DateTime[]
}