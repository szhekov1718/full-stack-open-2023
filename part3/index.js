require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

morgan.token("body", (request) => JSON.stringify(request.body));

const Person = require("./models/person.js");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get("/api/persons", (request, response, next) =>
  Person.find({})
    .then((people) => response.json(people))
    .catch((err) => next(err))
);

app.get("/api/persons/:id", (request, response, next) => {
  return Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true }) // makes the event handler be called with the new modified document
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end(); // 204 status - No Content
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  return Person.find({}).then((people) =>
    response.send(`<div> Phonebook has info for ${people.length} people.<div>`)
  );
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
