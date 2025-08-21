import React, { useEffect, useMemo, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchRecipes, searchRecipes } from "./api";

function StarRating({ value }) {
  const rating = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <span aria-label={`Rating ${rating} of 5`} style={{ color: '#f5b301', whiteSpace: 'nowrap' }}>
      {"★".repeat(full)}
      {hasHalf ? "☆" : ""}
      {"☆".repeat(empty)}
      <span className="ms-1 text-muted" style={{ color: '#6c757d' }}>{Number.isFinite(value) ? value.toFixed(1) : '-'}</span>
    </span>
  );
}

function LabelValue({ label, children }) {
  return (
    <div className="d-flex align-items-start mb-2">
      <div className="text-muted" style={{ minWidth: 120 }}>{label}:</div>
      <div className="ms-2 flex-grow-1">{children}</div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
    total_time: "",
    calories: "",
  });

  const [selected, setSelected] = useState(null);
  const [showTimes, setShowTimes] = useState(false);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v !== undefined && v !== null && String(v).trim() !== "");
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  async function load() {
    setLoading(true);
    setError("");
    try {
      if (hasActiveFilters) {
        const res = await searchRecipes({ ...filters, page, limit });
        setData(res.data || []);
        setTotal(res.total || 0);
      } else {
        const res = await fetchRecipes(page, limit);
        setData(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (e) {
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  function onFilterChange(key, value) {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ title: "", cuisine: "", rating: "", total_time: "", calories: "" });
    setPage(1);
  }

  function Row({ r }) {
    return (
      <tr role="button" onClick={() => { setSelected(r); setShowTimes(false); }}>
        <td className="text-truncate" style={{ maxWidth: 280 }} title={r.title}>{r.title}</td>
        <td>{r.cuisine || '-'}</td>
        <td><StarRating value={r.rating} /></td>
        <td>{Number.isFinite(r.total_time) ? `${r.total_time} min` : '-'}</td>
        <td>{r.serves || '-'}</td>
      </tr>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">🍲 Recipe Explorer</h2>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label">Title</label>
              <input className="form-control" placeholder="e.g. pie"
                     value={filters.title}
                     onChange={e => onFilterChange('title', e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Cuisine</label>
              <input className="form-control" placeholder="e.g. Southern Recipes"
                     value={filters.cuisine}
                     onChange={e => onFilterChange('cuisine', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Rating</label>
              <input className="form-control" placeholder=">=4.5"
                     value={filters.rating}
                     onChange={e => onFilterChange('rating', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Total Time (min)</label>
              <input className="form-control" placeholder="<=60"
                     value={filters.total_time}
                     onChange={e => onFilterChange('total_time', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Calories</label>
              <input className="form-control" placeholder="<=400"
                     value={filters.calories}
                     onChange={e => onFilterChange('calories', e.target.value)} />
            </div>
          </div>
          <div className="d-flex align-items-center mt-3">
            <button className="btn btn-outline-secondary me-2" onClick={clearFilters} disabled={!hasActiveFilters}>Clear Filters</button>
            <div className="ms-auto d-flex align-items-center">
              <label className="me-2">Rows per page</label>
              <select className="form-select" style={{ width: 100 }} value={limit} onChange={e => { setPage(1); setLimit(Number(e.target.value)); }}>
                {[15, 20, 25, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '40%' }}>Title</th>
              <th style={{ width: '20%' }}>Cuisine</th>
              <th style={{ width: '20%' }}>Rating</th>
              <th style={{ width: '10%' }}>Total Time</th>
              <th style={{ width: '10%' }}>Serves</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={5} className="text-danger py-4">{error}</td></tr>
            )}
            {!loading && !error && data.length === 0 && (
              <tr><td colSpan={5} className="text-muted py-4">No results found.</td></tr>
            )}
            {!loading && !error && data.map(r => (
              <Row key={r._id} r={r} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="text-muted">Total: {total}</div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>

      {selected && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={() => setSelected(null)} />
          <div className="position-fixed top-0 end-0 h-100 bg-white shadow" style={{ width: 420, overflowY: 'auto' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">{selected.title}</h5>
                <div className="text-muted">{selected.cuisine || '-'}</div>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="p-3">
              <LabelValue label="Description">
                <div style={{ whiteSpace: 'pre-wrap' }}>{selected.description || '-'}</div>
              </LabelValue>
              <LabelValue label="Total Time">
                <div className="d-flex align-items-center">
                  <span>{Number.isFinite(selected.total_time) ? `${selected.total_time} min` : '-'}</span>
                  <button className="btn btn-link btn-sm ms-2 p-0" onClick={() => setShowTimes(v => !v)} aria-expanded={showTimes}>
                    {showTimes ? 'Hide' : 'Show'} breakdown
                  </button>
                </div>
                {showTimes && (
                  <div className="mt-2 ms-3">
                    <div>Prep Time: {Number.isFinite(selected.prep_time) ? `${selected.prep_time} min` : '-'}</div>
                    <div>Cook Time: {Number.isFinite(selected.cook_time) ? `${selected.cook_time} min` : '-'}</div>
                  </div>
                )}
              </LabelValue>
              <div className="mt-3">
                <h6 className="mb-2">Nutrition</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['calories', selected.nutrients?.calories],
                        ['carbohydrateContent', selected.nutrients?.carbohydrateContent],
                        ['cholesterolContent', selected.nutrients?.cholesterolContent],
                        ['fiberContent', selected.nutrients?.fiberContent],
                        ['proteinContent', selected.nutrients?.proteinContent],
                        ['saturatedFatContent', selected.nutrients?.saturatedFatContent],
                        ['sodiumContent', selected.nutrients?.sodiumContent],
                        ['sugarContent', selected.nutrients?.sugarContent],
                        ['fatContent', selected.nutrients?.fatContent],
                      ].map(([k, v]) => (
                        <tr key={k}>
                          <td className="text-muted" style={{ width: 180 }}>{k}</td>
                          <td>{v || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
