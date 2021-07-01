require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  }).catch(error => {
    console.log(error)
    response.status(400).end()
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end();
    })
    .catch((error) => {
      console.log(error);
      reponse.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((person) => {
      person ? response.status(204).end() : response.status(404).end();
    })
    .catch((error) => {
      console.log(error);
      reponse.status(400).send({ error: "malformatted id" });
    });
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON());
    })
    .catch((error) => console.log(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined || body.name === null) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (body.number === undefined || body.number === null) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 100000),
  });

  person
    .save()
    .then((savedNote) => savedNote.toJSON())
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "name must be unique",
      });
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
