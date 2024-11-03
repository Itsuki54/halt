import { db } from '@/lib/prisma';
import AdminLayout from '@/pages/layout/admin-layout';
import {
  Female,
  Male,
  Work,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]';

export default function UserList({ users }: { users: User[]; }) {
  return (
    <AdminLayout>
      <Typography variant='h4' component='h1' gutterBottom>
        ユーザーリスト
      </Typography>
      <Grid container spacing={4}>
        {users.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: user.gender === 'male' ? 'blue' : 'pink' }}>
                      {user.gender === 'male' ? <Male /> : <Female />}
                    </Avatar>
                  }
                  title={user.googleId}
                  subheader={`役割: ${user.role || 'N/A'}`}
                  action={
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'secondary' : 'default'}
                      icon={<Work />}
                    />
                  }
                />
                <CardContent>
                  <Typography variant='body1'>
                    <strong>性別:</strong> {user.gender || 'N/A'}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>年齢:</strong> {user.age || 'N/A'}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>職業:</strong> {user.job || 'N/A'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href={`/admin/${user.id}`} passHref>
                    <Button variant='contained' color='primary'>
                      詳細を見る
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userData = await db.user.findUnique({
    where: {
      id: session.user.uid,
    },
  });
  const user = JSON.parse(JSON.stringify(userData));
  if (!session || !session.user || user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const users = await db.user.findMany();
  return {
    props: { users },
  };
};
