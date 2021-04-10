import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

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
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import { useHistory } from 'react-router';

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
}));

export default function Dash() {
  const history = useHistory();
  const classes = useStyles();

  /** @type {[{name: string, endpoint: string}[], Function]} */
  const [projects, setProjects] = React.useState([]);
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);

  const [nameHelperText, setNameHelperText] = React.useState('');
  const [endpointHelperText, setEndpointHelperText] = React.useState('');

  const formSubmit = (event) => {
    event.preventDefault();

    const newProject = {
      name: event.target.projectname.value,
      endpoint: event.target.endpoint.value
    };

    //TODO: Send request to create the endpoint
    setProjects([
      ...projects,
      newProject
    ]);

    setProjectModalOpen(false);
  }

  const fetchProjects = () => {
    setProjects([]);
  }

  React.useEffect(() => {
    console.log(`Use effect`);
    fetchProjects();
    setNameHelperText(`Cannot be blank.`);
  }, []);
  
  console.log(projects);

  return (
    <React.Fragment>
      {
        projects.length > 0
        ?
          <React.Fragment>
            <Typography variant="h4" component="h4" gutterBottom={true}>Projects</Typography>
            <div>
              <List>
                {projects.map(project => (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={project.name}
                      secondary={project.endpoint}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="start" aria-label="view">
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="create" onClick={() => {
                        history.push(`/projects/${project.name}/create`);
                      }}>
                        <AddCircleOutlineOutlinedIcon />
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
              <Typography variant="h3" component="h2" gutterBottom={true}>You have no projects!</Typography>
              <Typography variant="h5" color="textSecondary">A project is just a group of APIs that call your programs.</Typography>
              <Box mt={4}>
                <Button onClick={() => setProjectModalOpen(true)} variant="contained" size="large" color="primary">Create your first project</Button>
              </Box>
            </Box>
          </section>
      }

      <Modal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Create new project</h2>
          <p id="simple-modal-description">
            Congratulations! You're creating a project! A project is just a collection of APIs. Nice and easy.
          </p>
          <form noValidate onSubmit={formSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField 
                  variant="outlined" 
                  required fullWidth 
                  name="projectname" 
                  id="projectname" 
                  label="Project Name"
                  defaultValue=""
                  helperText={nameHelperText}
                  onChange={(event) => {
                    setNameHelperText(``);
                    const value = event.target.value.trim();

                    const exists = projects.find(project => project.name === value);

                    if (exists)
                      setNameHelperText(`Name in use.`)
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  variant="outlined" 
                  required fullWidth 
                  name="endpoint" 
                  id="endpoint" 
                  label="Endpoint" 
                  defaultValue=""
                  helperText={endpointHelperText}
                  onChange={(event) => {
                    setEndpointHelperText(``);
                    const value = event.target.value.trim();

                    if (!value.startsWith(`/`))
                      setEndpointHelperText(`Must start with a forward slash.`);

                    if (value.endsWith(`/`))
                      setEndpointHelperText(`Cannot end with a forward slash.`);
                  }}
                />
              </Grid>

            </Grid>
            <Box my={2}>
              <Button
               disabled={nameHelperText !== "" || endpointHelperText !== ""} type="submit" fullWidth variant="contained" color="primary">
                Create
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
}

