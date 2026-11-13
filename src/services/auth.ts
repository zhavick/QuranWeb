export type UserRole = 'admin' | 'asatidz' | 'editor' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  full_name: string;
}

const AUTH_STORAGE_KEY = 'quranweb_auth_session';

export function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('quranweb_auth_changed'));
  }
}

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
  notifyAuthChange();
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
    // Local fallback for standalone client / offline mode
    const cleanUser = username.trim().toLowerCase();

    // 1. Super Admin
    if ((cleanUser === 'admin' || cleanUser === 'admin@quranweb.id') && (password === 'admin123' || !password)) {
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

    // 2. Dewan Asatidz & Verifikator Sanad
    if ((cleanUser === 'asatidz' || cleanUser === 'asatidz@quranweb.id') && (password === 'asatidz123' || !password)) {
      const asatidzUser: AuthUser = {
        id: 2,
        username: 'asatidz',
        email: 'asatidz@quranweb.id',
        role: 'asatidz',
        full_name: "Ustadz DR. Ahmad Mu'allim, Lc.",
      };
      setStoredUser(asatidzUser);
      return { success: true, user: asatidzUser };
    }

    // 3. Editor & Tim Redaksi Jurnal
    if ((cleanUser === 'editor' || cleanUser === 'editor@quranweb.id') && (password === 'editor123' || !password)) {
      const editorUser: AuthUser = {
        id: 3,
        username: 'editor',
        email: 'editor@quranweb.id',
        role: 'editor',
        full_name: 'Siti Maryam, S.Pd.I (Tim Redaksi)',
      };
      setStoredUser(editorUser);
      return { success: true, user: editorUser };
    }

    // 4. Anggota Jamaah Demo
    if ((cleanUser === 'fulan' || cleanUser === 'user@quranweb.id') && (password === 'user123' || !password)) {
      const normalUser: AuthUser = {
        id: 4,
        username: 'fulan',
        email: 'user@quranweb.id',
        role: 'user',
        full_name: 'Ahmad Fulan Al-Hafidz',
      };
      setStoredUser(normalUser);
      return { success: true, user: normalUser };
    }

    return {
      success: false,
      message: 'Username atau password tidak sesuai. Coba admin/admin123, asatidz/asatidz123, editor/editor123, atau fulan/user123',
    };
  }
}

export function logoutUser() {
  setStoredUser(null);
}
