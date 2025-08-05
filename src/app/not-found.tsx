import { redirect } from 'next/navigation'

function NotFound() {
  redirect('/page-not-found')
  return null
}


export default NotFound