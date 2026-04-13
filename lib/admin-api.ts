import type { ApiResponse, PageContent, SiteConfig } from './types';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error || 'Request failed');
  }

  return json.data as T;
}

export async function fetchPages(): Promise<{ slug: string; title: string }[]> {
  return apiFetch('/api/admin/pages');
}

export async function fetchPage(slug: string): Promise<PageContent> {
  return apiFetch(`/api/admin/pages/${slug}`);
}

export async function savePage(page: PageContent): Promise<PageContent> {
  return apiFetch(`/api/admin/pages/${page.slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(page),
  });
}

export async function createPage(
  title: string,
  slug: string
): Promise<PageContent> {
  return apiFetch('/api/admin/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, slug }),
  });
}

export async function deletePageApi(slug: string): Promise<void> {
  await apiFetch(`/api/admin/pages/${slug}`, {
    method: 'DELETE',
  });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const result = await apiFetch<{ path: string }>('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });

  return result.path;
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  return apiFetch('/api/admin/site');
}

export async function saveSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  return apiFetch('/api/admin/site', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
}

export async function triggerRebuild(
  message?: string
): Promise<{ rebuilt: boolean; committed: boolean }> {
  return apiFetch('/api/admin/rebuild', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}
