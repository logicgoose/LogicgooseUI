import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { green, pink } from '@material-ui/core/colors';

import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import { useAuth } from '../App';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

const modalStyle = {
  top: `30%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
}));

export default function Dash() {
  const history = useHistory();
  const classes = useStyles();
  let auth = useAuth();

  let { project } = useParams();

  /** @type {[{name: string, description: string, endpoint: string, method: string, enabled: boolean}[], Function]} */
  const [APIs, setAPIs] = React.useState([]);

  const fetchAPIs = async () => {
    const result = await auth.send(`/lg/projects/${project}`);
    setAPIs(result);
  }

  React.useEffect(() => {
    fetchAPIs();
  }, []);

  return (
    <React.Fragment>
      {
        APIs.length > 0
        ?
          <React.Fragment>
            <Typography variant="h4" component="h4" gutterBottom={true}>Projects</Typography>
            <div>
              <List>
                {APIs.map(api => (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className={api.enabled ? classes.green : classes.pink}>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={api.name}
                      secondary={`${api.description} - ${api.method.toUpperCase()} ${api.endpoint}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="start" aria-label="view">
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          </React.Fragment>
        :
          <section>
            <Box py={8} textAlign="center">
              <Typography variant="h3" component="h2" gutterBottom={true}>You have no APIs!</Typography>
              <Typography variant="h5" color="textSecondary">An API is an endpoint that can be called, which really just calls an ILE program.</Typography>
            </Box>
          </section>
      }

      <Box textAlign="center">
        <Box mt={2}>
          <Button onClick={() => history.push(`/projects/${project}/create`)} variant="contained" size="large" color="primary">Create an API</Button>
        </Box>
      </Box>
    </React.Fragment>
  );
}

