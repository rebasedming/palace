const http = require('http');
const url = require("url")
const fs = require("fs")
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability')
const OpenAI = require("openai")
const hostname = '127.0.0.1';
const port = 3001;

const dotenv = require('dotenv');
dotenv.config();

const server = http.createServer();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

server.on('request', async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const parameter = pathname.slice(1)
    if (parameter === 'data') {
        // Serve the data.json file
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Error reading file: ${err.message}`);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
            }
        });
    }
    else if (parameter && parameter != "favicon.ico") {
        try {
            const bodyText = await summarizeFromText(await getArticleText(parameter));
            const paragraphs = bodyText.split("\n");
            let data = [];

            for (let idx in paragraphs) {
                console.log(paragraphs[idx]);
                const { url, mnemonic } = await generateImageFromSummary(paragraphs[idx]);
                console.log(url);
                data.push({ url, mnemonic, fact: paragraphs[idx] });
            }

            // Write to JSON file
            fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ data }));
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
    try {

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        const url = response.data[0].url
        return url
    }
    catch (error) {
        console.error(error)
    }
}

async function getArticleText(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new JSDOM(html, { url }).window.document;
        const reader = new Readability(doc);
        return reader.parse().textContent;
    } catch (error) {
        console.error(error)
    }
}

async function summarizeFromText(text) {
    const completion = await openai.chat.completions.create({
        messages: [{ "role": "system", "content": "You are a helpful assistant looks at text pulled from a article from a website and summarizes the content into key point facts organized by date. Do not summarize anything regarding the medium of the article itself. Only summarize the content of the article text. Split each fact with \n" },
        { "role": "user", "content": `This is the text ${text}` }],
        model: "gpt-4-1106-preview",
    });

    return completion.choices[0].message.content
}

async function generateImageFromSummary(text) {
    const completion = await openai.chat.completions.create({
        messages: [{ "role": "system", "content": "You are an assistant that creates text prompts for DALLE-3 to generate image mnemonics to aid studying. Try to use puns or any other methods. Generate in a cartoon style" },
        { "role": "user", "content": `Buzz aldrin was one of first astronauts on the moon` },
        { "role": "system", "content": `A bumblebee in an astronaut costume on the moon with a nametag that says Buzz Aldrin` },
        { "role": "user", "content": text }],
        model: "gpt-4-1106-preview",
    });
    const mnemonic = completion.choices[0].message.content;
    try {

        const url = await generateImageFromPrompt(mnemonic);
        return { url, mnemonic, fact: text };
    }
    catch (error) {
        console.error(error)
    }
}
