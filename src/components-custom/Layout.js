import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';
import AppsIcon from '@material-ui/icons/Apps';

import { useAuth } from '../App';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      display: 'inline-flex',
    }
  },
  linkBrand: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  },
  linkBrandSmall: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
    }
  },
  drawer: {
    width: 256,
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    }
  },
  drawerContainer: {
    width: 266,
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}
));

export default function Component(props) {
  let auth = useAuth();
  const classes = useStyles();

  const [state, setState] = React.useState({ open: false });

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, open });
  };

  console.log(useAuth);

  return (
<div className={classes.root}>
  <AppBar position="fixed" className={classes.appBar}>
    <Toolbar>
      <IconButton disabled={auth.user === null} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Link href="#" variant="h5" color="inherit" underline="none" className={classes.linkBrand}>
        Logicgoose UI
      </Link>
      <Link href="#" variant="h5" color="inherit" underline="none" className={classes.linkBrandSmall}>
        Logicgoose UI
      </Link>
    </Toolbar>
  </AppBar>
  <Drawer anchor="left" open={state.open} onClose={toggleDrawer(false)}>
    <div className={classes.drawerContainer}>
      <List>
        <ListItem button key="Projects">
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
      </List>
    </div>
  </Drawer>
  <main className={classes.content}>
    <Toolbar />
    <Container maxWidth="lg">
      {props.children}
    </Container>
  </main>
</div>
  );
}