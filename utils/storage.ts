// --- Authentication Utilities ---

const ADMIN_EMAIL = 'admin@eventapp.com';
const ADMIN_PASS = 'password123';
const AUTH_TOKEN_KEY = 'guest_manager_auth_token';
const ADMIN_CREDENTIALS_KEY = 'guest_manager_admin_creds';

export const storage = {
  initAdminCredentials: () => {
    if (!localStorage.getItem(ADMIN_CREDENTIALS_KEY)) {
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASS
      }));
    }
  },

  // Added this function to fix the error
  getAdminCredentials: () => {
    const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Fallback default
    return { email: ADMIN_EMAIL, password: ADMIN_PASS };
  },

  getAuthToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setAuthToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  clearAuthToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  validateCredentials: (email: string, password: string) => {
    const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!stored) return false;
    const admin = JSON.parse(stored);
    return email === admin.email && password === admin.password;
  }
};

// --- File Export/Import Utilities (PC Storage) ---

export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};