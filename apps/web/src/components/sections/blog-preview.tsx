"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { BLOG_PREVIEW as MOCK_BLOG_PREVIEW } from "@/lib/mock-data";

type BlogItem = { title: string; excerpt: string | null; category?: string | null; slug?: string };

export function BlogPreview({ posts }: { posts?: BlogItem[] }) {
  const list = posts && posts.length > 0 ? posts : MOCK_BLOG_PREVIEW;

  return (
    <section id="blog" className="px-4 py-24 bg-forest/[0.03] dark:bg-mint/[0.03]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="From the blog" title="Ayurveda, explained without the mysticism" />

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {list.map((post, i) => (
            <motion.a
              href={post.slug ? `/blog/${post.slug}` : "#blog"}
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group block rounded-3xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-6"
            >
              <span className="font-utility text-xs uppercase tracking-wide text-emerald">{post.category}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-forest dark:text-mint">{post.title}</h3>
              <p className="mt-2 font-body text-sm text-forest/65 dark:text-mint/65">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-utility text-xs font-medium text-forest dark:text-mint">
                Read more
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
