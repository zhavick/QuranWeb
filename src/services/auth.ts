export type UserRole = 'admin' | 'asatidz' | 'editor' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  full_name: string;
}

const AUTH_STORAGE_KEY = 'quranweb_auth_session';
const REGISTERED_USERS_KEY = 'quranweb_registered_users';

interface StoredOfflineUser extends AuthUser {
  password?: string;
}

function getOfflineRegisteredUsers(): StoredOfflineUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOfflineRegisteredUser(user: StoredOfflineUser) {
  try {
    const list = getOfflineRegisteredUsers();
    list.push(user);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed saving offline user:', err);
  }
}

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

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export async function registerUser(
  payload: RegisterPayload
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const cleanFullName = payload.fullName.trim();
  const cleanUser = payload.username.trim().toLowerCase();
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPass = payload.password.trim();

  if (!cleanUser || !cleanEmail || !cleanPass) {
    return {
      success: false,
      message: 'Nama lengkap, username, email, dan kata sandi wajib diisi.',
    };
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: cleanFullName,
        username: cleanUser,
        email: cleanEmail,
        password: cleanPass,
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setStoredUser(data.user);
      return { success: true, user: data.user, message: data.message };
    }
    return {
      success: false,
      message: data.message || 'Pendaftaran gagal diproses.',
    };
  } catch (err) {
    // Offline / Standalone Client fallback
    const offlineUsers = getOfflineRegisteredUsers();
    const existing = offlineUsers.find(
      (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanEmail
    );

    // Also check demo accounts
    const isDemoTaken =
      ['admin', 'asatidz', 'editor', 'fulan'].includes(cleanUser) ||
      ['admin@quranweb.id', 'asatidz@quranweb.id', 'editor@quranweb.id', 'user@quranweb.id'].includes(cleanEmail);

    if (existing || isDemoTaken) {
      return {
        success: false,
        message: 'Username atau email ini sudah terdaftar. Silakan gunakan yang lain.',
      };
    }

    const newUser: StoredOfflineUser = {
      id: Date.now(),
      username: cleanUser,
      email: cleanEmail,
      role: 'user',
      full_name: cleanFullName || cleanUser,
      password: cleanPass,
    };

    saveOfflineRegisteredUser(newUser);

    const safeUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      full_name: newUser.full_name,
    };

    setStoredUser(safeUser);
    return {
      success: true,
      user: safeUser,
      message: 'Alhamdulillah! Pendaftaran akun berhasil disimpan di perangkat Anda.',
    };
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

    // 5. Offline Registered Users
    const offlineUsers = getOfflineRegisteredUsers();
    const matched = offlineUsers.find(
      (u) =>
        (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) &&
        (u.password === password || !u.password)
    );
    if (matched) {
      const safeUser: AuthUser = {
        id: matched.id,
        username: matched.username,
        email: matched.email,
        role: matched.role,
        full_name: matched.full_name,
      };
      setStoredUser(safeUser);
      return { success: true, user: safeUser };
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
