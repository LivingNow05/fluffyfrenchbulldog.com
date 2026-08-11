import React from 'react';

export interface BlogPostItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
}

interface BlogHoverGridProps {
  posts: BlogPostItem[];
}

export const BlogHoverGrid: React.FC<BlogHoverGridProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      {posts.map((post) => (
        <a
          href={`/blog/${post.slug}/`}
          key={post.slug}
          className="group block h-full w-full text-decoration-none"
        >
          <div className="h-full w-full p-6 rounded-2xl bg-[#121215] border border-[#27272a] group-hover:border-rose-600 group-hover:bg-[#18181b] transition-colors duration-200 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#271219] text-rose-400 border border-[#4c1d28] mb-4">
                {post.category}
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors mb-3 leading-snug m-0">
                {post.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4 m-0">
                {post.description}
              </p>
            </div>
            <div className="pt-4 border-t border-[#27272a] text-xs text-zinc-400 flex items-center justify-between">
              <span>📅 {post.date}</span>
              <span>✍️ {post.author}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
