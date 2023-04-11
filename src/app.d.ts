// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      user: {
        id: string;
        name: string;
      }
    }
		// interface PageData {}
		// interface Platform {}
	}

  let db: PrismaClient;
}

export {};
