import { PortableText } from "@portabletext/react";
import { client } from "~/lib/sanity";
import type { About } from "~/types";
import groq from "groq";
import { data, useLoaderData } from "react-router";

export async function loader() {
  const about = await client.fetch<About>(
    `
    *[_type == "about"][0] {
      _id,
      body,
      }
  `,
  );

  if (!about) {
    throw data("About not found", { status: 404 });
  }
  return { about };
}

export default function About() {
  const { about } = useLoaderData<typeof loader>();
  console.log(about);
  return (
    <div className="p-8 pt-28 w-full h-full">
      <article>
        <div className="[--tw-prose-body:#000000] prose prose-p:leading-[20px] prose-p:m-0 prose-p:empty:h-[20px] prose-a:no-underline prose-a:text-fangchunjia-pink prose-a:font-normal">
          <PortableText value={about.body} />
        </div>
      </article>
    </div>
  );
}
