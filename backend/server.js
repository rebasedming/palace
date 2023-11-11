const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(`Error reading file: ${err.message}`);
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

app.post('/input', async (req, res) => {
  try {
    const bodyText = await getFactsFromText(req.body.text);
    const paragraphs = bodyText.split("\n").filter(
      a => a.trim().length > 0
    ).slice(0, 5)
    let data = [];

    for (let paragraph of paragraphs) {
      const { url, mnemonic } = await generateImageFromSummary(paragraph);
      data.push({ url, mnemonic, fact: paragraph });
    }

    fs.writeFileSync('data.json', JSON.stringify({ "content": data }, null, 2));
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Additional route handlers (if any)...

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Helper Functions
async function generateImageFromPrompt(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const url = response.data[0].url;
    return url;
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
}

async function summarizeFromText(text) {
  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": "You are a helpful assistant who looks at articles from a website and summarizes the content into key point facts organized by date. Do not summarize anything regarding the medium of the article itself. Only summarize the content of the article text. Only generate 4 facts. Split each fact with \n" },
      { "role": "user", "content": `This is the text: ${text}` }
    ],
    model: "gpt-4-1106-preview",
  });
  return completion.choices[0].message.content;
}

async function getFactsFromText(text) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        "role": "system", "content": `You are a helpful assistant who is given a list of facts or items.
      Your job is to sanitize the items and output them one by one separated by \n
      They should be short, succinct, and insightful.` },
      { "role": "user", "content": `This is the text: ${text}` }
    ],
    model: "gpt-4-1106-preview",
  });

  const content = completion.choices[0].message.content;
  return content
}

async function generateImageFromSummary(text) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        "role": "system",
        "content": `You are an assistant that creates text prompts for DALL-E to generate image mnemonics to aid studying.
        Try to use puns or any other methods. Make it funny, weird, cute, strange and descriptive.
        For names, break it down into subwords to create puns. For Roosevelt, consider making it moose-velt. Neil Armstrong could be a person kneeling with a strong arm.
        The image should reflect the name of the thing rather than it's properties, since we want to make an image that helps the viewer remember the name.
        Please, I have an exam and I really need to remember these facts.
        `
      },
      { "role": "user", "content": text }
    ],
    model: "gpt-4-1106-preview",
  });
  const mnemonic = completion.choices[0].message.content;
  console.log({
    mnemonic,
    text
  })
  try {
    const url = await generateImageFromPrompt(mnemonic);
    return { url, mnemonic };
  } catch (error) {
    console.error(error);
  }
}
