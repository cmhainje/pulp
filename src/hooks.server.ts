import { db } from "$lib/server/database";
import type { Handle } from '@sveltejs/kit';
 
export const handle: Handle = (async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  if (!session) { return await resolve(event); }

  const user = await db.user.findUnique({where: {token: session }, select: { id: true, username: true }});
  if (user) {
    event.locals.user = {
      id: user.id,
      name: user.username,
    };
  }

  return await resolve(event);
});
