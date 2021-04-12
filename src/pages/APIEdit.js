import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useAuth } from '../App';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  backButton: {
    marginBottom: '0.1em'
  },
  cancelButton: {
    marginRight: '1em'
  },
  centerBox: {
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

function reducer(state, action) {
  return {
    ...state,
    ...action
  };
}

export default function Index() {
  const history = useHistory();
  const classes = useStyles();
  let { project, api } = useParams();
  let auth = useAuth();

  //TODO: loading state
  const [loading, setLoading] = React.useState(true);

  const [errors, dispatchError] = React.useReducer(reducer, {});
  const [fields, dispatch] = React.useReducer(reducer, {
    description: '',
    endpoint: '/',
    enabled: true,
  });

  const fetchAPI = async () => {
    try {
      const data = await auth.send(`/lg/projects/${project}/${api}`);

      if (data.success) {
        dispatch({
          description: data.description,
          endpoint: data.endpoint,
          enabled: data.enabled
        });
        setLoading(false);
      } else {
        console.log(data);
        history.push(`/projects/${project}`);
      }

    } catch (e) {
      console.log(e);
      history.push(`/projects/${project}`);
    }
  }

  const updateData = async () => {
    try {
      const data = await auth.send(`/lg/projects/${project}/${api}/edit`, fields);

      if (data.success) {
        history.push(`/projects/${project}`);
      } else {
        //TODO: errors
      }

    } catch (e) {
      console.log(e);
      //TODO: errors
    }
  }

  React.useEffect(() => {
    fetchAPI();
  }, [])

  return (
    loading 
    ?
      <React.Fragment></React.Fragment>
    :
      <section>
        <Container maxWidth="md">
          <div className={classes.root}>


            <Typography variant="h5" component="h5" gutterBottom={true}>
              <IconButton className={classes.backButton} onClick={() => history.push(`/projects/${project}`)}>
                <ArrowBackIcon />
              </IconButton>
              {api} API
            </Typography>

            <Paper className={classes.paper}>
              <Box mt={3} />

              <Box px={10}>
                <TextField 
                  fullWidth
                  label="Description"
                  name="description"
                  value={fields.description}
                  onChange={(event) => {
                    dispatch({[event.target.name]: event.target.value});
                  }}
                />

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="Endpoint"
                  name="endpoint"
                  value={fields.endpoint}

                  helperText={errors.endpoint}
                  error={errors.endpoint !== undefined}

                  onChange={(event) => {
                    let value = event.target.value;
                    dispatchError({[event.target.name]: undefined});

                    if (value.length > 1 && value.endsWith("/")) value = value.substr(0, value.length-1);
                    if (!value.startsWith("/")) {
                      dispatchError({[event.target.name]: `Endpoint must start with a /`});
                    }

                    dispatch({[event.target.name]: value});
                  }}
                  
                />

                <Box mt={3} />

                <FormControl component="fieldset">
                  <FormControlLabel
                    control={<Switch checked={fields.enabled} name="enabled" onChange={(event) => {
                      dispatch({[event.target.name]: event.target.checked});
                    }}/>}
                    label="API enabled"
                  />
                </FormControl>

                <Box mt={3} />

                <Box className={classes.centerBox}>
                  <Button
                    className={classes.cancelButton}
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </Button>

                  <Button disabled={Object.values(errors).find(error => error !== undefined)} variant="contained" color="primary" onClick={updateData}>
                    Finish
                  </Button>
                </Box>

                <Box mt={3} />

                <Typography variant="h5" gutterBottom>
                  Why can't I edit more?
                </Typography>

                <Typography className={classes.instructions}>You may be wondering why you cannot edit more information, like the input and output bodies. We don't want to risk you breaking your API, so we only let you change details that would not affect the underlaying code. If you want to make changes, it likely means you need to make a new version.</Typography>

                <Box mt={3} />

              </Box>
            </Paper>
          </div>
        </Container>
      </section>
  );
}