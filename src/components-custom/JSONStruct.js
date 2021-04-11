import React from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import { makeStyles } from '@material-ui/core/styles';

const modalStyle = {
  top: `30%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
};

const useStyles = makeStyles((theme) => ({
  topbar: {
    padding: theme.spacing(1),
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textAreas: {
    height: '100%',
    width: '100%'
  },

  topButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2)
  },

  marginRight: {
    marginRight: theme.spacing(2)
  },

  paper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function JSONStruct({name, label, value, onChange}) {
  const [jsonString, setJSONString] = React.useState(value);
  const [rpgleSource, setRPGLESource] = React.useState('');
  const [helperText, setHelperText] = React.useState('');
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);

  const generateNewStuff = () => {
    setHelperText(``);
    let numberLength = 15;
    let decimalLength = 7;
    
    try {
      const data = JSON.parse(jsonString);

      let rpgleOut = ``;
      let bufferSize = 0;

      const parseStruct = (name, props) => {
        let currentRPGStruct = [];
        let structSize = 0;

        for (const prop in props) {
          switch (typeof props[prop]) {
            case 'string':
              const stringLength = Number(props[prop]) || props[prop].length;
              currentRPGStruct.push({name: prop, props: `Char(${stringLength})`});
              structSize += stringLength;
              break;

            case 'number':
              numberLength = 15, decimalLength = 7;
              const stringNumber = String(props[prop]);

              //We now let the user provide the length of the Zoned IN the number.
              if (stringNumber.includes(`.`)) {
                numberLength = Number(stringNumber.split(`.`)[0]);
                decimalLength = Number(stringNumber.split(`.`)[1]);
              }

              currentRPGStruct.push({name: prop, props: `Zoned(${numberLength}:${decimalLength})`});
              structSize += numberLength;

              break;
            case 'boolean':
              currentRPGStruct.push({name: prop, props: `Ind`});
              structSize += 1;
              break;

            case 'object':
              if (props[prop].length) {
                //Is array

                if (typeof props[prop][0] === "object") {
                  currentRPGStruct.push({name: prop, props: `LikeDS(${prop}) Dim(1)`});
                  structSize += (parseStruct(prop, props[prop][0]) * 1);
                } else {
                  setHelperText(`Arrays can only contain objects and not primitives (${prop}).`)
                }
              } else {
                //Is object
                currentRPGStruct.push({name: prop, props: `LikeDS(${prop})`});
                structSize += parseStruct(prop, props[prop]);
              }
              break;

            default:
              break;
          }

        }

        rpgleOut += [
          `Dcl-Ds ${name} Qualified Template;`,
          ...currentRPGStruct.map(subf => `  ${subf.name} ${subf.props};`),
          `End-Ds;`, ``, ``
        ].join(`\n`);

        return structSize;
      }

      bufferSize = parseStruct(name, data);

      if (bufferSize >= 32704) {
        setHelperText(`Buffer size cannot exceed 32704. (${bufferSize})`);
      }

      setRPGLESource(rpgleOut);

    } catch (e) {
      console.log(e);
      setHelperText(`Unable to parse JSON.`);
    }
  }

  const onJSONChange = (event) => {
    const jsonString = event.target.value;
    setJSONString(jsonString);
  }

  React.useEffect(() => {
    generateNewStuff()
  }, [jsonString]);

  const classes = useStyles();

  return (
    <React.Fragment>
      <Box>
        <Button 
          className={classes.topButton} 
          variant="contained" 
          disabled={helperText.length > 0}
          onClick={() => setProjectModalOpen(true)}
        >
          Preview RPG
        </Button>
      </Box>

      <Box mt={3} />

      <TextField
        name={name}
        label={label}
        multiline
        value={value}
        onChange={(event) => {
          onJSONChange(event); //Call internal change handler
          onChange(event); //Call external change handler
        }}
        variant="outlined"
        
        error={helperText.length > 0}
        helperText={helperText}

        rows={15}
        className={classes.textAreas}
        inputProps={{style: {fontFamily: 'monospace'}}}
      />

      <Modal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">RPGLE Preview</h2>
          <pre>
            {rpgleSource}
          </pre>
        </div>
      </Modal>
    </React.Fragment>
  )
}