import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

import { useAuth } from '../App';

const tempData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const modalStyle = {
  top: `30%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  modalPaper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Index() {
  const history = useHistory();
  const classes = useStyles();
  let auth = useAuth();

  const [loading, setLoading] = React.useState(true);

  const [stats, setStats] = React.useState(null);

  const [status, setStatus] = React.useState({
    database: false,
    logging: false,
    loggingSchema: undefined
  });

  const [activeView, setActiveView] = React.useState(0);

  const [projectModalOpen, setProjectModalOpen] = React.useState(false);

  const fetchStatus = async () => {
    try {
      const data = await auth.send(`/lg/db/status`);

      setStatus(data);

      console.log(data);

      if (data.logging) {
        //Means we're all connected!

        await fetchLogs();
        console.log('changing view')
        setActiveView(2); //Render charts

      } else {
        if (data.connected) {
          //Means we're connected, but have not setup the logging stuff.
          setActiveView(1); 
        } else {
          //No database available.
          setActiveView(0);
        }
      }

      console.log('not loading')
      setLoading(false);

    } catch (e) {
      console.log(e);
      history.push(`/projects`);
    }
  }

  const setSchema = async (event) => {
    event.preventDefault();

    const schemaInfo = {
      schema: event.target.schema.value,
      createSchema: event.target.createSchema.checked
    };

    console.log(schemaInfo);

    if (schemaInfo.schema.trim() !== "") {
      setLoading(true);

      try {
        const data = await auth.send(`/lg/db/init`, schemaInfo);

        if (data.success) {
          setStatus({
            database: true,
            logging: true,
            loggingSchema: undefined
          });

          //FETCH STUFF FOR LOG STATS
          await fetchLogs();
          setActiveView(2); //Render charts

        } else {
          //TODO: errors
        }

      } catch (e) {
        console.log(e);
        //TODO: errors
      }

      setLoading(false);
    }
  }

  const fetchLogs = async () => {
    try {
      const data = await auth.send(`/lg/logs`);

      if (data.success) {
        console.log(data);
        setStats(data);
      } else {
        //TODO: errors
      }

    } catch (e) {
      console.log(e);
      //TODO: errors
    }
  }

  React.useEffect(() => {
    fetchStatus();
  }, [])

  return (
    loading 
    ?
      <React.Fragment></React.Fragment>
    :
      <section>
        <IsActive value={activeView} shouldBe={0}>
          {/* No database connected!! */}
          <Box py={8} textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom={true}>Database is not connected!</Typography>
            <Typography variant="h5" color="textSecondary">This page is no use if you haven't got a database connected. You can't do that through the UI. You need to configure that in the data.json file and then restart LogicgooseUI.</Typography>
          </Box>
        </IsActive>

        <IsActive value={activeView} shouldBe={1}>
          {/* No database connected!! */}
          <Box py={8} textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom={true}>Logging not setup.</Typography>
            <Typography variant="h5" color="textSecondary">Interested in collecting stats for your APIs? We can set that up for you right now!</Typography>
            <Box mt={3}>
              <Button onClick={() => setProjectModalOpen(true)} variant="contained" size="large" color="primary">Setup</Button>
            </Box>

            <Modal
              open={projectModalOpen}
              onClose={() => setProjectModalOpen(false)}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={modalStyle} className={classes.modalPaper}>
                <h2 id="simple-modal-title">Setting up the LogicgooseUI Schema</h2>
                <p id="simple-modal-description">
                  You are moment away from logging information from your API requests. Are you ready? We just need to know what schema we can use to create tables for logs and eventually some other things.
                </p>
                <form noValidate onSubmit={setSchema}>
                  <Grid container spacing={2}>

                    <Grid item xs={12}>
                      <TextField 
                        variant="outlined" 
                        required fullWidth 
                        name="schema" 
                        id="schema" 
                        label="Schema name"
                        defaultValue=""
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormControlLabel
                          control={<Switch name="createSchema" />}
                          label="Create schema"
                        />
                      </FormControl>
                    </Grid>

                  </Grid>
                  <Box my={2}>
                    <Button type="submit" fullWidth variant="contained" color="primary">
                      Setup
                    </Button>
                  </Box>
                </form>
              </div>
            </Modal>
          </Box>
        </IsActive>

        <IsActive value={activeView} shouldBe={2}>
          {
            stats
            ?
              <Container maxWidth="lg">
                <Grid container spacing={3}>

                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <Typography variant="h5" gutterBottom>API Totals</Typography>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <RadialBarChart 
                          innerRadius="20%" 
                          outerRadius="80%" 
                          data={[{name: "total", count: stats.base.total, fill: "grey"}, {name: "succesful", count: stats.base.successful, fill: "#32a86f"}, {name: "errored", count: stats.base.errored, fill: "#a83246"}]} 
                          startAngle={0} 
                          endAngle={360}
                        >
                          <RadialBar label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='count' />
                          <Legend iconSize={10} width={120} height={140} layout='centric' verticalAlign='top' align="center" />
                          <Tooltip />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <Typography variant="h5" gutterBottom>APIs by day</Typography>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart
                          data={stats.successfulCountByDays.map(api => ({name: api.date, amt: api.count, count: api.count, "average response time": api.average_response_time}))}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#32a86f" />
                          <Bar dataKey="average response time" fill="#c9960a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <Typography variant="h5" gutterBottom>Most successful</Typography>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart
                          data={stats.successfulAPIs.map(api => ({name: `${api.method} ${api.baseURL}`, amt: api.count, successful: api.count, avg: api.average_response_time}))}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="successful" fill="#32a86f" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <Typography variant="h5" gutterBottom>Most errors</Typography>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart
                          data={stats.erroringAPIs.map(api => ({name: `${api.method} ${api.baseURL}`, amt: api.count, errors: api.count}))}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="errors" fill="#a83246" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            :
              <React.Fragment></React.Fragment>
          }
        </IsActive>
      </section>
  );
}

function IsActive({children, value, shouldBe}) {
  return (
    value === shouldBe ? children : <React.Fragment />
  );
}