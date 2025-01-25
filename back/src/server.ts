import { initApp } from "./app";

const port: number = parseInt(process.env.PORT || '3000', 10);

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});