import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // find all the papers ordered by recency
  const docs = db.document.findMany({ orderBy: { updated_at: 'desc' } });
  return {
    docs,
  };
};