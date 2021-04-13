import React from 'react';

export default `
# Creating APIs

When creating APIs, you can provide JSON which will build what the input and output of your APIs will look like. It is import to understand to understand that because RPG is the controller, we have to adhere to what RPG can support. RPG is all fixed length, whereas JSON allows for strings of any size and numbers are doubles.

## Types

LogicgooseUI converts JSON types to the following RPG types

\`\`\`
JSON    -> RPGLE

number  -> Zoned
string  -> Char
boolean -> Ind / Char(1)
\`\`\`

## Defining lengths in JSON

It is possible to define lengths of the fields in the JSON. To control the size of the resulting RPG fields for strings and numbers, you can enter in their size. E.g. \`"50"\` becomes \`Char(50)\` and \`11.2\` becomes \`Zoned(11:2)\`. If a size of a number cannot be determined, it will use \`Zoned(15:7)\`.

\`\`\`json
{
  "value": "Hello world",
  "longString": "50",
  "jsNumber": 1234,
  "specificNumber": 11.2,
  "anotherSpecificNumber": 5.1
}
\`\`\`

Becomes

\`\`\`rpgle
Dcl-Ds base Qualified Template;
  value Char(11);
  longString Char(50);
  jsNumber Zoned(15:7);
  specificNumber Zoned(15:7);
  anotherSpecificNumber Zoned(15:7);
End-Ds;
\`\`\`

## Sub-objects

We can handle having objects as property values (also supporting many levels!)

\`\`\`json
{
  "name": "25",
  "number": 25,
  "substructA": {
    "a": "10",
    "b": 10
  }
}
\`\`\`

Becomes

\`\`\`rpgle
Dcl-Ds substructA Qualified Template;
  a Char(10);
  b Zoned(15:7);
End-Ds;

Dcl-Ds base Qualified Template;
  name Char(25);
  number Zoned(15:7);
  substructA LikeDS(substructA);
End-Ds;
\`\`\`

## Array of objects

**note**: due to the nature of fixed array sizes in RPG, LogicgooseUI determines what the max size of the array can be (e.g. the \`dim\` keyword) and should not be changed by the user. Use only what the base source tells you, because if buffers don't match, then your API won't work.

\`\`\`json
{
  "name": "25",
  "number": 25,
  "substructA": [{
    "a": "10",
    "b": 10
  }]
}
\`\`\`

Becomes

\`\`\`rpgle
Dcl-Ds substructA Qualified Template;
  a Char(10);
  b Zoned(15:7);
End-Ds;

Dcl-Ds base Qualified Template;
  name Char(25);
  number Zoned(15:7);
  substructA LikeDS(substructA) Dim(5);
End-Ds;
\`\`\`
`;
