# Component & Deployment Workflow

## Modifying an existing SDC component (local)

### Safe changes — Canvas auto-migrates existing content
- Adding optional props
- Adding or removing slots
- Removing props
- Changing a prop from required to optional
- Adding a new required prop

### Unsafe changes — require manual migration
- Changing a prop's type or shape (e.g. `string` → `uri`)

### Steps

1. **Edit the component files** (`.component.yml`, `.twig`, `.css`, `.js`)

2. **Clear cache** — Canvas reprocesses the SDC and generates a new version hash
   ```bash
   vendor/bin/drush cr
   ```

3. **Verify** — confirm Canvas picked up the new props correctly
   ```bash
   vendor/bin/drush php:eval "
   print_r(\Drupal::entityTypeManager()
     ->getStorage('component')
     ->load('sdc.mjs_components.mjs-image')
     ->getSettings());
   "
   ```

4. **Export config** — capture the updated Canvas component config entity
   ```bash
   vendor/bin/drush config:export --yes
   ```

5. **Test in Canvas editor** — open a page, confirm new fields appear with defaults,
   and that existing instances auto-migrate when edited.

---

### Retiring or merging a component (local)

When replacing one component with another (e.g. merging `mjs-image-caption`
into `mjs-image`):

1. Update the replacement component files
2. `drush cr` — get new version hash
3. Migrate content DB rows to the new component
   ```bash
   vendor/bin/drush sql:query "UPDATE canvas_page__components \
     SET components_component_id = 'sdc.mjs_components.new-component', \
         components_component_version = 'new_hash' \
     WHERE components_component_id = 'sdc.mjs_components.old-component';"

   vendor/bin/drush sql:query "UPDATE canvas_page_revision__components \
     SET components_component_id = 'sdc.mjs_components.new-component', \
         components_component_version = 'new_hash' \
     WHERE components_component_id = 'sdc.mjs_components.old-component';"
   ```
4. Delete the old component directory
5. `drush config:delete canvas.component.sdc.mjs_components.old-component`
6. `drush config:export --yes`

---

# Deployment Checklist

## Standard deploy (code changes only)

```bash
# On live server
ssh root@157.230.190.247
su skowyra
cd /path/to/site

git pull
vendor/bin/drush cr
```

## Deploy with config changes

```bash
git pull
vendor/bin/drush config:import --yes
vendor/bin/drush cr
```

## Deploy with component changes (add/remove/merge SDC components)

When component changes include content DB migrations (e.g. retiring a component,
changing a component_id), run migrations BEFORE config import to avoid a 500
error window where the config entity is deleted but content still references it.

```bash
git pull

# 1. Run content DB migrations first
vendor/bin/drush sql:query "UPDATE canvas_page__components \
  SET components_component_id = 'sdc.module.new-component', \
      components_component_version = 'new_hash' \
  WHERE components_component_id = 'sdc.module.old-component';"

vendor/bin/drush sql:query "UPDATE canvas_page_revision__components \
  SET components_component_id = 'sdc.module.new-component', \
      components_component_version = 'new_hash' \
  WHERE components_component_id = 'sdc.module.old-component';"

# 2. Import config
vendor/bin/drush config:import --yes

# 3. Clear cache
vendor/bin/drush cr
```

## Troubleshooting

**CSS not updating after deploy**
Aggregated CSS files in `sites/default/files/css/` may be owned by the web
server user (www-data) and can't be deleted by the deploy user. Fix:

```bash
chown skowyra /path/to/sites/default/files/css/offending-file.css
vendor/bin/drush cr
```

**"Call to a member function requiresExplicitInput() on null" (500 error)**
Content rows in `canvas_page__components` are pointing to a component that no
longer exists in config. Run the DB migration SQL above, then `drush cr`.

**Finding the current version hash for a component**
```bash
vendor/bin/drush php:eval "
print \Drupal::entityTypeManager()
  ->getStorage('component')
  ->load('sdc.module_name.component-name')
  ->getActiveVersion();
"
```

**Checking which components content is using**
```bash
vendor/bin/drush sql:query "SELECT components_component_id, COUNT(*) as cnt \
  FROM canvas_page__components GROUP BY components_component_id;"
```

**"The property url is required" when saving a Link (or any `link`-type prop)**
Canvas's link field widget only commits a typed value to its saved state once
the autocomplete suggestions dropdown closes. If you type a path and save
immediately (e.g. hit Enter while suggestions are still showing), the value
can reach the server empty, and Canvas's schema validator rejects it as a
missing required prop — even though the path itself is valid. This isn't a
component bug (the path alias resolves fine); it's a timing quirk in Canvas's
`TextFieldAutocomplete` widget.

Workaround: after typing the URL, click elsewhere on the page (blur the
field) or wait a second for the suggestions dropdown to close, *then* save.
