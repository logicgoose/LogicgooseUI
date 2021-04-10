import React from 'react';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useAuth } from '../App';

export default function Index() {
  const history = useHistory();
  let auth = useAuth();

  const formSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: event.target.username.value,
      password: event.target.password.value
    };

    auth.signin(data, (success) => {
      if (success) {
        history.push(`/projects`);
      } else {
        //TODO......
      }
    })
  }

  return (
    <section>
      <Container maxWidth="xs">
        <Box pt={8} pb={10}>
          <Box mb={3} textAlign="center">
            <Link href="#" variant="h4" color="inherit" underline="none">
              <img height="80px" src="images/no-color.png" />
            </Link>
            <Typography variant="h5" component="h2">Sign in</Typography>
          </Box>
          <Box>
            <form noValidate onSubmit={formSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField variant="outlined" required fullWidth name="username" id="username" label="Username" />
                </Grid>
                <Grid item xs={12}>
                  <TextField variant="outlined" required fullWidth name="password" id="password" label="Password" type="password" />
                </Grid>
              </Grid>
              <Box my={2}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Sign in
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </section>
  );
}

