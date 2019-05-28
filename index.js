// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
    db 
        .find()
        .then(users => {
            res.json({ users });
        })
        .catch(error => {
            res.status(500).json({ error: "The users information could not be retrieved." })
        })
    
});

server.get('/api/users/:id', (req, res) => {
    db
        .findById(id)
        .then(user => {
            if (user.length === 0) {
                res.send(404).json({ message: "The user with the specified ID does not exist. "});
                return;
            }
            res.json(user);
        })
        .catch(error => {
            res.status(500).json({ error: "The user information could not be retrieved. "})
        })
    
});

server.delete('/api/users/:id', (req, res) => {
    const id  = req.params.id;
    db
        .remove(id)
        .then(id => {
            if (id === 0) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
                return;
            }
            res.json({ success: `User with id: ${id} was removed`})
        })
        .catch(error => {
            res.status(500).json({ error: "The user could not be removed "})
        })
});

server.post('/api/users', (req, res) => {
     const { name, bio } = req.body;
     
     if (!name || !bio) {
         res.send(400).json({ message: "Please provide name and bio for the user." })
     }
     db
        .insert({
            name, 
            bio,

        })
        .then(created => {
            res.status(201).json(created);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the user to the database" })
        })
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    db
        .update(id, {name, bio})
        .then(updated => {
            if (updated === 0 ) {
                res.status(500).json({ message: "The user information could not be modified." })
            };
            
            db 
                .findById(id)
                .then(user => {
                    if (user.length === 0) {
                        res.status(404).json ({ message: "The user with the specified ID does not exist."})

                    }
                })
    })

});

server.listen(8000, () => {
    console.log('API running on port 8000')
});