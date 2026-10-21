export interface Grade {
  id: string;
  name: string;
  scale: string;
  description: string;
}
export interface Release {
  id: string;
  gradeId: string;
  name: string;
  year: number;
  type: "Original" | "Revision";
  notes: string;
}
export interface Variant {
  id: string;
  releaseId: string;
  name: string;
  type: "Standard" | "Color" | "Event" | "Exclusive";
  manufacturer: string;
  releaseYear?: number;
  releaseDate?: string;
  productId?: { value: string; source: string };
  notes: string;
  image: string;
  alt: string;
  sources?: { label: string; url: string }[];
  demo: true;
}
export const grades: Grade[] = [
  {
    id: "hg",
    name: "High Grade",
    scale: "1/144",
    description:
      "A small scale. A complete universe. Accessible builds and enduring silhouettes.",
  },
  {
    id: "rg",
    name: "Real Grade",
    scale: "1/144",
    description:
      "Precision at its smallest. Dense surface detail and an articulated inner frame.",
  },
  {
    id: "mg",
    name: "Master Grade",
    scale: "1/100",
    description:
      "Room for the details. Explore the evolution of the iconic mobile suit.",
  },
  {
    id: "pg",
    name: "Perfect Grade",
    scale: "1/60",
    description:
      "The flagship experience. Large-scale engineering from the inside out.",
  },
];
export const releases: Release[] = [
  {
    id: "hg-original",
    gradeId: "hg",
    name: "HGUC Original",
    year: 2001,
    type: "Original",
    notes:
      "Early HGUC interpretation; release year is illustrative and requires source verification.",
  },
  {
    id: "hg-revive",
    gradeId: "hg",
    name: "HGUC Revive",
    year: 2015,
    type: "Revision",
    notes:
      "A later engineering generation, distinct from finish and color variations.",
  },
  {
    id: "rg-original",
    gradeId: "rg",
    name: "RG Ver. 1.0",
    year: 2010,
    type: "Original",
    notes: "First-generation Real Grade interpretation.",
  },
  {
    id: "rg-2",
    gradeId: "rg",
    name: "RG Ver. 2.0",
    year: 2024,
    type: "Revision",
    notes: "A separate tooling generation from the original Real Grade.",
  },
  {
    id: "mg-2",
    gradeId: "mg",
    name: "MG Ver. 2.0",
    year: 2008,
    type: "Revision",
    notes: "Animation-inspired proportions and a revised mechanical structure.",
  },
  {
    id: "mg-3",
    gradeId: "mg",
    name: "MG Ver. 3.0",
    year: 2013,
    type: "Revision",
    notes: "A separate version with an emphasis on layered armor detail.",
  },
  {
    id: "pg-original",
    gradeId: "pg",
    name: "PG Original",
    year: 1998,
    type: "Original",
    notes: "The original Perfect Grade engineering generation.",
  },
  {
    id: "pg-unleashed",
    gradeId: "pg",
    name: "PG Unleashed",
    year: 2020,
    type: "Revision",
    notes:
      "A later engineering generation; not a color variant of the original PG.",
  },
];
export const variants: Variant[] = releases.flatMap((release, i) => [
  {
    id: `${release.id}-standard`,
    releaseId: release.id,
    name: "RX-78-2 Gundam",
    type: "Standard" as const,
    manufacturer: "Bandai / Bandai Spirits (unverified for this record)",
    releaseYear: release.year,
    notes:
      "Representative demo record. Dates, manufacturer attribution and specifications need primary-source verification. No product identifier has been asserted.",
    image: "schematic.svg",
    alt: "Original geometric mobile-suit schematic, an illustrative placeholder rather than a product image.",
    demo: true as const,
  },
  {
    id: `${release.id}-study`,
    releaseId: release.id,
    name: [
      "Clear armor study",
      "Rollout color study",
      "Event finish study",
      "Titanium finish study",
    ][i % 4],
    type: (["Color", "Color", "Event", "Exclusive"] as const)[i % 4],
    manufacturer: "Unverified — demo concept",
    notes:
      "Fictional demonstration variant used to illustrate the archive hierarchy. This is not a claim that a corresponding retail kit exists.",
    image: "schematic.svg",
    alt: "Original schematic placeholder with alternate accent lighting; not a representation of a retail variant.",
    demo: true as const,
  },
]);
export const records = variants.map((v) => {
  const release = releases.find((r) => r.id === v.releaseId)!;
  return {
    ...v,
    release,
    grade: grades.find((g) => g.id === release.gradeId)!,
  };
});
export type RecordKit = (typeof records)[number];
export interface Filters {
  q: string;
  grade: string;
  version: string;
  type: string;
  sort: string;
}
export function queryRecords(filters: Filters) {
  const words = filters.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return records
    .filter(
      (k) =>
        words.every((w) =>
          `${k.name} ${k.grade.id} ${k.grade.name} ${k.release.name} ${k.type}`
            .toLowerCase()
            .includes(w),
        ) &&
        (!filters.grade || k.grade.id === filters.grade) &&
        (!filters.version || k.release.id === filters.version) &&
        (!filters.type || k.type === filters.type),
    )
    .sort((a, b) =>
      filters.sort === "name"
        ? a.name.localeCompare(b.name) ||
          a.release.name.localeCompare(b.release.name)
        : filters.sort === "oldest"
          ? (a.releaseYear ?? Infinity) - (b.releaseYear ?? Infinity)
          : (b.releaseYear ?? -Infinity) - (a.releaseYear ?? -Infinity),
    );
}
