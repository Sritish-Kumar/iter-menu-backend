import express from "express";
import cors from "cors";
import { authRouter } from "../routes/authRoutes.js";
import { userRouter } from "../routes/users.js";
import { menuRouter } from "../routes/menu.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
// app.use(cors());
const allowedOrigins = [
  // "http://localhost:5173",
  "https://menumate-flax.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/menu", menuRouter);

app.get("/", (req, res) => {
  res.send(" Server is running ...");
});

app.get("/testing", (req, res) => {
  res.json({
    Name: "Sritish",
    Role: "Full Stack Developer",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
