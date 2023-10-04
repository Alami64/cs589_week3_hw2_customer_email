import { Configuration, OpenAIApi } from "openai";
import { exec } from 'child_process';



const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  const pythonProcess = exec(`python3 answer.py "${question}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error ${error}`);
      res.status(500).json({ error: { message: "Internal Server Error" } });
      return;
    }

    if (stderr) {
      console.error(`Python script error: ${stderr}`);
  }

    const pythonResponse = stdout.trim();
    res.status(200).json({ answer: pythonResponse });
  
  });
}
