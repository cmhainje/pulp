import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(307, '/');
  }

  // look up the user's papers, ordered by how recently they were used
  const docs = db.document.findMany({
    where: { userId: locals.user.id },
    orderBy: { updated_at: 'desc' }
  });

  return {
    user: locals.user,
    docs: docs,
  };
};