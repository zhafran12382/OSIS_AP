"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FolderOpen, Clock, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingSubmissions: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [projectsRes, pendingRes, studentsRes] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("leaderboard").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalProjects: projectsRes.count ?? 0,
        pendingSubmissions: pendingRes.count ?? 0,
        totalStudents: studentsRes.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    {
      icon: FolderOpen,
      label: "Total Proyek",
      value: stats.totalProjects,
    },
    {
      icon: Clock,
      label: "Menunggu Validasi",
      value: stats.pendingSubmissions,
    },
    {
      icon: Users,
      label: "Siswa Berpartisipasi",
      value: stats.totalStudents,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <card.icon className="w-6 h-6 text-gray-500 mb-3" />
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
