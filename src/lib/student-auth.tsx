"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const CLASS_OPTIONS = [
  "7A", "7B", "7C",
  "8A", "8B", "8C",
  "9A", "9B",
] as const;

export type StudentClass = (typeof CLASS_OPTIONS)[number];

export interface StudentSession {
  name: string;
  studentClass: StudentClass;
}

interface StudentAuthContextType {
  student: StudentSession | null;
  login: (name: string, studentClass: StudentClass) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
}

const StudentAuthContext = createContext<StudentAuthContextType>({
  student: null,
  login: async () => ({ success: false }),
  logout: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
});

const STORAGE_KEY = "osis_student_session";

/** Only letters and spaces, no numbers or special characters */
export function isValidStudentName(name: string): boolean {
  return /^[a-zA-Z\s]+$/.test(name.trim()) && name.trim().length >= 2;
}

function getStoredSession(): StudentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StudentSession;
      if (parsed.name && parsed.studentClass) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<StudentSession | null>(getStoredSession);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = useCallback(async (name: string, studentClass: StudentClass) => {
    const trimmed = name.trim();

    if (!isValidStudentName(trimmed)) {
      return { success: false, error: "Nama hanya boleh mengandung huruf dan spasi (minimal 2 karakter)." };
    }

    if (!CLASS_OPTIONS.includes(studentClass)) {
      return { success: false, error: "Pilih kelas yang valid." };
    }

    // Check if the student is banned
    if (isSupabaseConfigured) {
      const { data: banned } = await supabase
        .from("banned_students")
        .select("id")
        .eq("student_name", trimmed)
        .eq("student_class", studentClass)
        .maybeSingle();

      if (banned) {
        return { success: false, error: "Akun Anda telah diblokir oleh admin. Hubungi OSIS untuk informasi lebih lanjut." };
      }
    }

    const session: StudentSession = { name: trimmed, studentClass };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setStudent(session);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStudent(null);
  }, []);

  return (
    <StudentAuthContext.Provider
      value={{ student, login, logout, showLoginModal, setShowLoginModal }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  return useContext(StudentAuthContext);
}
