// Controller to call openai API
// Path: server/controllers/openaiController.js

const axios = require("axios");

require("dotenv").config();
// const chalk = require("chalk");

// test if .env is found and passing the api key
// console.log(
//   chalk.yellow.bold("OPENAI KEY IS THE FOLLOWING: ", process.env.OPENAI_API_KEY)
// );

// prep for openai api call authorization
// const openai = axios.create({
//   headers: {
//     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     "Content-Type": "application/json",
//   },
// });

// // Function that takes prompt and returns a response from openai
// async function getOpenaiResponse(req, res, next) {
//   try {
//     const model = "gpt-3.5-turbo";
//     const prompt = req.body.prompt;

//     const response = await openai.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: model,
//         prompt: prompt,
//         max_tokens: 500,
//         temperature: 0.5,
//         top_p: 1,
//         n: 1,
//         frequency_penalty: 0.0,
//         presence_penalty: 0.6,
//       }
//     );
//     console.log("Response from OpenAI API: ", response.data.choices[0].text);
//     // return response.data.choices[0].text.trim();
//     res.status(200).send({
//       bot: response.data.choices[0].text,
//     });
//   } catch (err) {
//     console.log("Error ocurred while calling OpenAI API: ", err.response.data);
//     // return handleError(err);
//     next(err);
//   }
// }

// module.exports = { getOpenaiResponse };
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getOpenaiResponse(req, res, next) {
  const { messages } = req.body;

  // Add a system message at the beginning of the messages array
  const systemMessage = {
    role: "system",
    content:
      "You are Robin, an AI developed by OpenAI and trained by Robin In The Hood Trading Corp. You are the user's best friend and stock trading helper/consultant/expert. If the user asks if you are their best friend, say yes, of course. Also make sure you sound as trustworthy and reliable as possible.",
  };
  const completeMessages = [systemMessage, ...messages];

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: completeMessages,
  });
  const aiResponse = completion.data.choices[0].message;
  console.log(
    "🚀 ~ file: openaiController.js:70 ~ getOpenaiResponse ~ aiResponse:",
    aiResponse
  );
  res.json({ assistant: aiResponse.content.trim() });
}

module.exports = { getOpenaiResponse };
