import { useRoutes } from 'react-router-dom'
import { routes } from './routes/index.jsx'
import React from 'react'
export default function App() {
  const element = useRoutes(routes)
  console.log(element)
  return element
}
