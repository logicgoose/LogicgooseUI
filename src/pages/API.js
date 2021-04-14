import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

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
    color: theme.palette.text.secondary,
  },
  backButton: {
    marginBottom: '0.1em'
  },
  code: {
    fontSize: '1.2em',
    marginRight: '1em',
    whiteSpace: 'pre-wrap'
  }
}));

export default function Index() {
  const history = useHistory();
  const classes = useStyles();
  let { project, api } = useParams();
  let auth = useAuth();

  //TODO: loading state
  const [loading, setLoading] = React.useState(true);
  const [currentAPI, setCurrentAPI] = React.useState({});

  const fetchAPI = async () => {
    try {
      const data = await auth.send(`/lg/projects/${project}/${api}`);

      if (data.success) {
        setCurrentAPI(data);
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

  React.useEffect(() => {
    fetchAPI();
  }, [])

  return (
    loading 
    ?
      <React.Fragment></React.Fragment>
    :
      <section>
        <Container maxWidth="lg">
          <div className={classes.root}>

            <Typography variant="h5" component="h5" gutterBottom={true}>
              <IconButton className={classes.backButton} onClick={() => history.push(`/projects/${project}`)}>
                <ArrowBackIcon />
              </IconButton>
              {api} API
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <List>
                    <ConfirmListItem left="API Name" right={currentAPI.name} />
                    <ConfirmListItem left="Description" right={currentAPI.description} />
                    <ConfirmListItem left="Endpoint" right={currentAPI.endpoint} />
                    <ConfirmListItem left="Method type" right={currentAPI.method} />
                    <ConfirmListItem left="Currently enabled" right={currentAPI.enabled ? "Yes" : "No"} />
                    <ConfirmListItem left="Stored procedure path" right={currentAPI.procedure} />
                    <ConfirmListItem left="Program path" right={currentAPI.programPath} />
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <pre className={classes.code}>
                    {currentAPI.rpgle}
                  </pre>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <pre className={classes.code}>
                    {currentAPI.sql}
                  </pre>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Container>
      </section>
  );
}


function ConfirmListItem({left, right}) {
  return (
    <React.Fragment>
      <ListItem>
        <ListItemText
          primary={left}
        />

        <ListItemSecondaryAction>
          <ListItemText primary={right} />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </React.Fragment>
  )
}