import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser({
    username: "Otgonbayar",
    password: "SuperSecretPas$",
  }); // TODO

  await createTask({
    title: "Do the laundry",
    done: false,
    user_id: user.id,
  });
  await createTask({
    title: "Feed the cat",
    done: true,
    user_id: user.id,
  });

  await createTask({
    title: "Charge the car",
    done: true,
    user_id: user.id,
  });
}
