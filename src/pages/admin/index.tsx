import { db } from '@/lib/prisma';
import { AdminLayout } from '@/pages/layout/admin-layout';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Users({ users }: { users: User[]; }) {
  return (
    <AdminLayout>
      <Typography variant='h4' component='h1' gutterBottom>
        Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Google ID</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.googleId}</TableCell>
              <TableCell>{user.gender || 'N/A'}</TableCell>
              <TableCell>{user.role || 'N/A'}</TableCell>
              <TableCell>
                <Link href={`/admin/${user.id}`} passHref>
                  <Button variant='contained' color='primary'>
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
        destination: '/ ',
        permanent: false,
      },
    };
  }

  const users = await db.user.findMany();
  return {
    props: { users },
  };
};
