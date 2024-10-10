import { character as characterList } from '@/data/character';
import { purpose as purposeList } from '@/data/purpose';
import { db } from '@/lib/prisma';
import { User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '../layout';
type FormData = {
  gender: string;
  purpose: string;
  character: string;
};

export default function NewBot(
  { user }: { user: User; },
) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const userId = user.id;
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    try {
      // Generate the bot image
      const botImageResponse = await fetch('/api/dalle3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: data.gender,
          purpose: data.purpose,
          character: data.character,
        }),
      });

      const botImageUrl = await botImageResponse.json();

      // Check if the image generation was successful
      if (botImageUrl.status === 'success') {
        const imageUrl = botImageUrl.imagePath;

        // Create the bot with the generated image URL
        const response = await fetch('/api/bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            userId,
            imageUrl,
          }),
        });

        const result = await response.json();
        if (result.status === 'success') {
          toast.success('Bot created successfully');
          router.push('/');
        }
        else {
          toast.error('Failed to create bot');
        }
      }
      else {
        toast.error('Failed to generate image');
      }
    }
    catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <Layout>
      <h1 className='text-center text-3xl font-extrabold text-gray-900 mb-8'>New Bot</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg'>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
          <select {...register('gender', { required: 'Gender is required' })} className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'>
            <option value=''>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          {errors.gender && <p className='text-red-500 text-xs mt-1'>{errors.gender.message}</p>}
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Purpose</label>
          <select {...register('purpose', { required: 'Purpose is required' })} className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'>
            <option value=''>Select Purpose</option>
            {purposeList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.purpose && <p className='text-red-500 text-xs mt-1'>{errors.purpose.message}</p>}
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Character</label>
          <select {...register('character', { required: 'Character is required' })} className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'>
            <option value=''>Select Character</option>
            {characterList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.character && <p className='text-red-500 text-xs mt-1'>{errors.character.message}</p>}
        </div>
        <button type='submit' className='w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>Create</button>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/signup',
        permanent: false,
      },
    };
  }

  const userData = await db.user.findUnique({
    where: {
      id: session.user.uid,
    },
  });

  if (!userData) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
  const user = JSON.parse(JSON.stringify(userData));

  return {
    props: {
      user,
    },
  };
};
