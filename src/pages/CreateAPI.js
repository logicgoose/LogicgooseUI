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

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

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
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

function getSteps() {
  return [`Information`, `Input JSON`, `Output JSON`, `Paths`, `Confirmation`];
}

export default function CreateAPI() {
  const history = useHistory();
  let { project } = useParams();

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    if ((activeStep + 1) === steps.length) {
      history.push(`/projects/${project}`);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
            <Switch value={activeStep} shouldBe={0}>
              <Typography className={classes.instructions}>The first step!! Project: {project}</Typography>
            </Switch>


            <Switch value={activeStep} shouldBe={1}>
              <Typography className={classes.instructions}>The second step!!</Typography>
            </Switch>


            <Switch value={activeStep} shouldBe={2}>
              <Typography className={classes.instructions}>The third step!!</Typography>
            </Switch>


            <Switch value={activeStep} shouldBe={3}>
              <Typography className={classes.instructions}>The fourth step!!</Typography>
            </Switch>


            <Switch value={activeStep} shouldBe={4}>
              <Typography className={classes.instructions}>The fifth step!!</Typography>
            </Switch>

            <Box className={classes.centerBox}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Paper>
        )}
      </div>
    </Container>
  );
}

function Switch({children, value, shouldBe}) {
  return (
    value === shouldBe ? children : <React.Fragment />
  );
}