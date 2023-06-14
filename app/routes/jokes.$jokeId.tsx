import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ActionArgs } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const action = async ({ params, request }: ActionArgs) => {
  const form = await request.formData()
  const content = form.get("content")
  const name = form.get("name")

  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    throw new Error("Form not submitted correctly")

  }

  const fields = { content, name };
  const joke = await db.joke.update({
    where: { id: params.jokeId },
    data: fields,
  })
  return redirect(`/jokes/`)
}

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  })
  if (!joke) {
    throw new Error("Joke Not Found")
  }
  return json({ joke })
}

export default function JokeIdRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <form method="post">
        <textarea name="content" id="" value={data.joke.content} cols={10} rows={5}></textarea>
        <input type="text" name="name" value={data.joke.name} />
        <button type="submit" className="button">Update</button>
      </form>
    </div>
  );
}
