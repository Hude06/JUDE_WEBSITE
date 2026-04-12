'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface PageInfo {
  slug: string;
  title: string;
}

interface PageSidebarProps {
  pages: PageInfo[];
  selectedSlug: string | null;
  isNavSelected: boolean;
  onSelectPage: (slug: string) => void;
  onSelectNav: () => void;
  onAddPage: (title: string, slug: string) => void;
  onDeletePage: (slug: string) => void;
}

export function PageSidebar({
  pages,
  selectedSlug,
  isNavSelected,
  onSelectPage,
  onSelectNav,
  onAddPage,
  onDeletePage,
}: PageSidebarProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleTitleChange(value: string) {
    setNewTitle(value);
    setNewSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    );
  }

  function handleAdd() {
    if (newTitle.trim() && newSlug.trim()) {
      onAddPage(newTitle.trim(), newSlug.trim());
      setNewTitle('');
      setNewSlug('');
      setAddOpen(false);
    }
  }

  function handleDelete() {
    if (selectedSlug) {
      onDeletePage(selectedSlug);
      setDeleteOpen(false);
    }
  }

  return (
    <aside className="w-56 border-r bg-muted/30 flex flex-col">
      <div className="p-4 font-semibold text-sm">Admin</div>
      <Separator />

      <div className="p-2">
        <Button
          variant={isNavSelected ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start"
          onClick={onSelectNav}
        >
          Navigation
        </Button>
      </div>

      <Separator />
      <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Pages
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {pages.map((page) => (
          <Button
            key={page.slug}
            variant={page.slug === selectedSlug ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => onSelectPage(page.slug)}
          >
            {page.title}
          </Button>
        ))}
      </nav>
      <Separator />
      <div className="p-2 space-y-2">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm" className="w-full" />
            }
          >
            + Add Page
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Page title"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="page-slug"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>
                Cancel
              </DialogClose>
              <Button onClick={handleAdd}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedSlug && (
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger
              render={
                <Button variant="ghost" size="sm" className="w-full text-destructive" />
              }
            >
              Delete Page
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete &quot;{selectedSlug}&quot;?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This will permanently delete this page and its content.
              </p>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>
                  Cancel
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </aside>
  );
}
