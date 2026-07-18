# Design Tokens via Theme Settings

This documents the pattern for exposing CSS design tokens (font sizes, font families, colors, etc.) as editable fields in the Drupal theme settings UI, so editors can change them without touching CSS files.

## How it works

There are four pieces, each with a distinct responsibility:

### 1. CSS defaults — `css/style.css`

The `:root` block defines default values for every token as CSS custom properties:

```css
:root {
  --caption-font-family: var(--font-sans);
  --caption-font-size: 0.875rem;
}
```

These are the fallback values. If an editor has never touched the theme settings, the site uses these. Components reference them via `var(--caption-font-size)` rather than hardcoded values.

### 2. Component CSS — `mjs-image.css` (and other components)

Instead of hardcoding values, components use the CSS variables:

```css
.mjs-image__caption {
  font-family: var(--caption-font-family);
  font-size: var(--caption-font-size);
}
```

This is the only change needed in a component to make it token-aware. The variable resolves to the `:root` default unless overridden.

### 3. Theme settings form — `theme-settings.php`

This file adds custom fields to the theme's settings page at `/admin/appearance/settings/mjs`. Drupal calls `hook_form_system_theme_settings_alter()` when building that form:

```php
function mjs_form_system_theme_settings_alter(array &$form, ...) {
  $form['mjs_design_tokens']['mjs_caption_font_size'] = [
    '#type' => 'textfield',
    '#title' => t('Caption font size'),
    '#default_value' => theme_get_setting('mjs_caption_font_size'),
  ];
}
```

Drupal automatically saves submitted values into config storage (database). `theme_get_setting()` retrieves them. No custom storage code needed.

### 4. Preprocess + template — `mjs.theme` and `html.html.twig`

`hook_preprocess_html()` runs on every page render. It reads the saved settings and builds an inline CSS string:

```php
function mjs_preprocess_html(array &$variables): void {
  $caption_font_size = theme_get_setting('mjs_caption_font_size');
  if (!empty($caption_font_size)) {
    $css_vars[] = '--caption-font-size: ' . $caption_font_size . ';';
  }
  $variables['mjs_design_tokens'] = ':root { ' . implode(' ', $css_vars) . ' }';
}
```

The string is passed to the template as a variable. `html.html.twig` outputs it as an inline `<style>` tag in `<head>`, after the main stylesheet:

```twig
<css-placeholder token="{{ placeholder_token }}">
{% if mjs_design_tokens %}
  <style id="mjs-design-tokens">{{ mjs_design_tokens }}</style>
{% endif %}
```

Because this `<style>` tag comes after the aggregated CSS files, it overrides the `:root` defaults defined in `style.css`. CSS cascade order is what makes this work — no `!important` needed.

---

## Why not `hook_page_attachments`?

This hook looks like the right place to attach things to `<head>`, but Drupal only invokes it for **modules**, not themes. The preprocess + template approach is the correct equivalent for themes.

---

## Adding more tokens

To add a new token (e.g. body font size):

1. **`css/style.css`** — add `--body-font-size: 1rem;` to `:root`
2. **Component CSS** — replace any hardcoded value with `var(--body-font-size)`
3. **`theme-settings.php`** — add a new `textfield` for `mjs_body_font_size`
4. **`mjs.theme`** — add a `theme_get_setting('mjs_body_font_size')` check to the preprocess function

No template changes needed — the existing `mjs_design_tokens` variable handles any number of tokens.
