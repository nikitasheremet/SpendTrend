import router from '@/router'

export function handleUnauthorized() {
  console.warn('Unauthorized access - redirecting to login.')
  router.push('/login')
}
