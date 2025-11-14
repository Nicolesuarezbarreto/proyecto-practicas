import { api } from '../api/client';

export function getDashboard() {
  return api.get('/api/dashboard');
}
