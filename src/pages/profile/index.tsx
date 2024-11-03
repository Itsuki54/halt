import LoginRequired from '@/components/auth/LoginRequired';
import Layout from '@/pages/layout';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { authOptions } from '../api/auth/[...nextauth]';

import { occupations } from '@/data/occupations'; // 職種リストをインポート
import { db } from '@/lib/prisma';
import { User } from '@prisma/client';

type FormInputs = {
  name: string;
  gender: string;
  ageGroup: string;
  occupation: string;
};

interface Props {
  user: User;
}

function UserInfoPage({ user }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormInputs>();

  // ユーザーがログインしていない場合、LoginRequired を表示
  if (!user) {
    return <LoginRequired />;
  }

  const onSubmit: SubmitHandler<FormInputs> = async data => {
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.id,
          googleId: user.googleId,
          gender:data.gender,
          age: data.ageGroup,
          job:data.occupation,
        }),
      });

      if (response.ok) {
        toast.success('ユーザー情報を保存しました');
        reset();
      }
      else {
        toast.error('情報の保存に失敗しました');
      }
    }
    catch (error) {
      toast.error('エラーが発生しました');
      console.error('Error submitting user info form:', error);
    }
  };

  return (
    <Layout>
      <Toaster position='top-right' /> {/* トースト表示用 */}
      <Container className='flex justify-center items-center h-screen'>
        <div className='flex flex-col w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-6'>
          <Typography variant='h4' className='text-center font-bold' gutterBottom>
            ユーザー情報入力
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
            <TextField
              label='お名前'
              variant='outlined'
              fullWidth
              {...register('name', { required: 'お名前を入力してください' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* 性別選択 */}
            <FormControl fullWidth variant='outlined' error={!!errors.gender}>
              <InputLabel id='gender-label'>性別</InputLabel>
              <Select
                labelId='gender-label'
                label='性別'
                {...register('gender', { required: '性別を選択してください' })}
                defaultValue=''
              >
                <MenuItem value='male'>男性</MenuItem>
                <MenuItem value='female'>女性</MenuItem>
                <MenuItem value='other'>その他</MenuItem>
              </Select>
              {errors.gender && <Typography color='error'>{errors.gender.message}</Typography>}
            </FormControl>

            {/* 年代選択 */}
            <FormControl fullWidth variant='outlined' error={!!errors.ageGroup}>
              <InputLabel id='ageGroup-label'>年代</InputLabel>
              <Select
                labelId='ageGroup-label'
                label='年代'
                {...register('ageGroup', { required: '年代を選択してください' })}
                defaultValue=''
              >
                <MenuItem value='20s'>20代</MenuItem>
                <MenuItem value='30s'>30代</MenuItem>
                <MenuItem value='40s'>40代</MenuItem>
                <MenuItem value='50s'>50代</MenuItem>
                <MenuItem value='60s'>60代以上</MenuItem>
              </Select>
              {errors.ageGroup && <Typography color='error'>{errors.ageGroup.message}</Typography>}
            </FormControl>

            {/* 職種選択 */}
            <FormControl fullWidth variant='outlined' error={!!errors.occupation}>
              <InputLabel id='occupation-label'>職種</InputLabel>
              <Select
                labelId='occupation-label'
                label='職種'
                {...register('occupation', { required: '職種を選択してください' })}
                defaultValue=''
              >
                {occupations.map(occupation => (
                  <MenuItem key={occupation.value} value={occupation.value}>
                    {occupation.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.occupation && <Typography color='error'>{errors.occupation.message}</Typography>}
            </FormControl>

            <Button
              type='submit'
              variant='contained'
              color='primary'
              className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200'
            >
              保存
            </Button>
          </form>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session || !session.user) {
    return { props: { user: null } };
  }

  const userData = await db.user.findUnique({ where: { id: session.user.uid } });

  return {
    props: {
      user: userData ? JSON.parse(JSON.stringify(userData)) : null,
    },
  };
};

export default UserInfoPage;
