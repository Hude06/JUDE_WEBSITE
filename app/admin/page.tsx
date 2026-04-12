'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
import { ResizeHandle } from '@/components/admin/ResizeHandle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SIDEBAR_WIDTH_KEY = 'admin:sidebarWidth';
const EDITOR_WIDTH_KEY = 'admin:editorWidth';
const DEFAULT_SIDEBAR_WIDTH = 224;
const DEFAULT_EDITOR_WIDTH = 480;
const SIDEBAR_MIN = 160;
const SIDEBAR_MAX = 500;
const EDITOR_MIN = 320;
const PREVIEW_MIN = 240;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

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
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [editorWidth, setEditorWidth] = useState(DEFAULT_EDITOR_WIDTH);
  const [pageHistory, setPageHistory] = useState<PageContent[]>([]);
  const [pageRedoStack, setPageRedoStack] = useState<PageContent[]>([]);
  const [navHistory, setNavHistory] = useState<SiteConfig[]>([]);
  const [navRedoStack, setNavRedoStack] = useState<SiteConfig[]>([]);
  const sidebarWidthRef = useRef(sidebarWidth);

  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    const savedSidebar = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
    const savedEditor = Number(localStorage.getItem(EDITOR_WIDTH_KEY));
    if (savedSidebar > 0) {
      setSidebarWidth(clamp(savedSidebar, SIDEBAR_MIN, SIDEBAR_MAX));
    }
    if (savedEditor > 0) {
      setEditorWidth(Math.max(EDITOR_MIN, savedEditor));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem(EDITOR_WIDTH_KEY, String(editorWidth));
  }, [editorWidth]);

  const handleSidebarResize = useCallback((dx: number) => {
    setSidebarWidth((w) => clamp(w + dx, SIDEBAR_MIN, SIDEBAR_MAX));
  }, []);

  const handleEditorResize = useCallback((dx: number) => {
    setEditorWidth((w) => {
      const maxAllowed = Math.max(
        EDITOR_MIN,
        window.innerWidth - sidebarWidthRef.current - PREVIEW_MIN
      );
      return clamp(w + dx, EDITOR_MIN, maxAllowed);
    });
  }, []);

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
      setPageHistory([]);
      setPageRedoStack([]);
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
      setNavHistory([]);
      setNavRedoStack([]);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nav');
    }
  }

  function handleBlocksChange(blocks: Block[]) {
    if (!pageContent) return;
    setPageHistory((h) => [...h, pageContent]);
    setPageRedoStack([]);
    setPageContent({ ...pageContent, blocks });
    setDirty(true);
  }

  function handleNavChange(nav: NavLink[]) {
    if (!siteConfig) return;
    setNavHistory((h) => [...h, siteConfig]);
    setNavRedoStack([]);
    setSiteConfig({ ...siteConfig, nav });
    setDirty(true);
  }

  const canUndo =
    view?.type === 'page' ? pageHistory.length > 0 :
    view?.type === 'nav' ? navHistory.length > 0 :
    false;

  const canRedo =
    view?.type === 'page' ? pageRedoStack.length > 0 :
    view?.type === 'nav' ? navRedoStack.length > 0 :
    false;

  function handleUndo() {
    if (view?.type === 'page' && pageContent && pageHistory.length > 0) {
      const prev = pageHistory[pageHistory.length - 1];
      setPageRedoStack((r) => [pageContent, ...r]);
      setPageHistory((h) => h.slice(0, -1));
      setPageContent(prev);
      setDirty(true);
    } else if (view?.type === 'nav' && siteConfig && navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavRedoStack((r) => [siteConfig, ...r]);
      setNavHistory((h) => h.slice(0, -1));
      setSiteConfig(prev);
      setDirty(true);
    }
  }

  function handleRedo() {
    if (view?.type === 'page' && pageContent && pageRedoStack.length > 0) {
      const next = pageRedoStack[0];
      setPageHistory((h) => [...h, pageContent]);
      setPageRedoStack((r) => r.slice(1));
      setPageContent(next);
      setDirty(true);
    } else if (view?.type === 'nav' && siteConfig && navRedoStack.length > 0) {
      const next = navRedoStack[0];
      setNavHistory((h) => [...h, siteConfig]);
      setNavRedoStack((r) => r.slice(1));
      setSiteConfig(next);
      setDirty(true);
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

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
        width={sidebarWidth}
      />

      <ResizeHandle onResize={handleSidebarResize} />

      <div
        style={{ width: editorWidth }}
        className="shrink-0 flex flex-col overflow-hidden"
      >
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {editorTitle ? (
          <>
            <div className="flex items-center justify-between px-4 py-3 gap-2">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold truncate">
                  {editorTitle}
                  {dirty && (
                    <span className="ml-2 text-xs text-muted-foreground">(unsaved)</span>
                  )}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{editorSubtitle}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo (Cmd+Z)"
                >
                  ↶ Undo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo (Cmd+Shift+Z)"
                >
                  ↷ Redo
                </Button>
                <Button onClick={handleSave} disabled={saving || !dirty}>
                  {saving ? 'Saving...' : 'Save & Publish'}
                </Button>
              </div>
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

      <ResizeHandle onResize={handleEditorResize} />

      <PreviewPanel slug={selectedSlug} refreshKey={refreshKey} />
    </>
  );
}
