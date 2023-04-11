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

    // check if username already in use
    let user = await db.user.findUnique({ where: { username: username.trim() } });
    if (user) {
      return error(400, 'Username is taken.');
    }

    // register the new user
    user = await db.user.create({
      data: {
        username: username.trim(),
        passhash: await bcrypt.hash(password, 10),
        token: crypto.randomUUID(),
      }
    })

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