import { OpenAIApi, Configuration } from 'openai';

const errorHandler = async (err, req, res, next) => {
  console.error(err.stack);

  try {
    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
    
    const prompt = `Analyze the following error and provide a brief explanation and possible solution:
    
    Error: ${err.message}
    Stack: ${err.stack}
    
    Please format your response as JSON with the following structure:
    {
      "message": "Brief explanation of the error",
      "possibleSolution": "A possible solution to the error"
    }`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = JSON.parse(completion.data.choices[0].message.content);
    
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: analysis
    });
  } catch (aiError) {
    console.error('Error using AI for error analysis:', aiError);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

export default errorHandler;