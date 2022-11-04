const express = require("express");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

// Initializations
const app = express();
require("./src/database/database");
require("./src/passport/local-auth");

// settings
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);
app.set("views", "./views");
app.set("view engine", "ejs");

// middlewares (funciones que se ejecutan antes de que pasen a las rutas)
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "luquitas",
    resave: false,
    saveUninitialized: false, //para no tener una inicializacion previa
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.registerMessage = req.flash("registerMessage");
  app.locals.loginMessage = req.flash("loginMessage");
  app.locals.user = req.user;
  next();
});

// Routes
app.use("/", require("./src/routes/index"));

// starting
app.listen(app.get("port"), () => {
  console.log(`Server on Port:  ${app.get("port")}`);
});
