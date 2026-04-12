'use client';

import { useEffect, useState, useCallback } from 'react';
import type { PageContent, Block, SiteConfig, NavLink } from '@/lib/types';
import {
  fetchPages,
  fetchPage,
  savePage,
  createPage,
  deletePageApi,
  fetchSiteConfig,
  saveSiteConfig,
  triggerRebuild,
} from '@/lib/admin-api';
import { PageSidebar } from '@/components/admin/PageSidebar';
import { BlockEditor } from '@/components/admin/BlockEditor';
import { NavEditor } from '@/components/admin/NavEditor';
import { PreviewPanel } from '@/components/admin/PreviewPanel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PageInfo {
  slug: string;
  title: string;
}

type View = { type: 'page'; slug: string } | { type: 'nav' };

export default function AdminPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [view, setView] = useState<View | null>(null);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadPages = useCallback(async () => {
    try {
      const data = await fetchPages();
      setPages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  async function handleSelectPage(slug: string) {
    try {
      setError(null);
      const data = await fetchPage(slug);
      setView({ type: 'page', slug });
      setPageContent(data);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
    }
  }

  async function handleSelectNav() {
    try {
      setError(null);
      const config = await fetchSiteConfig();
      setSiteConfig(config);
      setView({ type: 'nav' });
      setPageContent(null);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nav');
    }
  }

  function handleBlocksChange(blocks: Block[]) {
    if (!pageContent) return;
    setPageContent({ ...pageContent, blocks });
    setDirty(true);
  }

  function handleNavChange(nav: NavLink[]) {
    if (!siteConfig) return;
    setSiteConfig({ ...siteConfig, nav });
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      if (view?.type === 'page' && pageContent) {
        await savePage(pageContent);
      } else if (view?.type === 'nav' && siteConfig) {
        await saveSiteConfig(siteConfig);
      }

      const label = view?.type === 'nav' ? 'navigation' : (pageContent?.slug ?? 'page');
      const result = await triggerRebuild(`content: update ${label} via admin`);

      setDirty(false);
      setRefreshKey((k) => k + 1);

      if (!result.committed) {
        setError('Saved and rebuilt, but could not sync to GitHub');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPage(title: string, slug: string) {
    try {
      setError(null);
      await createPage(title, slug);
      await loadPages();
      await handleSelectPage(slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page');
    }
  }

  async function handleDeletePage(slug: string) {
    try {
      setError(null);
      await deletePageApi(slug);
      await loadPages();

      if (view?.type === 'page' && view.slug === slug) {
        setView(null);
        setPageContent(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    }
  }

  const selectedSlug = view?.type === 'page' ? view.slug : null;

  function renderEditor() {
    if (view?.type === 'nav' && siteConfig) {
      return (
        <NavEditor
          nav={siteConfig.nav}
          onChange={handleNavChange}
          availablePages={pages}
        />
      );
    }

    if (view?.type === 'page' && pageContent) {
      return (
        <BlockEditor
          blocks={pageContent.blocks}
          onBlocksChange={handleBlocksChange}
          slug={pageContent.slug}
        />
      );
    }

    return null;
  }

  const editorTitle = view?.type === 'nav'
    ? 'Navigation'
    : pageContent?.title ?? null;

  const editorSubtitle = view?.type === 'nav'
    ? 'Manage header links'
    : pageContent ? `/${pageContent.slug}` : null;

  return (
    <>
      <PageSidebar
        pages={pages}
        selectedSlug={selectedSlug}
        isNavSelected={view?.type === 'nav'}
        onSelectPage={handleSelectPage}
        onSelectNav={handleSelectNav}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {editorTitle ? (
          <>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h1 className="text-lg font-semibold">
                  {editorTitle}
                  {dirty && (
                    <span className="ml-2 text-xs text-muted-foreground">(unsaved)</span>
                  )}
                </h1>
                <p className="text-xs text-muted-foreground">{editorSubtitle}</p>
              </div>
              <Button onClick={handleSave} disabled={saving || !dirty}>
                {saving ? 'Saving...' : 'Save & Publish'}
              </Button>
            </div>
            <Separator />
            <div className="flex-1 overflow-y-auto p-4">
              {renderEditor()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a page or navigation to edit
          </div>
        )}
      </div>

      <PreviewPanel slug={selectedSlug} refreshKey={refreshKey} />
    </>
  );
}
