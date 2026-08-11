import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 記事は src/content/articles/*.md を git push するだけで一覧・詳細ページが生成される
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
});

export const collections = { articles };
