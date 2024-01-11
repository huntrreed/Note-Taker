const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

//middleware


app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`)
});

