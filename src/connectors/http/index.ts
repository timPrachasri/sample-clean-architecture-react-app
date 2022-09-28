import axios from 'axios'

export const httpService = axios.create({
  baseURL: process.env.WORK_TRIAL_API_URL,
})
