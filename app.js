const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;


app.use(express.json());
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');

const connection_string = process.env.CONNECTION_STRING;
const dataset_name = process.env.DATASET_NAME;
const COLLECTION_aimTrainer = process.env.COLLECTION_aimTrainer;
const COLLECTION_simonSays = process.env.COLLECTION_simonSays;
const COLLECTION_stratagemHero = process.env.COLLECTION_stratagemHero;
const COLLECTION_typingGame = process.env.COLLECTION_typingGame;

const client = new MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection_stratagemHero;
let collection_aimTrainer;
let collection_simonSays;
let collection_typingGame;

var userId = '0';
let user_count;
async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db(dataset_name);
      user_count = await getUserCount();
      collection_stratagemHero= db.collection(COLLECTION_stratagemHero);
      collection_aimTrainer =db.collection(COLLECTION_aimTrainer);
      collection_simonSays = db.collection(COLLECTION_simonSays);
      collection_typingGame =db.collection(COLLECTION_typingGame);
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  }



app.use(express.static('public'));
app.get('/', (req, res) => {
 res.sendFile(__dirname + '/views/homepage.html');
});

app.get('/typing', (req, res) => {
 res.sendFile(__dirname + '/views/typing.html');
});

app.get('/StratagemHero', (req, res) => {
    res.sendFile(__dirname + '/views/StratagemHero.html');
});

app.get('/AimTrainer', (req, res) => {
    res.sendFile(__dirname + '/views/AimTrainer.html');
});

app.get('/SimonSays', (req, res) => {
    res.sendFile(__dirname + '/views/SimonSays.html');
});

app.get('/Profile', (req, res) => {
    res.sendFile(__dirname + '/views/Profile.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/views/history.html');
});

app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});

app.get('/get-sentence', (req, res) => {
    let index = Math.floor(Math.random() * 100);
    res.send({sentence: fs.readFileSync('public/docs/texts.txt', 'utf8').split('\n')[index]});
})

// DataBase
connectToDatabase();

app.get('/get-aimTrainer', async (req, res) => {
  try {
    const scoresArray = await getAllScores(collection_aimTrainer);
    res.status(200).json(scoresArray);
} catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
})

app.post('/post-aimTrainer', (req, res) => {
  score = req.body.score;
  date = getDate();
  collection_aimTrainer.insertOne({date: date, score: score, user_id: userId});
})

app.get('/get-simonSays',async (req, res) => {
  try {
    const scoresArray = await getAllScores(collection_simonSays);
    res.status(200).json(scoresArray);
} catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
})

app.post('/post-simonSays', (req, res) => {
  score = req.body.score;
  date = getDate();
  collection_simonSays.insertOne({date: date, score: score, user_id: userId});
})

app.get('/get-typingGame', async (req, res) => {
  try {
    const scoresArray = await getAllScores(collection_typingGame);
    res.status(200).json(scoresArray);
} catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
})

app.post('/post-typingGame', (req, res) => {
  score = req.body.score;
  date = getDate();
  collection_typingGame.insertOne({date: date, score: score, user_id: userId});
})

app.get('/get-stratagemHero', async (req, res) => {
  try {
    const scoresArray = await getAllScores(collection_stratagemHero);
    res.status(200).json(scoresArray);
} catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
})


app.get('/get-fullHistory', async (req, res) => {
  try {
    const scores_collection_stratagemHero = await getIdScores(collection_stratagemHero);
    const scores_collection_aimTrainer = await getIdScores(collection_aimTrainer);
    const scores_collection_simonSays = await getIdScores(collection_simonSays);
    const scores_collection_typingGame = await getIdScores(collection_typingGame);
    res.status(200).json({stratagemHero: scores_collection_stratagemHero, aimTrainer: scores_collection_aimTrainer, simonSays: scores_collection_simonSays, typingGame: scores_collection_typingGame});
} catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
})

