const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;


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

//get request for notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error reading notes data" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

//post request to add a note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    //requiring a title and text in the note to post the note
    const { title, text } = req.body;

    //if title and text are both there, the new object saves as a new note and gets an ID
    if (title && text) {
        const newNote = {
            title,
            text,
            id: Date.now().toString()
        };


    //obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
            console.error(err);
        } else {
        const parsedNotes =JSON.parse(data);
        //add new review
        parsedNotes.push(newNote);

        //write the new note back to the file with the old notes
        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 2),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });

      const response = {
        status: 'success',
        body: newNote,
      };

      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
            if (err) throw err;
            res.json({ message: 'Note deleted' });
        });
    });
});

//routing everything else to the index.html file 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`)
});

