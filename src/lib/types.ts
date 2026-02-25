export interface Project {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  category: "Lomba" | "Tugas" | "Event";
  attachment_url: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  project_id: string;
  student_name: string;
  student_class: string;
  file_url: string | null;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  points_awarded: number;
  submitted_at: string;
  projects?: Project;
}

export interface LeaderboardEntry {
  id: string;
  student_name: string;
  student_class: string;
  total_score: number;
  approved_projects_count: number;
}

export interface Article {
  id: string;
  title: string;
  content: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export interface BannedStudent {
  id: string;
  student_name: string;
  student_class: string;
  reason: string | null;
  banned_at: string;
}
