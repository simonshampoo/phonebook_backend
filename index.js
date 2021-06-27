const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
//#########################################################################################################
app.use(express.json());
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
//#########################################################################################################
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "123",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "123",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "123",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "123",
  },
];
//#########################################################################################################
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  response.send(`
    <div>
        Phonebook has info for ${persons.length} people
        </div>
    <div>
        ${new Date()}
    </div>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});
//#########################################################################################################
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
//#########################################################################################################
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  } else if (persons.some((person) => person.name.includes(body.name))) {
    response.status(400).json({ error: "name already exists" });
  } else if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});
//#########################################################################################################
//NEED TO FIX THIS 
app.put("/api/persons/:id", (request, response) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons
    .map((existingPerson) =>
      existingPerson.id !== person.id //create new array mapping non-matching ID's to original persons, if id matches, then map to our updatedExistingPerson
        ? existingPerson
        : person
    )
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON());
    });
});
//#########################################################################################################
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
