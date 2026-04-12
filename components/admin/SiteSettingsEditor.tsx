'use client';

import type { SiteConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SiteSettingsEditorProps {
  config: SiteConfig;
  onChange: (updates: Partial<SiteConfig>) => void;
}

const FONT_PRESETS = [
  'Georgia, serif',
  'system-ui, sans-serif',
  '"Helvetica Neue", Arial, sans-serif',
  '"Times New Roman", serif',
  'Menlo, Consolas, monospace',
  '"Inter", sans-serif',
];

export function SiteSettingsEditor({ config, onChange }: SiteSettingsEditorProps) {
  function updateColor(key: keyof SiteConfig['colors'], value: string) {
    onChange({
      colors: { ...config.colors, [key]: value },
    });
  }

  function updateFont(key: keyof SiteConfig['fonts'], value: string) {
    onChange({
      fonts: { ...config.fonts, [key]: value },
    });
  }

  return (
    <div className="space-y-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Site Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={config.siteName}
            onChange={(e) => onChange({ siteName: e.target.value })}
            placeholder="My Site"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Shown in the browser tab and site header
          </p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Fonts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Heading font</Label>
            <Input
              value={config.fonts.heading}
              onChange={(e) => updateFont('heading', e.target.value)}
              placeholder="Georgia, serif"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {FONT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updateFont('heading', preset)}
                  className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
                  style={{ fontFamily: preset }}
                >
                  {preset.split(',')[0].replace(/"/g, '')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Body font</Label>
            <Input
              value={config.fonts.body}
              onChange={(e) => updateFont('body', e.target.value)}
              placeholder="system-ui, sans-serif"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {FONT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updateFont('body', preset)}
                  className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
                  style={{ fontFamily: preset }}
                >
                  {preset.split(',')[0].replace(/"/g, '')}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ColorField
            label="Primary"
            hint="Links, buttons, accents"
            value={config.colors.primary}
            onChange={(v) => updateColor('primary', v)}
          />
          <ColorField
            label="Secondary"
            hint="Nav links, muted text"
            value={config.colors.secondary}
            onChange={(v) => updateColor('secondary', v)}
          />
          <ColorField
            label="Background"
            hint="Page background"
            value={config.colors.background}
            onChange={(v) => updateColor('background', v)}
          />
          <ColorField
            label="Text"
            hint="Main text color"
            value={config.colors.text}
            onChange={(v) => updateColor('text', v)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, hint, value, onChange }: ColorFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded-md border border-input cursor-pointer bg-background"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 font-mono text-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}
