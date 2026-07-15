import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, insurerLogo } from "@/lib/catalog";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm text-slate-500 hover:text-brand-600"
      >
        ← All services
      </Link>
      <div className="mt-3 mb-6 flex items-center gap-3">
        <span className="text-4xl">{cat.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cat.name}</h1>
          <p className="text-slate-500">{cat.tagline}</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Choose an insurer partner
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cat.insurers.map((ins) => {
          const logo = insurerLogo(ins.slug);
          return (
          <div key={ins.slug} className="card flex flex-col p-5">
            <div className="flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={ins.name}
                  className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1"
                />
              ) : (
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700">
                  {ins.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </div>
              )}
              <h3 className="font-semibold text-slate-900">{ins.name}</h3>
            </div>
            <Link
              href={`/dashboard/services/${cat.slug}/${ins.slug}/new`}
              className="btn-primary mt-4"
            >
              Create policy →
            </Link>
          </div>
          );
        })}
      </div>
    </div>
  );
}
