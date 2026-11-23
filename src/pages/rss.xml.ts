import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const articles = await getCollection("articles");
  return rss({
    title: "SH11235",
    description: "将棋ソフトウェア開発の記事",
    site: context.site!,
    items: articles
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((article) => ({
        title: article.data.title,
        pubDate: article.data.date,
        description: article.data.description,
        link: `/articles/${article.id}/`,
      })),
  });
};
