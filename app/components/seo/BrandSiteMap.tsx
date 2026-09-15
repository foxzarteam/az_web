import Link from "next/link";
import { CONTACT, SOCIAL_LINKS } from "@/app/config/constants";
import { SITE_TREE, type SiteTreeNode, seoPath } from "@/app/lib/seo";

const rowLink =
  "rounded-lg px-2 py-1 text-sm text-slate-600 transition hover:bg-primary/5 hover:text-primary dark:text-slate-300 dark:hover:text-white";

function TreeBranch({ node, depth = 0 }: { node: SiteTreeNode; depth?: number }) {
  const hasChildren = Boolean(node.children?.length);
  const href = node.path === "/" ? "/" : seoPath(node.path);

  return (
    <li className="min-w-0">
      <div
        className="flex min-w-0 items-start gap-2"
        style={{ paddingLeft: depth > 0 ? `${depth * 12}px` : 0 }}
      >
        {depth > 0 ? (
          <span className="mt-2.5 h-px w-3 shrink-0 bg-gradient-to-r from-primary/60 to-accent/60" aria-hidden />
        ) : null}
        <div className="min-w-0 flex-1">
          <Link href={href} className={`${rowLink} inline-flex font-medium`}>
            {node.name}
          </Link>
          {node.description && depth > 0 ? (
            <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">{node.description}</p>
          ) : null}
        </div>
      </div>
      {hasChildren ? (
        <ul className="mt-1 space-y-1 border-l border-dashed border-primary/20 pl-3 dark:border-white/10">
          {node.children!.map((child) => (
            <TreeBranch key={child.path} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function BrandSiteMap() {
  return (
    <section
      aria-label="Apni Zaroorat site map"
      className="border-t border-border bg-[#F8F9FC] py-10 dark:border-dark_border dark:bg-darklight sm:py-12"
    >
      <div className="container mx-auto max-w-full px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl">
            Explore <span className="theme-gradient-text">Apni Zaroorat</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            All pages, tools, and official channels — one place for Google, AI search, and visitors.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
          <nav aria-label="Site pages" className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:border-dark_border dark:bg-semidark sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Site pages</p>
            <ul className="space-y-2">
              {SITE_TREE.map((node) => (
                <TreeBranch key={node.path + node.name} node={node} />
              ))}
            </ul>
          </nav>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:border-dark_border dark:bg-semidark sm:p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Contact</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={`tel:${CONTACT.PHONE_TEL}`} className={rowLink}>
                    {CONTACT.PHONE}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.EMAIL}`} className={rowLink}>
                    {CONTACT.EMAIL}
                  </a>
                </li>
                <li>
                  <Link href="/contact/" className={rowLink}>
                    Contact page
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:border-dark_border dark:bg-semidark sm:p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Social media</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className={rowLink}>
                    Instagram — @apni_zaroorat
                  </a>
                </li>
                <li>
                  <a href={SOCIAL_LINKS.YOUTUBE} target="_blank" rel="noopener noreferrer" className={rowLink}>
                    YouTube — @Apni_Zaroorat
                  </a>
                </li>
                <li>
                  <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className={rowLink}>
                    Facebook — Apni Zaroorat
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
