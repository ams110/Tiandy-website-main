import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import './index.css'

// Strip trailing slash so the router basename is clean (e.g. "/Tiandy").
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const createRoot = ViteReactSSG({ routes, basename })
