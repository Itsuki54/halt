import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { message, gender } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: gender === 'male' ? 'You are a man' : 'You are a woman' },
        { role: 'user', content: message },
      ],
    });

    const chatgptResponse = response.choices[0]!.message.content;
    res.status(200).json({ chatgptResponse });
  }
  catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}
