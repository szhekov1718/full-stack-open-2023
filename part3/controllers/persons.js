const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response, next) =>
  Person.find({})
    .then((people) => response.json(people))
    .catch((err) => next(err))
);

personsRouter.get("/:id", (request, response, next) => {
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

personsRouter.post("/", (request, response, next) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!request.body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true }) // makes the event handler be called with the new modified document
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end(); // 204 status - No Content
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
