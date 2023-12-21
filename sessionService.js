import {
    getSignedCookie,
    setSignedCookie,
} from "https://deno.land/x/hono@v3.7.4/helper.ts";

const secret = "secret"

const createSession = async(c, user) => {
    const sessionId = crypto.randomUUID()
    setSignedCookie(c, "sessionId", sessionId, secret, {
        path:"/"
    })

    const kv = await Deno.openKv()
    await kv.set(["sessions", sessionId], user)
}

export { createSession }