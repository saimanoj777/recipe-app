const BASE = 'https://recipe-app-iv8o.onrender.com';

export async function fetchRecipes(page=1, limit=15) {
  const res = await fetch(`${BASE}/api/recipes?page=${page}&limit=${limit}`);
  return res.json();
}

export async function searchRecipes(filters) {
  const url = new URL(`${BASE}/api/recipes/search`);
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });
  const res = await fetch(url);
  return res.json();
}
