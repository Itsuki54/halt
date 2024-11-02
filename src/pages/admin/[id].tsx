import { db } from '@/lib/prisma';
import AdminLayout from '@/pages/layout/admin-layout';
import {
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
        User Details - {user.googleId}
      </Typography>

      <Typography variant='h6' component='h2'>
        Personal Info
      </Typography>
      <p>Gender: {user.gender || 'N/A'}</p>
      <p>Role: {user.role || 'N/A'}</p>
      <p>Age: {user.age || 'N/A'}</p>
      <p>Job: {user.job || 'N/A'}</p>

      <Typography variant='h6' component='h2' gutterBottom>
        Bots
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
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

      <Typography variant='h6' component='h2' gutterBottom>
        Groups
      </Typography>
      {user.groups.map(group => (
        <div key={group.id}>
          <Typography variant='subtitle1'>{group.name}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Log ID</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Response</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.response}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
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
        destination: '/ ',
        permanent: false,
      },
    };
  }
  const { id } = ctx.params as { id: string; };

  const user = await db.user.findUnique({
    where: { id: id },
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
