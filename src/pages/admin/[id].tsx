import { db } from '@/lib/prisma';
import AdminLayout from '@/pages/layout/admin-layout';
import {
  Female,
  Group as GroupIcon,
  Male,
  Work,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

type User = {
  id: number;
  googleId: string;
  gender: string;
  role: string;
  age: string;
  job: string;
  bots: { id: number; type: string; }[];
  groups: {
    id: number;
    name: string;
    logs: { id: number; message: string; response: string; createdAt: Date; }[];
  }[];
};

export default function UserDetails({ user }: { user: User; }) {
  return (
    <AdminLayout>
      <Typography variant='h4' component='h1' gutterBottom>
        ユーザー詳細 - {user.googleId}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: user.gender === 'male' ? 'blue' : 'pink' }}>
                  {user.gender === 'male' ? <Male /> : <Female />}
                </Avatar>
              }
              title='個人情報'
              subheader={`役割: ${user.role}`}
              action={<Chip label={user.role} icon={<Work />} color='primary' />}
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
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardHeader
              title='ボット'
              subheader={`${user.bots.length} ボット`}
              avatar={<GroupIcon />}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>タイプ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.bots.map(bot => (
                  <TableRow key={bot.id}>
                    <TableCell>{bot.id}</TableCell>
                    <TableCell>{bot.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
        {user.groups.map(group => (
          <Grid item xs={12} key={group.id}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant='h6' gutterBottom>
                グループ: {group.name}
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ログID</TableCell>
                      <TableCell>メッセージ</TableCell>
                      <TableCell>レスポンス</TableCell>
                      <TableCell>作成日時</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.logs.map(log => (
                      <TableRow key={log.id} sx={{ backgroundColor: '#f9f9f9' }}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.response}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userData = JSON.parse(JSON.stringify(
    await db.user.findUnique({
      where: {
        id: session.user.uid,
      },
    }),
  ));

  if (!session || !session.user || userData.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const { id } = ctx.params as { id: string; };

  const user = await db.user.findUnique({
    where: { id },
    include: {
      bots: true,
      groups: {
        include: {
          logs: true,
        },
      },
    },
  });

  return {
    props: { user },
  };
};
