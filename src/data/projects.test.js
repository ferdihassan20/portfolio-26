import { projects, getPublishedProjects, getProjectById, getAdjacentProjects } from './projects';

test('every project has the detail fields and no slides', () => {
  for (const p of projects) {
    expect(p).toEqual(expect.objectContaining({
      id: expect.any(String),
      context: expect.any(String),
      outcome: expect.any(String),
      draft: expect.any(Boolean),
      tags: expect.any(Array),
    }));
    expect(p).not.toHaveProperty('slides');
  }
});

test('ids are unique and URL-safe', () => {
  const ids = projects.map((p) => p.id);
  expect(new Set(ids).size).toBe(ids.length);
  ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
});

test('consumer-strategy uses the Kita Ngantuk deck', () => {
  expect(getProjectById('consumer-strategy').pdf.src).toBe('/projects/kita-ngantuk-gmbcc-semifinal.pdf');
});

test('draft projects are hidden', () => {
  const draft = { ...projects[0], id: 'hidden-one', draft: true };
  projects.push(draft);
  try {
    expect(getPublishedProjects()).not.toContain(draft);
    expect(getProjectById('hidden-one')).toBeUndefined();
  } finally {
    projects.pop();
  }
});

test('unknown id returns undefined', () => {
  expect(getProjectById('nope')).toBeUndefined();
});

test('adjacent projects wrap around', () => {
  const list = getPublishedProjects();
  expect(getAdjacentProjects(list[0].id).prev).toBe(list.at(-1));
  expect(getAdjacentProjects(list.at(-1).id).next).toBe(list[0]);
  expect(getAdjacentProjects(list[0].id).next).toBe(list[1]);
});
