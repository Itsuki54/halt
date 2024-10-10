import {
  File,
  Formidable,
} from 'formidable';
import fs from 'fs';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { OpenAI } from 'openai';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const form = new Formidable({
    uploadDir: path.join(process.cwd(), '/tmp'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to parse form data' });
    }

    const audioFile = files.audioFile as unknown as File[];

    if (!audioFile) {
      return res.status(400).json({ message: 'No valid audio file provided' });
    }

    try {
      const filePath = audioFile[0].filepath;
      if (!filePath) {
        return res.status(400).json({ message: 'File path is undefined' });
      }

      const response = await openai.audio.transcriptions.create({
<<<<<<< HEAD
=======
        language: 'ja',
>>>>>>> develop
        model: 'whisper-1',
        file: fs.createReadStream(filePath),
      });

      return res.status(200).json({ transcription: response.text });
    }
    catch (error) {
      return res.status(500).json({ message: 'Failed to transcribe audio', error });
    }
  });
};

export default handler;
