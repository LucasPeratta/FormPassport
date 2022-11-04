const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

//cada vez que viaje a otra pagina web, haremos una consulta a la base de datos para ver si existe
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  "local-register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (user) {
        return done(
          null,
          false,
          req.flash("registerMessage", "EL email ya se encuentra logeado")
        );
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

passport.use(
  "local-login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(
          null,
          false,
          req.flash("loginMessage", "Usuario no encontrado")
        );
      }
      if (!user.comparePassword(password)) {
        return done(
          null,
          false,
          req.flash("loginMessage", "Contraseña Incorrecta")
        );
      }
      done(null, user);
    }
  )
);
