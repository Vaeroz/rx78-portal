import { test } from "node:test";
import assert from "node:assert/strict";
import { grades, releases, variants, records, queryRecords } from "./data";
const base = { q: "", grade: "", version: "", type: "", sort: "newest" };
test("stable unique IDs and complete grade → release → variant references", () => {
  for (const items of [grades, releases, variants])
    assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  for (const r of releases) assert.ok(grades.some((g) => g.id === r.gradeId));
  for (const v of variants) {
    assert.ok(releases.some((r) => r.id === v.releaseId));
    assert.ok(v.alt && v.image && v.demo);
    if (v.productId) assert.ok(v.productId.source);
  }
  for (const g of grades) {
    assert.ok(releases.filter((r) => r.gradeId === g.id).length >= 2);
    assert.ok(records.filter((k) => k.grade.id === g.id).length >= 4);
  }
});
test("search spans kit name, full grade name, version and variant type", () => {
  assert.equal(queryRecords({ ...base, q: "real grade 2.0" }).length, 2);
  assert.equal(queryRecords({ ...base, q: "RX-78-2" }).length, 8);
  assert.equal(queryRecords({ ...base, q: "titanium" }).length, 2);
  assert.equal(queryRecords({ ...base, q: "exclusive" }).length, 2);
});
test("combined filters intersect; impossible queries are empty", () => {
  const result = queryRecords({
    ...base,
    grade: "rg",
    version: "rg-2",
    type: "Exclusive",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "rg-2-study");
  assert.equal(
    queryRecords({ ...base, grade: "hg", version: "rg-2" }).length,
    0,
  );
  assert.equal(queryRecords({ ...base, q: "no-such-kit" }).length, 0);
  assert.equal(queryRecords(base).length, variants.length);
});
test("date sorting puts undated records last in both directions", () => {
  for (const sort of ["newest", "oldest"]) {
    const result = queryRecords({ ...base, sort });
    const years = result
      .filter((k) => k.releaseYear)
      .map((k) => k.releaseYear!);
    assert.deepEqual(
      years,
      [...years].sort((a, b) => (sort === "newest" ? b - a : a - b)),
    );
    assert.equal(result.at(-1)?.releaseYear, undefined);
  }
});
test("each record has sibling variants under the same mold", () => {
  for (const record of records)
    assert.ok(
      records.some(
        (k) => k.releaseId === record.releaseId && k.id !== record.id,
      ),
    );
});
