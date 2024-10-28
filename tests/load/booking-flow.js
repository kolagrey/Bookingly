import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests can fail
  },
}

const BASE_URL = 'http://localhost:3000'

export default function() {
  // Login
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, {
    email: 'test@example.com',
    password: 'password123',
  })
  check(loginRes, { 'logged in successfully': (r) => r.status === 200 })

  sleep(1)

  // Get available experts
  const expertsRes = http.get(`${BASE_URL}/api/experts`)
  check(expertsRes, { 'got experts': (r) => r.status === 200 })

  sleep(1)

  // Create booking
  const bookingRes = http.post(`${BASE_URL}/api/bookings`, {
    expert_id: 'expert-1',
    start_time: new Date().toISOString(),
    duration: 60,
  })
  check(bookingRes, { 'booking created': (r) => r.status === 200 })

  sleep(1)
}