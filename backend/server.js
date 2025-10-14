
// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import { mintNFT } from './Modules/nftMint.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());
app.use(express.static('../Frontend'));  // Serve frontend files
app.use('/Assets', express.static('../Assets')); // Serve JSON / image files

// --- Socket.IO chat ---
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// --- NFT mint endpoint ---
app.post("/mintNFT", async (req, res) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ success: false, message: "Wallet address missing" });
  
  try {
    const result = await mintNFT(wallet);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error minting NFT" });
  }
});

// --- Start server ---
const PORT = 3000;
server.listen(PORT, () => console.log(`Backend server running at http://localhost:${PORT}`));