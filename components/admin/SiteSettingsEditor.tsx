'use client';

import type { SiteConfig } from '../../lib/types';
import { Stack, TextField, SelectField, Heading } from '../../lib/ui';
import { allThemes, listThemes, listExpressiveThemes } from '../../lib/themes';
import { FONT_PAIRS } from '../../lib/font-pairs';

// Classic presets first, then the expressive generation, each labelled from the registry.
const themeOptions = [
  ...listThemes().map((name) => ({ value: name, label: `${allThemes[name].label} (classic)` })),
  ...listExpressiveThemes().map((name) => ({ value: name, label: `${allThemes[name].label} (expressive)` })),
];

const appearanceOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto (system)' },
];

const pairOptions = [
  { value: '', label: 'Custom (use heading + body fonts below)' },
  ...Object.values(FONT_PAIRS).map((p) => ({ value: p.name, label: `${p.label} (${p.display} + ${p.body})` })),
];

const motionEngineOptions = [
  { value: 'motion', label: 'Motion (default)' },
  { value: 'gsap', label: 'GSAP' },
];

const motionIntensityOptions = [
  { value: 'none', label: 'None' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'rich', label: 'Rich' },
];

interface SiteSettingsEditorProps {
  config: SiteConfig;
  onChange: (config: SiteConfig) => void;
}

export function SiteSettingsEditor({ config, onChange }: SiteSettingsEditorProps) {
  return (
    <Stack gap={5}>
      <Heading level={3} size="lg">Site settings</Heading>

      <TextField
        label="Site name"
        value={config.siteName}
        onChange={(siteName) => onChange({ ...config, siteName })}
      />

      <Heading level={4} size="md">Theme</Heading>
      <SelectField
        label="Theme preset"
        hint="Expressive presets add art direction, atmosphere, and motion."
        value={config.theme?.preset ?? 'editorial'}
        options={themeOptions}
        onChange={(v) => onChange({ ...config, theme: { ...config.theme, preset: v } })}
      />
      <SelectField
        label="Appearance"
        value={config.theme?.appearance ?? 'light'}
        options={appearanceOptions}
        onChange={(v) => onChange({ ...config, theme: { ...config.theme, appearance: v as 'light' | 'dark' | 'auto' } })}
      />
      <TextField
        label="Accent color (optional)"
        hint="Hex value that overrides the theme accent, e.g. #e0561f"
        value={config.theme?.accent ?? ''}
        onChange={(v) => onChange({ ...config, theme: { ...config.theme, accent: v || undefined } })}
      />

      <Heading level={4} size="md">Fonts</Heading>
      <SelectField
        label="Font pair (presets)"
        value={config.fonts.pair ?? ''}
        options={pairOptions}
        onChange={(v) => onChange({ ...config, fonts: { ...config.fonts, pair: v || undefined } })}
      />
      <TextField
        label="Heading font (CSS family)"
        hint="Used when no preset pair is selected"
        value={config.fonts.heading}
        onChange={(heading) => onChange({ ...config, fonts: { ...config.fonts, heading } })}
      />
      <TextField
        label="Body font (CSS family)"
        value={config.fonts.body}
        onChange={(body) => onChange({ ...config, fonts: { ...config.fonts, body } })}
      />

      <Heading level={4} size="md">Motion</Heading>
      <SelectField
        label="Animation engine"
        hint="Use GSAP for advanced motion sequences and scroll choreography."
        value={config.motion?.engine ?? 'motion'}
        options={motionEngineOptions}
        onChange={(v) =>
          onChange({
            ...config,
            motion: { ...config.motion, engine: v as 'motion' | 'gsap' },
          })
        }
      />
      <SelectField
        label="Motion intensity"
        value={config.motion?.intensity ?? 'subtle'}
        options={motionIntensityOptions}
        onChange={(v) =>
          onChange({
            ...config,
            motion: { ...config.motion, intensity: v as 'none' | 'subtle' | 'rich' },
          })
        }
      />

      <Heading level={4} size="md">Colors (legacy fallback)</Heading>
      <TextField
        label="Primary"
        hint="Hex value used when no theme preset is active"
        value={config.colors.primary}
        onChange={(primary) => onChange({ ...config, colors: { ...config.colors, primary } })}
      />
      <TextField
        label="Background"
        value={config.colors.background}
        onChange={(background) => onChange({ ...config, colors: { ...config.colors, background } })}
      />
      <TextField
        label="Text color"
        value={config.colors.text}
        onChange={(text) => onChange({ ...config, colors: { ...config.colors, text } })}
      />
    </Stack>
  );
}