app.post('/post-stratagemHero', (req, res) => {
  score = req.body.score;
  date = getDate();
  collection_stratagemHero.insertOne({date: date, score: score, user_id: userId});
})

async function getAllScores(collection) {
  const cursor = collection.find({});
  let scoresArray = [];
  await cursor.forEach(doc => {
      scoresArray.push({date:doc.date, score:doc.score});
  });
  return scoresArray;
}

async function getIdScores(collection) {
  const cursor = collection.find({user_id: userId});
  let scoresArray = [];
  await cursor.forEach(doc => {
      scoresArray.push({date:doc.date, score:doc.score});
  });
  return scoresArray;
}

function getDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so we add 1 to get the correct month number
  const day = String(now.getDate()).padStart(2, '0'); // padStart adds leading zeros if necessary
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Construct the date string in the desired format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


async function getUserCount() {
    try {
      const count = await db.collection('users').countDocuments();
      return count;
    } catch (error) {
        console.error("Error getting user count:", error);
    }
  }

  app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    console.log('register', username, password, email);
    if (await usernameExists(username)) {
      res.send("1");
    }else if (await emailExists(email)) {
      res.send("2");
    }else{
      const hashedPassword = await bcrypt.hash(password, 10);
      try{
          await db.collection('users').insertOne({ user_id : parseInt(user_count+1), username, password: hashedPassword, email });
        }
      catch{
        "-1"
      }
      console.log('User registered successfully');
      user_count++;
      res.send("0");
    }
  });
  

  async function getIdByUsername(username) {
    try {
       const user = await db.collection('users').findOne({ username });
       if (user) {
         return user.user_id.toString();
       } else { 
         return "User not found"; 
       }
    } catch (error) {
       console.error("Error getting user ID:", error);
       throw error; 
    }
   }

  async function usernameExists(username) {
    try {
       const user = await db.collection('users').findOne({ username });
       return user !== null;
    } catch (error) {
       console.error("Error checking username:", error);
       throw error;
    }
   }
   
   async function emailExists(email) {
    try {
       const user = await db.collection('users').findOne({ email });
       return user !== null;
    } catch (error) {
       console.error("Error checking email:", error);
       throw error;
    }
   }
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('login', username, password);
   
    if (!usernameExists(username)){
      return res.send("1");
    }
    const user = await db.collection('users').findOne({ username });
   try {
     
      const isMatch = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result); 
          }
        });
      });
  
      if (isMatch) {
        userId = await getIdByUsername(username);
        console.log(userId, username);
      
        return res.send("0");
      } else {
        return res.send("1");
      }
   } catch (error) {
      console.error(error);
      return res.send("1");
   }
});
  
app.get('/check_login', (req, res) => {
    if (userId === "0") {
        res.send("0");
    }
    else {
        res.send(userId);
    }
   
})


app.get('/login', (req, res) => {
    res.send(fs.readFileSync('./views/login.html', 'utf8'));
});

app.get('/signup', (req, res) => {
    res.send(fs.readFileSync('./views/register.html', 'utf8'));
})

app.post('/logout', (req, res) => {
  userId = '0';
  res.sendStatus(200); 
});

app.get('/get_userInfo', (req, res) => {
  getUserNameAndEmail(userId)
  .then(info => {res.send(info)})
  .catch(error => {
    console.error("Error retrieving user info:", error);
    res.status(500).send({ error: "Failed to retrieve user info" });
  });
});

async function getUserNameAndEmail() {
  const user = await db.collection('users').findOne({user_id: parseInt(userId) });
  return { username: user.username, email: user.email };
}

app.put('/update_userInfo', (req, res) => {
  const { username, email, password } = req.body;
  if (username) {
    db.collection('users').updateOne({ user_id: parseInt(userId) }, { $set: { username } });
  }
  if (email) {
  db.collection('users').updateOne({ user_id: parseInt(userId) }, { $set: { email } });
  }
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.collection('users').updateOne({ user_id: parseInt(userId) }, { $set: { password: hashedPassword } });
  }
  res.sendStatus(200);
});