import express from "express";
const employeeRoute = require("./routes/employee.route");
const userRoute = require("./routes/user.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/api/employee", employeeRoute);
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});
