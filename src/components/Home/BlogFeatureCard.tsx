import { CalendarDays, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types";
import { format } from "date-fns";

interface BlogFeatureCardProps {
  post: Blog;
  className?: string;
}

export default function BlogFeatureCard({
  post,
  className = "",
}: BlogFeatureCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className={`group relative block w-full h-64 md:h-full overflow-hidden rounded-xl ${className}`}
    >
      <Image
        src={post.image_url}
        alt={post.title}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* dark overlay so text stays readable on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-darkgray px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-white text-base sm:text-lg lg:text-xl font-bold line-clamp-2 mb-2">
          {post.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs mb-3">
          {post.users?.name && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.users.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {format(new Date(post.created_at), "MMM dd, yyyy")}
          </span>
        </div>

        <span className="inline-flex w-fit items-center text-xs font-bold uppercase bg-primary text-font px-4 py-2 rounded transition-colors group-hover:bg-primary/90">
          Read More
        </span>
      </div>
    </Link>
  );
}
