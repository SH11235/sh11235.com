function getStandaloneUrl(paragraph) {
  const [link] = paragraph.children;
  if (paragraph.children.length !== 1 || link.type !== "link") return;

  const [label] = link.children;
  if (link.children.length !== 1 || label.type !== "text" || label.value !== link.url) return;
  if (!link.position || !label.position) return;

  // A bracketed Markdown link can also have its URL as the label.
  const leading = label.position.start.offset - link.position.start.offset;
  const trailing = link.position.end.offset - label.position.end.offset;
  if (leading !== trailing || leading > 1) return;

  const url = URL.parse(link.url);
  if (url?.protocol === "https:" && !url.port && !url.username && !url.password) return url;
}

function parseStart(value) {
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    return Number.isSafeInteger(seconds) ? seconds : undefined;
  }
  const time = /^(?=\d)(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!time) return;

  const [, hours = 0, minutes = 0, seconds = 0] = time;
  const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  return Number.isSafeInteger(total) ? total : undefined;
}

function youtubeEmbed(url) {
  let id;
  if (
    ["www.youtube.com", "youtube.com", "m.youtube.com"].includes(url.hostname) &&
    url.pathname === "/watch"
  ) {
    id = url.searchParams.get("v");
  } else if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1);
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return;

  const start =
    parseStart(url.searchParams.get("start") ?? "") ?? parseStart(url.searchParams.get("t") ?? "");
  const src = `https://www.youtube-nocookie.com/embed/${id}${start === undefined ? "" : `?start=${start}`}`;
  return `<iframe class="youtube-embed" src="${src}" loading="lazy" title="YouTube 動画プレーヤー" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

function hasWidgetsScript(node) {
  if (node.type === "html") {
    const markup = node.value.replace(/<!--[\s\S]*?(?:-->|$)/g, "");
    return /<script\b[^>]*\ssrc\s*=\s*(["'])https:\/\/platform\.twitter\.com\/widgets\.js\1/i.test(
      markup,
    );
  }
  return node.children?.some(hasWidgetsScript);
}

export function urlEmbeds(articlesDir) {
  return {
    name: "url-embeds",
    paragraph(node, ctx) {
      if (!ctx.fileURL?.href.startsWith(articlesDir.href)) return;
      // 箇条書き・引用・脚注の参考リンクまで埋め込みの列にしないよう、本文直下の段落だけを対象にする。
      if (ctx.parent(node)?.type !== "root") return;

      const url = getStandaloneUrl(node);
      if (!url) return;

      if (
        (url.hostname === "x.com" || url.hostname === "twitter.com") &&
        /^\/\w+\/status\/\d+$/.test(url.pathname)
      ) {
        // Keep the fallback URL and its query string safe in raw HTML.
        const href = url.href
          .replaceAll("&", "&amp;")
          .replaceAll('"', "&quot;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
        if (!ctx.data.hasXEmbed) {
          ctx.data.hasXEmbed = true;
          let root = ctx.parent(node);
          while (root.type !== "root") root = ctx.parent(root);
          if (!hasWidgetsScript(root)) {
            ctx.appendChild(root, {
              type: "html",
              value: '<script async src="https://platform.twitter.com/widgets.js"></script>',
            });
          }
        }
        return {
          type: "html",
          value: `<blockquote class="twitter-tweet" data-align="center"><a href="${href}">${href}</a></blockquote>`,
        };
      }

      const embed = youtubeEmbed(url);
      if (embed) return { type: "html", value: embed };
    },
  };
}
