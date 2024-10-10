import Layout from "../layout";
import { Bot } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { db } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { purpose as purposeList } from '@/data/purpose';
import { character as characterList } from '@/data/character';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface Props {
  bot: Bot;
}

export default function BotPage({ bot }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: bot
  });

  const onSubmit = async (data: Bot) => {
    try {
      const response = await fetch(`/api/bot/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast.success("Bot information saved successfully!");
    } catch (error) {
      toast.error('Error saving bot information.');
      console.error('Error saving bot:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Bot Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Bot Information</h2>
          <p className="text-lg text-gray-700"><strong>Gender:</strong> {bot.gender}</p>
          <p className="text-lg text-gray-700"><strong>Purpose:</strong> {bot.purpose}</p>
          <p className="text-lg text-gray-700"><strong>Character:</strong> {bot.character}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Bot Information</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              {...register("gender", {
                validate: value => value === "male" || value === "female" || "Invalid gender selected"
              })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            <select
              {...register("purpose", {
                validate: value => purposeList.includes(value) || "Invalid purpose selected"
              })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Purpose</option>
              {purposeList.map((purpose, index) => (
                <option key={index} value={purpose}>{purpose}</option>
              ))}
            </select>
            {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Character</label>
            <select
              {...register("character", {
                validate: value => characterList.includes(value) || "Invalid character selected"
              })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Character</option>
              {characterList.map((character, index) => (
                <option key={index} value={character}>{character}</option>
              ))}
            </select>
            {errors.character && <p className="text-red-500 text-sm">{errors.character.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Save Bot Information
          </button>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/signup',
        permanent: false,
      },
    };
  }

  const botData = await db.bot.findUnique({
    where: {
      userId: session.user.uid,
    },
  });

  if (!botData) {
    return {
      redirect: {
        destination: '/bot/new',
        permanent: false,
      },
    };
  }

  const bot = JSON.parse(JSON.stringify(botData));

  return {
    props: {
      bot,
    },
  };
};