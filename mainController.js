import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import * as sessionService from "./sessionService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` })

const showMain = async (c) => {
    const data = {
        user: await sessionService.getUserFromSession(c)
    }
    return c.html(eta.render("main.eta", data))
}

export { showMain }