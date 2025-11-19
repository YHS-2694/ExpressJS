import express from "express";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// --- REQUEST LOGGER MIDDLEWARE ---
const requestLogger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  const method = req.method;
  const url = req.url;

  console.log(`[${time}] ${method} request to ${url}`);

  next();
};

// Register the middleware: It runs for every request.
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name: "Young Ha Shin" });
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.get("/api/time", (req, res) => {
  const currentTime = new Date();

  const timeString = currentTime.toISOString();

  res.status(200).json({
    currentTime: timeString,
  });
});

app.get("/math/circle/:r", (req, res) => {
  // 1. Get the parameter value from req.params and ensure it's a number
  const radius = parseFloat(req.params.r);
  const pi = 3.14159265359; // Using a more precise value for pi is also better practice

  // 2. Add validation to check if the radius is a valid number
  if (isNaN(radius)) {
    return res.status(400).json({
      error: "Invalid radius value provided. Radius must be a number."
    });
  }

  // 3. Perform calculations using the defined 'radius' variable
  res.status(200).json({
    area: pi * radius * radius,
    circumference: 2 * pi * radius
  });
});


app.get("/math/rectangle/:width/:height", (req, res) => {
  // 1. Get the parameter value from req.params and ensure it's a number
  const width = parseFloat(req.params.width);
  const height = parseFloat(req.params.height);

  // 2. Add validation to check if the radius is a valid number
  if (isNaN(width) || isNaN(height)) {
    return res.status(400).json({
      error: "Invalid width or height value provided. Both must be a number."
    });
  }

  // 3. Perform calculations using the defined 'radius' variable
  res.status(200).json({
    area: width * height,
    circumference: 2 * (width + height)
  });
}); 


let categories = ['successQuotes', 'perseveranceQuotes', 'happinessQuotes'];

let successQuotes = [
  {
    'quote': 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    'author': 'Winston S. Churchill'
  },
  {
    'quote': 'The way to get started is to quit talking and begin doing.',
    'author': 'Walt Disney'
  }
];

let perseveranceQuotes = [
  {
    'quote': 'It’s not that I’m so smart, it’s just that I stay with problems longer.',
    'author': 'Albert Einstein'
  },
  {
    'quote': 'Perseverance is failing 19 times and succeeding the 20th.',
    'author': 'Julie Andrews'
  }
];

let happinessQuotes = [
  {
    'quote': 'Happiness is not something ready made. It comes from your own actions.',
    'author': 'Dalai Lama'
  },
  {
    'quote': 'For every minute you are angry you lose sixty seconds of happiness.',
    'author': 'Ralph Waldo Emerson'
  }
];

app.get("/quotebook/categories", (req, res) => {
  res.status(200).send(`A possible category is successQuotes
     A possible category is perseveranceQuotes 
     A possible category is happinessQuotes`);
});

app.get("/quotebook/quote/:category", (req, res) => {

  let category = req.params.category;
  let randomIndex = {};

  if(category === "successQuotes"){
    randomIndex = Math.floor(Math.random() * successQuotes.length);
    res.status(200).json(
      successQuotes[randomIndex]
    );
  }else if(category === "perseveranceQuotes"){
    randomIndex = Math.floor(Math.random() * perseveranceQuotes.length);
    res.status(200).json(
      perseveranceQuotes[randomIndex]
    );
  }else if(category === "happinessQuotes"){
    randomIndex = Math.floor(Math.random() * happinessQuotes.length);
    res.status(200).json(
      happinessQuotes[randomIndex]
    );
  }else{
    res.status(400).json({
      error: "no category listed for [category]"
    });
  }
});

app.post("/quotebook/quote/new/", (req, res) => {
  
  // Get category, quote, and author from the request body
  const { category, quote, author } = req.body; 

  // 1. Validation: Check for required fields
  if (!category || !quote || !author) {
    return res.status(400).json({
      error: "Invalid or insufficient user input. Category, quote, and author are required in the request body."
    });
  }

  const newQuote = { quote, author };

  // 2. Map the category string to the actual array
  let targetArray;
  if (category === "successQuotes") {
    targetArray = successQuotes;
  } else if (category === "perseveranceQuotes") {
    targetArray = perseveranceQuotes;
  } else if (category === "happinessQuotes") {
    targetArray = happinessQuotes;
  } else {
    return res.status(404).json({
      error: `Category "${category}" not listed for new quote.`
    });
  }
  
  // 3. Check for duplicates using .some() (Content check is necessary for objects)
  const isDuplicate = targetArray.some(existingQuote => 
    existingQuote.quote === quote && existingQuote.author === author
  );

  if (isDuplicate) {
    return res.status(409).json({ // 409 Conflict status code for duplicates
        error: "This exact quote already exists in the category."
    });
  }

  // 4. Use .push() to add the data to the in-memory array
  targetArray.push(newQuote);

  // 5. Send success response (201 Created)
  res.status(201).json({
    message: `Quote added successfully to ${category}.`,
    newQuote: newQuote
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});