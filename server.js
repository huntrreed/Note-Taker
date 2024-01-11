const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//getting files from 'public' folder'
app.use(express.static('public'));

//routing to the notes file when the notes page is accessed
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

//routing everything else to the index.html file 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`)
});

