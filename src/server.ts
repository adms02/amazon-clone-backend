import { app } from "./app";

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`\n> Server started on port: ${port}\n`));
