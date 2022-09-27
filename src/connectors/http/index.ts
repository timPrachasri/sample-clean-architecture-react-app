import axios from 'axios'

export let httpService = axios.create()

export const initHttpService = () => {
  httpService = axios.create({
    baseURL: process.env.WORK_TRIAL_API_URL,
  })
}
