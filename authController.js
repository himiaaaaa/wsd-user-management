import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import * as userService from "./userService.js"
import * as sessionService from "./sessionService.js"
import * as scrypt from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` })

const validator = z.object({
    email: z.string().email({ message: "It should be an email" }),
    password: z.coerce.string().min(1, { message: "password should not be empty" })
}) 

const showRegistrationForm = (c) => {
    return c.html(eta.render("registration.eta"))
}

const registerUser = async(c) => {
    const body = await c.req.parseBody()
    const validationResult = validator.safeParse(body)
    if(!validationResult.success){
        return c.html(eta.render("registration.eta", {
            ...body,
            errors: validationResult.error.format()
        }))
    } 

    if(body.password != body.verification){
        return c.text("The provided passwords did not match.");
    }
    
    const existingUser = await userService.findUserByEmail(body.email)
    
    if(existingUser){
        return c.text(`A user with the email ${body.email} already exists.`);
    }

    const user = {
        id: crypto.randomUUID(),
        email: body.email,
        passwordHash: scrypt.hash(body.password)
    }
    await userService.createUser(user)
    await sessionService.createSession(c, user)

    return c.text(JSON.stringify(body))
}

const showLoginForm = (c) => c.html(eta.render("login.eta"))

const loginUser = async(c) => {
    const body = await c.req.parseBody()
    console.log(body)

    const user = await userService.findUserByEmail(body.email)

    if(!user){
        return c.text(`No user with the email ${body.email} exists.`)
    }

    const passwordMatch = scrypt.verify(body.password, user.passwordHash)
    if(!passwordMatch){
        return c.text("Incorrect password")
    }

    await sessionService.createSession(c, user)

    return c.text(JSON.stringify(body))
}

export { showRegistrationForm, registerUser, showLoginForm, loginUser }