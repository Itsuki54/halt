import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Typography, TextField, Button } from '@mui/material';
import Layout from '@/pages/layout';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

type FormInputs = {
  name: string;
  email: string;
  message: string;
};

const ContactPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormInputs>();

  // セッションがない場合、ログインページにリダイレクト
  useEffect(() => {
    if (!session) {
      router.push('/');
    } else {
      // セッションがあれば、ユーザー情報でデフォルト値を設定
      setValue('name', session.user?.name || '');
      setValue('email', session.user?.email || '');
    }
  }, [session, router, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('お問い合わせ内容を送信しました');
        reset();
      } else {
        toast.error('お問い合わせの送信に失敗しました');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" /> {/* トースト表示用 */}
      <Container className="flex justify-center items-center h-screen">
        <div className="flex flex-col w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-6">
          <Typography variant="h4" className="text-center font-bold" gutterBottom>
            お問い合わせ
          </Typography>
          <Typography variant="body1" className="text-center text-gray-700" paragraph>
            以下のフォームに必要事項をご入力の上、送信ボタンを押してください。
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <TextField
              label="お名前"
              variant="outlined"
              fullWidth
              {...register('name', { required: 'お名前を入力してください' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="メールアドレス"
              variant="outlined"
              fullWidth
              type="email"
              {...register('email', {
                required: 'メールアドレスを入力してください',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: '有効なメールアドレスを入力してください',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="メッセージ"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              {...register('message', { required: 'メッセージを入力してください' })}
              error={!!errors.message}
              helperText={errors.message?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              送信
            </Button>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default ContactPage;
