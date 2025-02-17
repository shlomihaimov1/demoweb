import { server } from "./lib/socket"; // Import the server from socket.ts
import { initApp } from "./app"; // Import the initApp function from app.ts

const port: number = parseInt(process.env.PORT || '3000', 10);

initApp().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((error) => {
  console.error("Failed to initialize app:", error);
});
