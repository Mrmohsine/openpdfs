"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type TypeItem = { id: number; name: string };
type DocumentItem = {
  id: number;
  title: string;
  description?: string | null;
  keywords?: string | null;
  file_url: string;
  file_original_name?: string;
  type?: TypeItem | null;
};

export default function DocumentsPremiumPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | "all">("all");
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // load initial list and attempt to load types
    fetchDocuments();
    fetchTypes();
  }, []);

  async function fetchTypes() {
    try {
      // try a dedicated types endpoint first
      const res = await axios.get(`${API_BASE}/api/types`);
      const payload = res.data;
      // support different response shapes
      const items = payload?.types || payload || [];
      setTypes(items);
    } catch (e) {
      // fallback: derive types from the documents we already have
      console.warn("/api/types not available, deriving types from documents");
      const derived: Record<number, TypeItem> = {};
      documents.forEach((d) => {
        if (d.type && !derived[d.type.id]) derived[d.type.id] = d.type;
      });
      setTypes(Object.values(derived));
    }
  }

  async function fetchDocuments(opts?: { search?: string; type_id?: number; page?: number }) {
    try {
      setLoading(true);
      setError(null);

      if (opts?.search) {
        // use search endpoint that returns matching documents
        const res = await axios.get(`${API_BASE}/api/documents/search/${encodeURIComponent(opts.search)}`);
        setDocuments(res.data.documents || res.data);
        setTotal((res.data.documents && res.data.documents.length) || (res.data.length || 0));
        return;
      }

      if (opts?.type_id) {
        // use byType endpoint
        const res = await axios.get(`${API_BASE}/api/documents/type/${opts.type_id}`);
        setDocuments(res.data.documents || res.data);
        setTotal((res.data.documents && res.data.documents.length) || (res.data.length || 0));
        return;
      }

      // default paginated list
      const params: any = { per_page: perPage, page: opts?.page || page };
      const res = await axios.get(`${API_BASE}/api/documents`, { params });
      const payload = res.data;

      // support different response shapes
      if (payload?.documents?.data) {
        setDocuments(payload.documents.data);
        setTotal(payload.documents.total || 0);
      } else if (Array.isArray(payload?.documents)) {
        setDocuments(payload.documents);
        setTotal(payload.documents.length);
      } else if (Array.isArray(payload)) {
        setDocuments(payload);
        setTotal(payload.length);
      } else {
        setDocuments([]);
        setTotal(0);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      console.error(err);
      setError(axiosError?.response?.data?.message || (err instanceof Error ? err.message : "") || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setTypeFilter("all");
    setPage(1);
    if (!query) {
      fetchDocuments({ page: 1 });
    } else {
      fetchDocuments({ search: query });
    }
  }

  function onFilterType(typeId: string) {
    setQuery("");
    setPage(1);
    if (typeId === "all") {
      setTypeFilter("all");
      fetchDocuments({ page: 1 });
    } else {
      setTypeFilter(Number(typeId));
      fetchDocuments({ type_id: Number(typeId) });
    }
  }

  function openViewer(doc: DocumentItem) {
    setSelected(doc);
  }

  function closeViewer() {
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Document Library</h1>
            <p className="text-sm text-gray-500 mt-1">Professional, fast and searchable PDFs — built for productivity.</p>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={onSearch} className="flex items-center gap-2">
              <input
                type="search"
                placeholder="Search title or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-80 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Search</button>
            </form>

            <select value={typeFilter as string} onChange={(e) => onFilterType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
              <option value="all">All types</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </header>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded">{error}</div>}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-white rounded-lg shadow">
                <div className="h-40 bg-gray-100 rounded mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))
          ) : documents.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-600 bg-white rounded-lg shadow">No documents found.</div>
          ) : (
            documents.map((doc) => (
              <article key={doc.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-28 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-semibold">PDF</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">{doc.description || doc.keywords || "No description"}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{doc.type?.name || '—'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => openViewer(doc)} className="text-sm px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Preview</button>
                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-sm px-3 py-2 border rounded">Open</a>
                        <a href={doc.file_url} download className="text-sm px-3 py-2 border rounded">Download</a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {documents.length} of {total} results</div>

          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => { setPage((p) => Math.max(1, p - 1)); fetchDocuments({ page: page - 1 }); }} className="px-3 py-2 bg-white border rounded disabled:opacity-50">Prev</button>
            <div className="px-3 py-2 bg-white border rounded">{page}</div>
            <button disabled={documents.length < perPage} onClick={() => { setPage((p) => p + 1); fetchDocuments({ page: page + 1 }); }} className="px-3 py-2 bg-white border rounded disabled:opacity-50">Next</button>
          </div>
        </footer>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-5xl w-full mx-4 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold">{selected.title}</h3>
              <div className="flex items-center gap-2">
                <a href={selected.file_url} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded">Open</a>
                <button onClick={closeViewer} className="px-3 py-1 bg-indigo-600 text-white rounded">Close</button>
              </div>
            </div>

            <div style={{ height: '80vh' }}>
              <iframe src={selected.file_url} title={selected.title} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

