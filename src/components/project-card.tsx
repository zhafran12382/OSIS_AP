import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div
        className={cn(
          "bg-white rounded-xl shadow-md border border-gray-100 p-5",
          "hover:shadow-lg transition"
        )}
      >
        <span className="inline-block rounded-full bg-gray-900 text-white text-xs px-3 py-1">
          {project.category}
        </span>

        <h3 className="font-bold text-lg mt-3">{project.title}</h3>

        {project.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {project.description}
          </p>
        )}

        {project.deadline && (
          <p className="text-xs text-gray-400 mt-3">
            Deadline: {format(new Date(project.deadline), "dd MMM yyyy, HH:mm")}
          </p>
        )}
      </div>
    </Link>
  );
}
