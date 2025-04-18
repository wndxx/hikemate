const isProduction = import.meta.env.PROD;

export const api = isProduction 
  ? mockApi  // Gunakan mock API di production
  : realApi; // Gunakan axios/real API di development

// Contoh penggunaan:
// import { api } from './apiConfig';
// api.getMountains().then(...)