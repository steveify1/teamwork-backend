const http = require("http");
const app = require("./app");

// Creating the server
const server = http.createServer(app);

// Set Port
app.set("PORT", process.env.PORT || 3000);


server.listen(app.get("PORT"), "127.0.0.1", () => {
    console.log(`Server is up and running on port ${app.get("PORT")}`);
});
