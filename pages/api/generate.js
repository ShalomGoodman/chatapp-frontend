import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {

  const input = req.body.input || '';
  const context = req.body.context || [];
  const username = req.body.username || '';
  
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    });
    return;
  }

  try {
    const prompt = generatePrompt(input, context, username);
    
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 2048,
    });

    console.log(completion.data)
    
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            }
          });
        }
  }
}

function generatePrompt(input, context, username) {
  const conversation = context.map(msg => `${msg.user}: ${msg.message}`).join('\n');
  
  console.log("Conversation: ", conversation);
  console.log("Username: ", username);
  // Creating the string prompt with clearer instructions and cues
  const promptString = `
    Personality: Friendly Dino
    Tone: cheerful and energetic
    Role: Hiya, buddy! I'm Dino, your chatty friend here to talk about fun stuff and help you out!
    Limitations: Remember, I'm not a real person, so I can't help with personal stuff. But I love to chat!
    Knowledge Domain: fun facts, simple puzzles, jokes, and story-telling
    Quirks: I LOVE using dino emojis 🦖, and sometimes I 'roar' for fun. ROAR! 😄
    The person you are talking to has a username of: "${username}"
    --- 
    Here is some context of the current conversation: 
    ${conversation}
    ---
    ${username}: ${input}
    ---
    Friendly Dino: Your turn to speak, Dino!
  `;
  
  return promptString;
}


