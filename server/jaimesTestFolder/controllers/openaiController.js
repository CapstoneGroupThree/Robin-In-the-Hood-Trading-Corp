// Controller to call openai API
// Path: server/controllers/openaiController.js

const axios = require("axios");

require("dotenv").config();
const chalk = require("chalk");

// test if .env is found and passing the api key
console.log(chalk.yellow.bold("OPENAI KEY IS THE FOLLOWING: ", process.env.OPENAI_API_KEY));

// prep for openai api call authorization
const openai = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Function that takes prompt and returns a response from openai
async function getOpenaiResponse(prompt, model) {
  try {
    const response = await openai.post(
      "https://api.openai.com/v1/completions",
      {
        model: model,
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
        top_p: 1,
        n: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
      }
    );
    console.log("Response from OpenAI API: ", response.data.choices[0].text);
    return response.data.choices[0].text.trim();
  } catch (err) {
    console.log('Error ocurred while calling OpenAI API: ', err.response.data);
    return handleError(err);
  }
}

