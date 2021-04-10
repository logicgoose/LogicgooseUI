import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    "palette": {
        "type": "light",
        "background": {
            "default": "#fafafa",
            "paper": "#fff"
        },
        "divider": "rgba(0, 0, 0, 0.12)",
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)"
        },
        "action": {
            "active": "rgba(0, 0, 0, 0.54)",
            "hover": "rgba(0, 0, 0, 0.04)",
            "selected": "rgba(0, 0, 0, 0.08)",
            "disabled": "rgba(0, 0, 0, 0.26)",
            "disabledBackground": "rgba(0, 0, 0, 0.12)"
        },
        "primary": {
            "main": "#1b5e20",
            "light": "#4c8c4a",
            "dark": "#003300"
        },
        "info": {
            "main": "#2196f3",
            "light": "#64b5f6",
            "dark": "#1976d2"
        }
    }
});

export default theme;

