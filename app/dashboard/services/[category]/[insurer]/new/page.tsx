import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsurer } from "@/lib/catalog";
import { DynamicPolicyForm } from "@/components/DynamicPolicyForm";

export default async function NewPolicyPage({
  params,
}: {
  params: Promise<{ category: string; insurer: string }>;
}) {
  const { category, insurer } = await params;
  const match = getInsurer(category, insurer);
  if (!match) notFound();

  return (
    <div>
      <Link
        href={`/dashboard/services/${category}`}
        className="text-sm text-slate-500 hover:text-brand-600"
      >
        ← Back to {match.category.name}
      </Link>
      <div className="mt-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          New {match.category.name} policy
        </h1>
        <p className="text-slate-500">
          Insurer: <span className="font-semibold text-slate-700">{match.insurer.name}</span>
          . Fill in the proposal below and submit it for creation.
        </p>
      </div>

      <DynamicPolicyForm
        category={match.category.slug}
        insurerSlug={match.insurer.slug}
        insurerName={match.insurer.name}
      />
    </div>
  );
}
