import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";

const users = [];
const JWT_SECRET = "my_secret_key";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const users = getUsers();
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }
    const user = { id: users.length + 1, username, password: hash };
    users.push(user);
    res.json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
    });
    saveUsersToFile(users);
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
  });
};
export const getProfile = async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  const [bearer, token] = authorizationHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const users = getUsers();
    const user = users.find((user) => user.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username });
  });
};

export const logout = async (req, res) => {
  res.status(204).end();
};


function saveUsersToFile(users) {
  fs.writeFile("users.json", JSON.stringify({ users }), (err) => {
    if (err) {
      console.error("Error saving users file:", err);
    } else {
      console.log("Users saved to file");
    }
  });
}

function getUsers() {
  try {
    const data = fs.readFileSync("users.json");
    const users = JSON.parse(data);
    console.log(users);
    return users["users"];
  } catch (err) {
    console.error("Error reading users file:", err);
  }
}
