import {
    getSignedCookie,
    setSignedCookie,
    deleteCookie
} from "https://deno.land/x/hono@v3.7.4/helper.ts";

const secret = "secret"

const createSession = async(c, user) => {
    const sessionId = crypto.randomUUID()
    await setSignedCookie(c, "sessionId", sessionId, secret, {
        path:"/"
    })

    const kv = await Deno.openKv()
    await kv.set(["sessions", sessionId], user)
}

const getUserFromSession = async(c) => {
    const sessionId = await getSignedCookie(c, secret, "sessionId")
    if(!sessionId){
        console.log("No such session")
        return null
    }

    const kv = await Deno.openKv()
    const user = await kv.get(["sessions", sessionId])
    return user?.value ?? null
}

const deleteSession = async(c) => {
    const sessionId = await getSignedCookie(c, secret, "sessionId")
    if(!sessionId){
        return;
    }

    deleteCookie(c, "sessionId", {
        path:"/"
    })

    const kv = await Deno.openKv()
    await kv.delete(["sessions", sessionId])

}

export { createSession, getUserFromSession, deleteSession }