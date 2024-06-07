const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const compression = require("express-compression");
const cookieParser = require("cookie-parser");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionsRouter = require("./routes/sessions.router.js");
const emailRouter = require("./routes/email.router.js");
const fakerRouter = require("./routes/faker.router.js");
const loggerRouter = require("./routes/logger.router.js");
const handleErrors = require("./middleware/error.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
require("./database.js");
const loggerMiddleware = require("./utils/logger.js").loggerMiddleware;

const app = express();
const PUERTO = 8080;

//Set up Express Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(compression());
app.use(loggerMiddleware);

// Using passport for authentication
initializePassport();
app.use(passport.initialize());

//Routes:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", emailRouter);
app.use("/", fakerRouter);
app.use("/", loggerRouter);
app.use(handleErrors);

//Listen:
const httpServer = app.listen(PUERTO, () => {
  console.log(`listening on port ${PUERTO}`);
});

// WebSocket
const SocketManager = require("./socket/socket.manager.js");
new SocketManager(httpServer);
