import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/lib/catalog";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link href="/login" className="btn-secondary">
              Partner Login
            </Link>
            <Link href="/register" className="btn-primary">
              Become a Partner
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-700 to-brand-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Partner Registration Portal
            </span>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Grow your income by selling insurance the smart way.
            </h1>
            <p className="mt-4 max-w-lg text-brand-100">
              Join as a partner, submit policies from India&apos;s leading
              insurers, and earn reward coins for every policy you help create —
              all from one simple dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn bg-white text-brand-700 hover:bg-brand-50">
                Start Partner Registration →
              </Link>
              <Link
                href="/login"
                className="btn border border-white/40 text-white hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
            <p className="mt-6 text-sm text-brand-200">
              Are you an administrator?{" "}
              <Link href="/admin/login" className="font-semibold underline">
                Admin login
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl">
                <p className="text-sm font-semibold text-slate-500">
                  Your reward balance
                </p>
                <p className="mt-1 text-4xl font-extrabold text-brand-700">
                  1,250 <span className="text-coin">🪙</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Reward coins — not currency
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    ["LIC — Jeevan Anand", "+500 🪙"],
                    ["Max Life — Smart Term", "+400 🪙"],
                    ["Care — Health Optima", "+350 🪙"],
                  ].map(([name, coins]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-700">{name}</span>
                      <span className="font-semibold text-emerald-600">{coins}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Products you can offer
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          Compare and submit policies from India&apos;s leading insurance
          companies across every major category.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.slug} className="card p-5">
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.tagline}</p>
              <p className="mt-3 text-xs font-medium text-brand-600">
                {c.insurers.length} insurer partners
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Register",
                body: "Complete the partner registration with your KYC and bank details.",
              },
              {
                step: "2",
                title: "Get verified",
                body: "Our admin team reviews and approves your account.",
              },
              {
                step: "3",
                title: "Submit policies",
                body: "Pick an insurer, fill the proposal, and send it for creation.",
              },
              {
                step: "4",
                title: "Earn coins",
                body: "Get reward coins credited each time a policy is created.",
              },
            ].map((s) => (
              <div key={s.step} className="card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row">
          <Logo />
          <p>
            © {new Date().getFullYear()} IMF Partner Portal. For authorized
            partners only.
          </p>
          <Link href="/admin/login" className="hover:text-brand-600">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
