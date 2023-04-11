import type { Actions } from "./$types";
import { db } from "$lib/server/database";
import { error, redirect } from "@sveltejs/kit";
import bcrypt from 'bcrypt';

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    // read username and password from request
    const { username, password } = Object.fromEntries(await request.formData()) as Record<string, string>;
    if (!username || !password) {
      return error(400, 'Username and/or password cannot be blank.');
    }

    // find user in database
    let user = await db.user.findUnique({ where: { username: username.trim() } });
    if (!user) {
      return error(400, 'No such user exists.');
    }

    // check password
    const validPassword = await bcrypt.compare(password, user.passhash);
    if (!validPassword) {
      return error(400, 'You have entered invalid credentials.')
    }

    // user now authenticated!

    // make a session cookie to keep their login alive for longer.
    user = await db.user.update({
      where: { username: user.username },
      data: { token: crypto.randomUUID() }
    });

    if (user) {  // <- make sure that database update did not fail
      cookies.set('session', String(user.token), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
      });
    }

    throw redirect(303, '/');
  }
};