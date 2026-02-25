import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div
        className={cn(
          "card-hover bg-white rounded-xl shadow-md border border-gray-100 p-5 group",
          "hover:shadow-lg transition-all duration-300"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-gray-900 text-white text-xs px-3 py-1">
              {project.category}
            </span>

            <h3 className="font-bold text-lg mt-3 group-hover:text-gray-600 transition-colors">
              {project.title}
            </h3>

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
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
        </div>
      </div>
    </Link>
  );
}
