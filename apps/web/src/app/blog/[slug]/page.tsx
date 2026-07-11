import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { getBlogBySlug } from "database";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getBlogBySlug>> | null = null;
  try {
    post = await getBlogBySlug(slug);
  } catch {
    // DB unreachable — fall through to notFound()
  }

  if (!post) notFound();

  return (
    <main>
      <Navbar />
      <article className="px-4 pt-36 pb-24">
        <div className="mx-auto max-w-2xl">
          <Link href="/#blog" className="inline-flex items-center gap-1.5 font-utility text-xs text-forest/60 dark:text-mint/60 hover:text-emerald mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
          </Link>

          {post.category && (
            <span className="font-utility text-xs uppercase tracking-wide text-emerald">{post.category}</span>
          )}
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-forest dark:text-mint">
            {post.title}
          </h1>
          <p className="mt-3 font-utility text-xs text-forest/50 dark:text-mint/50">
            By {post.author}{post.publishedAt ? ` · ${post.publishedAt}` : ""}
          </p>

          <div className="mt-8 font-body text-forest/80 dark:text-mint/80 leading-relaxed [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-forest dark:[&_h1]:text-mint [&_p]:mb-4">
            <ReactMarkdown>{post.contentMd}</ReactMarkdown>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
