import React from 'react';

export default `
# Securing your APIs

LogicgooseUI lets you build APIs to call your RPG programs, which really means you need to handle authentication in your programs also.

There are really three things required:

1. \`tokens\` table, which stores all tokens that can be used for authentication.
1. Authentication API. This creates a token if the user login is valid.
3. Middleware to read and validate the token from the \`authorization\` header when making requests to other APIs.

## \`tokens\` table

The very first step is creating the \`tokens\` table. You can create it in any schema you want. The reason \`token\` is \`char(26)\` is because we use \`hex(GENERATE_UNIQUE())\` in Db2 for i to generate the token, which returns 26 characters.

\`\`\`sql
create table tokens (
  token char(26) not null unique,
  username char(10) not null,
  created_at timestamp default current_timestamp
)
\`\`\`

## Creating the Authenticate API

This is the first API which will be used by the user to authenticate themselves to use other APIs. The input takes in a username and password, and returns a token.

### Input JSON

We use a username length of 10, which is a classic IBM i user profile name length.

\`\`\`json
{
  "username": "10",
  "password": "50"
}
\`\`\`

### Output JSON

In the result, we tell the user if they authenticated successfully (\`success\`), and if they did, return a \`token\` string.

\`\`\`json
{
  "success": true,
  "token": "26"
}
\`\`\`

### RPG program

This program will 

1. authenticate the provided username and password
2. generate a token if it's a valid combination (**note**: you need to write the user authentication yourself)
3. insert the token into the database, along with the username for that token
4. return the token in the API body.

\`\`\`rpgle
Dcl-Pi AUTH;
  req LikeDS(request);
  reqBody LikeDS(inputBody);
  resBody LikeDS(outputBody);
End-Pi;

resBody.success = *Off;
resBody.token = '';

//Implement auth
If (reqBody.username = 'root' AND reqBody.password = 'root');
  EXEC SQL SET :resBody.token = lower(hex(GENERATE_UNIQUE()));

  EXEC SQL 
    INSERT INTO TOKENS (
      TOKEN,
      USERNAME
    ) VALUES (
      :resBody.token,
      :reqBody.username
    ) WITH NC;

  resBody.success = *On;
Endif;

Return;
\`\`\`

## Is valid token

You can write a simple RPG procedure, that can be reused across programs, that will authenticate a token and return either:

* the username that created the token
* blank if the token is not valid.

\`\`\`rpgle
Dcl-Proc GetTokenData;
  //@ In this case, just returns the username
  //@ OR blank if invalid.
  Dcl-Pi *N Char(10);
    token char(26) const;
  End-Pi;

  Dcl-S resultingUser Char(10);

  EXEC SQL
    select username 
    into :resultingUser 
    from barry.tokens 
    where 
      token = :token and 
      //Because our token is only valid for 1 day
      created_at > current_timestamp - 1 days;

  if (sqlstate <> '00000');
    resultingUser = '';
  endif;

  return resultingUser;
End-Proc;
\`\`\`

## APIs that required a token

Next, we can write an API which requires the token. Note that this is a 'bearer token', so you are required to pass it the \`Authorization\` header.

### New Output JSON

Our new simple API returns data that just checks the token.

\`\`\`json
{
  "authenticated": true,
  "username": "10"
}
\`\`\`

Our program simply returns whether the token is valid or not, plus the username used for the token. We created a procedure that finds and parses the \`Authorization\` header, then calls the \`GetTokenData\` procedure to determine if the token is valid.

\`\`\`rpgle
Dcl-Pi GETUSER;
  req LikeDS(request);
  resBody LikeDS(outputBody);
End-Pi;

Dcl-S authUsername Char(10);

authUsername = Middleware_Auth(req);

If (authUsername <> *BLANK);
  resBody.authenticated = *On;
  resBody.username = authUsername;
Else;
  resBody.authenticated = *Off;
  resBody.username = *BLANK;
Endif;

Return;

Dcl-Proc Middleware_Auth;
  //@ Returns username OR blank if not valid
  Dcl-Pi *N Char(10);
    req LikeDS(request);
  End-Pi;

  Dcl-S result Char(10);
  Dcl-S index int(3);
  Dcl-S authorization Varchar(100);
  Dcl-S token Char(26);

  result = *blank;

  index = %Lookup('authorization':req.query(*).key);

  If (index > 0);
    authorization = req.query(index).value;

    If (%Len(authorization) > 8);
      //Is a bearer token hopefully

      If (%Subst(authorization:1:6) = 'Bearer');
        token = %Subst(authorization:8);
        result = GetTokenData(token);
      Endif;
    Endif;
  Endif;

  Return result;
End-Proc;
\`\`\`
`;