import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

import ReactMarkdown from 'react-markdown'

//Doc pages
import Homepage from './docs/homepage';
import creatingAPIs from './docs/creatingAPIs';
import SecuringAPIs from './docs/securingAPIs';

const pages = [
  {
    title: "Homepage",
    content: Homepage
  },
  {
    title: "Creating APIs",
    content: creatingAPIs
  },
  {
    title: "Securing APIs",
    content: SecuringAPIs
  }
];

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    //flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0, 30, 0, 10),
  },

  code: {
    fontSize: '1.2em',
    padding: theme.spacing(1, 1, 1, 1),
    whiteSpace: 'pre-wrap',
    backgroundColor: '#dce6df'
  }
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = React.useState(0);

  const renderers = {
    code: ({language, value}) => {
      return <pre className={classes.code}>{value}</pre>
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {pages.map((page, index) => (
            <ListItem button key={page.title} onClick={() => {setCurrentPage(index)}}>
              <ListItemIcon><InsertDriveFileOutlinedIcon /></ListItemIcon>
              <ListItemText primary={page.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <ReactMarkdown renderers={renderers} children={pages[currentPage].content} />
      </main>
    </div>
  );
}
