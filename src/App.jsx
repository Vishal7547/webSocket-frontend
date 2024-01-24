import { io } from "socket.io-client";
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const socket = useMemo(() => io("https://chatapp-3cd8.onrender.com/"), []);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });
    // socket.on("welcome", (s) => {
    //   console.log(s);
    // });
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <Container>
      <Box sx={{ height: 200 }} />
      <Typography variant="h6" component="div" gutterButton>
        {socketId}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="success">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="success">
          Send
        </Button>
      </form>
      <Stack>
        {messages?.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterButton>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
