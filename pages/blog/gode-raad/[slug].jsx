import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { useEffect } from "react";
import Breadcrumbs from "../../../src/app/components/breadcrumbs";

import "../../../src/app/style/globals.css";

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  // TestComponent: dynamic(() => import('../../components/TestComponent')),
  Head,
};

const POSTS_PATH = path.join(process.cwd(), "database", "blog", "gode-raad");

const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path));

export default function PostPage({ source, meta }) {
  useEffect(() => {
    // document.documentElement.style.setProperty("--backgroundColor", meta.backgroundColor ? meta.backgroundColor : "#dad3cd");

    return () => {
      document.documentElement.style.setProperty("--contentBackgroundColor", "");
    };
  });

  const breadcrumbs = [
    {
      title: "Blog",
      slug: "blog",
    },
    {
      title: "Gode råd",
      slug: "gode-raad",
    },
    {
      title: meta.title,
      slug: meta.slug,
    },
  ];
  return (
    <main
      className={["mdx"].join(" ")}
      // style={{ '--headerfont': bodyfont.style.fontFamily }}
      style={{
        "--color": meta.color ? meta.color : "",
      }}
    >
      <article>
        <Breadcrumbs crumbs={breadcrumbs} />
        <h1>{meta.title}</h1>

        <h2>{meta.desc}</h2>
        {meta.image && <img src={meta.image} alt={"Illustration"} />}
        <MDXRemote {...source} components={components} />
        {/* <Section
        backgroundColor={
          meta.backgroundColor ? meta.backgroundColor : '#f7f3f0'
        }
        color={meta.color ? meta.color : '#000'}
        logoColor={'#000'}
        logo={'full'}
        className={styles.clipwrapper}
      >
        <Link href={'/blog'} className={styles.backbutton}>
          <ArrowSvg />
        </Link>
        <LabHewro title={meta && meta.title} desc={meta && meta.desc} />
      </Section>

      <Section
        backgroundColor={'#dccfc1'}
        color={'#000'}
        logoColor={'#000'}
        logo={'full'}
        height={'auto'}
        className={styles.clipwrapper}
      >
        <div className={styles.mdx}>{children}</div>
      </Section> */}
      </article>
    </main>

    // <div>
    //   <header>
    //     <nav>
    //       <Link href="/" legacyBehavior>
    //         <a>👈 Go back home</a>
    //       </Link>
    //     </nav>
    //   </header>
    //   <div className="post-header">
    //     <h1>{meta.title}</h1>
    //     {meta.desc && <p className="description">{meta.desc}</p>}
    //   </div>
    //   <main>
    //     <MDXRemote {...source} components={components} />
    //   </main>
    // </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  });

  data.slug = params.slug;

  return {
    props: {
      source: mdxSource,
      meta: data,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ""))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};