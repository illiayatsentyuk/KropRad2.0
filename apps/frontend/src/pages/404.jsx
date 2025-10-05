import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div>
      <h1>404 Page</h1>
      <Link to="/">Go to home</Link>
    </div>
  )
}