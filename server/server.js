require('dotenv').config();
const OpenAI = require('openai');
const express = require('express'); 
const cors = require('cors');

const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200
};

const app = express(); 
const PORT = 3001;

app.use(express.json()); 
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello, Express is running!');
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_URL
})

app.post('/translate', async (req, res) => {
  const { textToTranslate, language } = req.body;

  const messages = [ 
  {
    role: "system",
    content: `You are a translator app that simply translates the given text from English to the 
    specified language. Do not include any headers, footers, or additional information besides the translation. 
    Do not give many different options for translations in your response; simply give one, accurate translation. Make the translation as accurate as possible, as an expert translator would. If no text is provided, output nothing. If gibberish is provided or the text provided is not in English, simply repeat back the provided text with no changes. `
  }, 
  {
    role: 'user',
    content: `Translate this text from English to french: `
  },
  {
    role: "assistant",
    content: ``
  },
  {
    role: 'user',
    content: `Translate this text from English to french: a;osdfjknapiuh;ajnwk.egsdzvxliu`
  },
  {
    role: 'assistant',
    content: `a;osdfjknapiuh;ajnwk.egsdzvxliu`
  },
  {
    role: "user",
    content: `Translate this text from English to french: How are you?`
  },
  {
    role: "assistant",
    content: 'Comment allez-vous?'
  }
]

  try {
    messages.push({
      role: "user",
      content: `Translate this text from English to ${language}: ${textToTranslate}`
    })

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages
    })

    const text = response.choices[0].message.content;

    return res.json({text})

  } catch (error) {
    console.log(`There is an error with the server: ${error}`)
  }

});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
