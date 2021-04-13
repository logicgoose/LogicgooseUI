import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { CopyBlock, github } from "react-code-blocks";

import ReactMarkdown from 'react-markdown'

//Doc pages
import Homepage from './docs/homepage';
import SecuringAPIs from './docs/securingAPIs';

const pages = [
  {
    title: "Homepage",
    content: Homepage
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
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
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
}));

const renderers = {
  code: ({language, value}) => {
    return <CopyBlock text={value} language={language} theme={github} wrapLines />
  }
}

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = React.useState(0);

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
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
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
