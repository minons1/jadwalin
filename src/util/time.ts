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