import React from 'react';

import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { useAuth } from '../App';
import JSONStruct from '../components-custom/JSONStruct';

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  },
  centerBox: {
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

function getSteps() {
  return [`Information`, `Input JSON`, `Output JSON`, `Paths`, `Confirmation`];
}

function reducer(state, action) {
  return {
    ...state,
    ...action
  };
}

export default function CreateAPI() {
  const history = useHistory();
  let { project } = useParams();
  let auth = useAuth();

  const classes = useStyles();
  const steps = getSteps();

  const [fields, dispatch] = React.useReducer(reducer, {
    name: '',
    description: '',
    endpoint: '/',
    method: 'GET',
    enabled: true,
    inputBody: '{}',
    outputBody: '{}',
    schema: '',
    procedure: '',
    library: '',
    program: ''
  });

  const [errors, dispatchError] = React.useReducer(reducer, {});

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {
    if ((activeStep + 1) === steps.length) {

      try {
        const result = await auth.send(`/lg/projects/${project}/api/create`, fields);

        if (result.success) {
          history.push(`/projects/${project}/${fields.name}`);
        } else {
          console.log(result);
        }

      } catch (e) {
        console.log(e);
      }

      setActiveStep((prevActiveStep) => 4);

    } else {

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    dispatch({[event.target.name]: value});
  };

  return (
    <Container maxWidth="md">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            {/* <Button onClick={handleReset}>Reset</Button> */}
          </div>
        ) : (
          <Paper className={classes.paper}>
            <Box px={10}>

              <IsActive value={activeStep} shouldBe={0}>
                <Typography className={classes.instructions}>You're creating a new API for {project} - awesome. Let's get these details filled out.</Typography>

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="API Name"
                  name="name"
                  value={fields.name}
                  
                  helperText={errors.name}
                  error={errors.name !== undefined}

                  onChange={(event) => {
                    let value = event.target.value;

                    value = value.toLowerCase();
                    value = value.replace(new RegExp(` `, `g`), `-`);

                    dispatchError({[event.target.name]: (value.trim() === "" ? `Name cannot be blank.` : undefined)});

                    dispatch({[event.target.name]: value});
                  }}
                />

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="Description"
                  name="description"
                  value={fields.description}
                  onChange={handleChange}
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

                <FormControl fullWidth>
                  <InputLabel id="method-text">HTTP Method</InputLabel>
                  <Select
                    name="method"
                    value={fields.method}
                    onChange={handleChange}
                  >
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                  </Select>
                </FormControl>

                <Box mt={3} />

                <FormControl component="fieldset">
                  <FormControlLabel
                    control={<Switch checked={fields.enabled} onChange={handleChange} name="enabled" />}
                    label="API enabled"
                  />
                </FormControl>
              </IsActive>


              <IsActive value={activeStep} shouldBe={1}>
                {
                  fields.method === "GET" 
                  ?
                    <Typography className={classes.instructions}>Since this API is a GET request, you don't get an input body - so you get to skip this part. The real fun is in the next step, for you!</Typography>
                  :
                  <React.Fragment>
                    <Typography className={classes.instructions}>Now for the first fun part, defining your API! Just enter what you want the JSON body to look like, and we'll do the REST (get it?). Pro tip: to control the size of the resulting RPG fields for strings and numbers, you can enter in their size. E.g. <code>"50"</code> becomes <code>Char(50)</code> and <code>11.2</code> becomes <code>Zoned(11:2)</code></Typography>

                    <Box mt={3} />

                    <JSONStruct 
                      name="inputBody"
                      label="Input JSON"
                      value={fields.inputBody}
                      onChange={handleChange}
                    />
                  </React.Fragment>
                }


              </IsActive>

              <IsActive value={activeStep} shouldBe={2}>
                <Typography className={classes.instructions}>Now for the what you expect the JSON output to be like.</Typography>

                <Box mt={3} />

                <JSONStruct 
                  name="outputBody"
                  label="Output JSON"
                  value={fields.outputBody}
                  onChange={handleChange}
                />
              </IsActive>

              <IsActive value={activeStep} shouldBe={3}>
                <Typography className={classes.instructions}>Wow, you are making some great progress on this new API! In fact, you're almost done! We just need these last details from you. Remember that the stored procedure and programs cannot be changed unless the API is created again - make sure you get this part right!</Typography>

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="Schema (for the Stored Procedure)"
                  name="schema"
                  value={fields.schema}
                  onChange={handleChange}
                />

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="Stored Procedure name"
                  name="procedure"
                  value={fields.procedure}
                  onChange={handleChange}
                />

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="Library (for Program)"
                  name="library"
                  value={fields.library}

                  helperText={errors.library}
                  error={errors.library !== undefined}

                  onChange={(event) => {
                    let value = event.target.value;

                    if (value.length > 10) {
                      value = value.substr(0, 10)
                    } else
                    if (value.trim() === "") {
                      dispatchError({[event.target.name]: `Library cannot be blank.`});
                    } else {
                      dispatchError({[event.target.name]: undefined});
                    }

                    dispatch({[event.target.name]: value});
                  }}
                />

                <Box mt={3} />

                <TextField 
                  fullWidth
                  label="Program name"
                  name="program"
                  value={fields.program}

                  helperText={errors.program}
                  error={errors.program !== undefined}

                  onChange={(event) => {
                    let value = event.target.value;

                    if (value.length > 10) {
                      value = value.substr(0, 10)
                    } else
                    if (value.trim() === "") {
                      dispatchError({[event.target.name]: `Name cannot be blank.`});
                    } else {
                      dispatchError({[event.target.name]: undefined});
                    }

                    dispatch({[event.target.name]: value});
                  }}
                />
              </IsActive>

              <IsActive value={activeStep} shouldBe={4}>
                <Typography className={classes.instructions}>Last but not least.. checking it all looks right! Remember, you can't change much of this later - make sure it's correct now.</Typography>

                <List>
                  <ConfirmListItem left="API Name" right={fields.name} />
                  <ConfirmListItem left="Description" right={fields.description} />
                  <ConfirmListItem left="Endpoint" right={fields.endpoint} />
                  <ConfirmListItem left="Method type" right={fields.method} />
                  <ConfirmListItem left="Initially enabled" right={fields.enabled ? "Yes" : "No"} />
                  <ConfirmListItem left="Stored procedure path" right={`${fields.schema}.${fields.procedure}`} />
                  <ConfirmListItem left="Program path" right={`${fields.library}.${fields.program}`} />
                </List>

                <Box mt={3} />

                <Typography variant="h5" gutterBottom>
                  What's next?
                </Typography>

                <Typography className={classes.instructions}>After you have finished this process you will need to create the stored procedure and program yourself - but we've done all the work for you! When you view an API, you will see the base source and stored procedure code.</Typography>
              </IsActive>

              <Box className={classes.centerBox}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                
                {
                  activeStep === steps.length - 1 
                  ? 
                  <Button disabled={Object.values(errors).find(error => error !== undefined)} variant="contained" color="primary" onClick={handleNext}>
                    Finish
                  </Button>
                  : 
                  <Button variant="contained" color="primary" onClick={handleNext}>
                    Next
                  </Button>
                }
                

              </Box>
            </Box>
          </Paper>
        )}
      </div>
    </Container>
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

function IsActive({children, value, shouldBe}) {
  return (
    value === shouldBe ? children : <React.Fragment />
  );
}