const http = require('http');
const url = require("url")
const OpenAI = require("openai")
const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer();

const openai = new OpenAI({
    apiKey: ""
});

server.on('request', async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    const parameter = pathname.slice(0)
    console.log(parameter)
    if (parameter) {
        try {
            // const imageUrl = await generateImageFromPrompt(parameter);
            const bodyText = await getArticleText(parameter)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ url: bodyText }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Error: ${error.message}`);
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found\n');
    }
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

async function generateImageFromPrompt(prompt) {
    console.log("generating image")
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    });
    const url = response.data[0].url
    console.log(url)
    return url
}

async function getArticleText(prompt) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new JSDOM(html, { url }).window.document;
        const reader = new Readability(doc);
        return reader.parse();
    } catch (error) {
        // console.error(error)
    }
}