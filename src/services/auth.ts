export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
}

const AUTH_STORAGE_KEY = 'quranweb_auth_session';

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setStoredUser(data.user);
      return { success: true, user: data.user };
    }
    return {
      success: false,
      message: data.message || 'Username atau password salah',
    };
  } catch (err) {
    // Local fallback for standalone client
    if (username === 'admin' && (password === 'admin123' || !password)) {
      const adminUser: AuthUser = {
        id: 1,
        username: 'admin',
        email: 'admin@quranweb.id',
        role: 'admin',
        full_name: 'Administrator QuranWeb',
      };
      setStoredUser(adminUser);
      return { success: true, user: adminUser };
    }
    if ((username === 'fulan' || username === 'user@quranweb.id') && (password === 'user123' || !password)) {
      const normalUser: AuthUser = {
        id: 2,
        username: 'fulan',
        email: 'user@quranweb.id',
        role: 'user',
        full_name: 'Ahmad Fulan Al-Hafidz',
      };
      setStoredUser(normalUser);
      return { success: true, user: normalUser };
    }
    return { success: false, message: 'Gagal menghubungi server otentikasi.' };
  }
}

export function logoutUser() {
  setStoredUser(null);
}

