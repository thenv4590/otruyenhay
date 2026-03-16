export async function onRequest(context) {

    const url = new URL(context.request.url);
    const truyen = url.searchParams.get("truyen");

    if (!truyen) {
        return context.next();
    }

    const ua = context.request.headers.get("user-agent") || "";

    // nếu là bot facebook
    if (ua.includes("facebookexternalhit") || ua.includes("Facebot")) {
        const DATA_BASE = "https://otruyenhay.pages.dev/";
        const DATA_IMG = DATA_BASE + "images/covers/";
        const res = await fetch(DATA_BASE + "stories.json");
        const data = await res.json();

        const story = data.stories.find(s => s.file === truyen);

        if (!story) {
            return context.next();
        }

        const html = `
        <html>
        <head>
        <meta property="og:title" content="${story.title}">
        <meta property="og:description" content="${story.description}">
        <meta property="og:image" content="${DATA_IMG + story.cover}">
        <meta property="og:type" content="article">
        <meta property="og:url" content="${url}">
        </head>
        <body></body>
        </html>
        `;

        return new Response(html, {
            headers: { "content-type": "text/html" }
        });

    }

    return context.next();
}