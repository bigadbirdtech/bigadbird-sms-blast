import postgres from "postgres";

// Tiny stand-in for the old `@crm/db` (Prisma-style raw queries) so the route files work unchanged.
const g = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
const sql = () => (g.sql ??= postgres(process.env.DATABASE_URL!, { prepare: false })); // prepare:false works behind Supabase's pooler

export const db = {
  $executeRawUnsafe: async (q: string, ...p: unknown[]) => (await sql().unsafe(q, p as never[])).count,
  $queryRawUnsafe: async (q: string, ...p: unknown[]) => sql().unsafe(q, p as never[]),
};
