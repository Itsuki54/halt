import {
  AppBar,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

export default function AdminLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div'>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <main>{children}</main>
      </Container>
    </div>
  );
}
