import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { useCallback, useState } from 'react'
import { useInterval } from './useInterval'

enum REFRESH_INTERVAL {
  EVERY_SEC = 1,
  EVERY_HOUR = 3600,
}

interface ICountdownTimerState {
  days: number
  hours: number
  minutes: number
  seconds: number
  passed: boolean
}

const countdownTimerInitial: ICountdownTimerState = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  passed: false,
}

enum TIME_LABEL {
  DAY,
  HOUR,
  MINUTE,
  SECOND,
}

function getTimeDif(label: TIME_LABEL, dueDate: number): number {
  const now = DateTime.now().toUnixInteger()
  const dif = BigNumber.from(dueDate - now)
  switch (label) {
    case TIME_LABEL.DAY:
      return dif.div(60).div(60).div(24).toNumber()
    case TIME_LABEL.HOUR:
      return dif.div(60).div(60).mod(24).toNumber()
    case TIME_LABEL.MINUTE:
      return dif.div(60).mod(60).toNumber()
    case TIME_LABEL.SECOND:
      return dif.mod(60).toNumber()
    default:
      return 0
  }
}

export const useCountdownTimer = (dueDate: number) => {
  const [countdownTimer, setCountdownTimer] = useState<ICountdownTimerState>(countdownTimerInitial)
  const counter = useCallback(() => {
    if (!dueDate) {
      return
    }

    const now = DateTime.now().toUnixInteger()

    if (dueDate <= now) {
      setCountdownTimer({
        ...countdownTimerInitial,
        passed: true,
      })
      return
    }

    setCountdownTimer({
      days: getTimeDif(TIME_LABEL.DAY, dueDate),
      hours: getTimeDif(TIME_LABEL.HOUR, dueDate),
      minutes: getTimeDif(TIME_LABEL.MINUTE, dueDate),
      seconds: getTimeDif(TIME_LABEL.SECOND, dueDate),
      passed: false,
    })
  }, [dueDate])

  const fetchInterval = (): number => {
    if (!dueDate) {
      return REFRESH_INTERVAL.EVERY_HOUR
    }
    if (dueDate <= DateTime.now().toUnixInteger()) {
      return REFRESH_INTERVAL.EVERY_HOUR
    }

    return REFRESH_INTERVAL.EVERY_SEC
  }

  useInterval(() => {
    counter()
  }, 1000 * fetchInterval())

  return countdownTimer
}
