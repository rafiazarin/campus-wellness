import { Icon } from "./Icon";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-700 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
            <Icon name="HeartPulse" size={22} />
          </span>
          <span className="text-lg font-bold">Campus Wellness</span>
        </div>

        <div className="max-w-sm">
          <h2 className="text-3xl font-bold leading-tight">
            Small check-ins, <br /> healthier semesters.
          </h2>
          <p className="mt-4 text-brand-100">
            Log your mood and habits, spot your trends, and book time with campus wellness
            professionals — all in one place.
          </p>
        </div>

        <p className="text-sm text-brand-200">A student wellness tracker · demo project</p>

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-surface-muted px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
