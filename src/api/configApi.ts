
import { server } from '@/config/config'
import axios from 'axios'

export const api = axios.create({
    baseURL: server.serverUrl,
})
