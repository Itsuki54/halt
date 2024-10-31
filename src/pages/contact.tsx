import { authOptions } from './api/auth/[...nextauth]';
import { db } from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import {
  init,
  send,
} from '@emailjs/browser';

import Layout from '@/pages/layout';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {
  toast,
  Toaster,
} from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: '2文字で入力してください' }).max(50),
  email: z.string().email({ message: 'メールアドレスの形式ではありません' }),
  category: z.string().min(1, { message: 'カテゴリを選択してください' }),
  content: z.string().min(1, { message: 'お問い合わせ内容をお書きください。' }),
});

type FormType = z.infer<typeof formSchema>;

const Contact = () => {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      content: '',
    },
  });

  const onSubmit: SubmitHandler<FormType> = async data => {
    const { name, email, category, content } = data;

    try {
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

      if (userId && serviceId && templateId) {
        setIsSending(true);
        const loadingToast = toast.loading('送信中...');

        init(userId);

        const params = {
          name,
          email,
          category,
          content,
        };
        await send(serviceId, templateId, params);
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        toast.success('送信が成功しました。');
        form.reset();
        toast.dismiss(loadingToast);
      }
    }
    catch (error) {
      console.error('Error sending message:', error);
      toast.error('データベース保存または送信に失敗しました。');
    }
    finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <Toaster />
      <Container className="flex justify-center items-center h-screen">
        <div className="flex flex-col w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-6 justify-center items-center">
          <Typography variant='h4' component='h1' gutterBottom>
            お問い合わせ
          </Typography>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <TextField
              label='名前'
              fullWidth
              margin='normal'
              {...form.register('name')}
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message}
              disabled={isSending}
            />
            <TextField
              label='メールアドレス'
              fullWidth
              margin='normal'
              {...form.register('email')}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
              disabled={isSending}
            />
            <TextField
              label='カテゴリ'
              fullWidth
              margin='normal'
              {...form.register('category')}
              error={!!form.formState.errors.category}
              helperText={form.formState.errors.category?.message}
              disabled={isSending}
            />
            <TextField
              label='お問い合わせ内容'
              fullWidth
              margin='normal'
              multiline
              rows={4}
              {...form.register('content')}
              error={!!form.formState.errors.content}
              helperText={form.formState.errors.content?.message}
              disabled={isSending}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={isSending}
                startIcon={isSending && <CircularProgress size={20} />}
              >
                {isSending ? '送信中...' : '送信'}
              </Button>
            </Box>
          </form>
        </div>
      </Container>
    </Layout >
  );
};

export default Contact;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};