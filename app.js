import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.7.4/mod.ts";
import * as authController from "./authController.js";
import * as mainController from "./mainController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` })

const app = new Hono();

app.get("/", mainController.showMain)

app.get("/auth/login", authController.showLoginForm)
app.post("/auth/login", authController.loginUser)

app.get("/auth/registration", authController.showRegistrationForm);
app.post("/auth/registration", authController.registerUser);

app.post("/auth/logout", authController.logoutUser)

export default app