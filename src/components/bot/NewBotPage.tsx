
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const bull = (
  <Box
    component='span'
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function NewBotPage() {
  return (
    <Card sx={{ maxWidth: 'lg', minWidth: '50%' }}>
      <CardContent>
        <Typography variant='h2' component='div' sx={{ width: '60%' }}>
          Friend Profile
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
        <Typography variant='body2'>
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        BasicCard
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
}