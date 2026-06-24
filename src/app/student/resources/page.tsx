import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/AppShell";
import { Badge, ButtonLink, Card, EmptyState } from "@/components/ui";
import { ResourceSearch } from "@/components/ResourceSearch";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await requireUser("student");
  const q = searchParams.q?.trim();

  const resources = await prisma.resource.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { category: "asc" },
  });

  return (
    <>
      <PageHeader title="Resources" subtitle="Curated articles, guides, and support contacts." />

      <div className="mb-4 max-w-md">
        <ResourceSearch />
      </div>

      {resources.length === 0 ? (
        <EmptyState>No resources match “{q}”. Try a different keyword.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.id} className="flex flex-col">
              <Badge tone="brand">{r.category}</Badge>
              <h3 className="mt-2 text-base font-semibold text-slate-900">{r.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600">{r.description}</p>
              {r.url && (
                <div className="mt-4">
                  <ButtonLink href={r.url} variant="secondary">
                    Visit resource
                  </ButtonLink>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
