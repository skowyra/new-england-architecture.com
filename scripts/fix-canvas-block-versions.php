<?php

/**
 * @file
 * One-off maintenance script: re-baselines config/sync/canvas.component.block.*.yml
 * from this environment's current active config.
 *
 * Canvas's versioned "component" config entities (VersionedConfigEntityBase)
 * cannot be updated via `drush cim` when their active_version differs from
 * what's already active on the target site — core's generic
 * ConfigEntityStorage::updateFromStorageRecord() overwrites active_version
 * without updating the entity's internally-tracked loadedVersion, which trips
 * Canvas's version-consistency guard in VersionedConfigEntityBase::preSave().
 * These entities are meant to be kept current by Canvas's own module update
 * hooks (`drush updb`), not by config sync.
 *
 * Run this on an environment where `updb` has already brought these block
 * components up to date, to write its current active state back into
 * config/sync so `drush cim` sees no diff for them and leaves them alone.
 *
 * Usage: vendor/bin/drush php:script scripts/fix-canvas-block-versions.php
 */

$names = [
  'canvas.component.block.announce_block',
  'canvas.component.block.local_actions_block',
  'canvas.component.block.local_tasks_block',
  'canvas.component.block.page_title_block',
  'canvas.component.block.help_block',
  'canvas.component.block.search_form_block',
  'canvas.component.block.shortcuts',
  'canvas.component.block.system_powered_by_block',
  'canvas.component.block.system_messages_block',
  'canvas.component.block.system_clear_cache_block',
  'canvas.component.block.system_breadcrumb_block',
  'canvas.component.block.system_branding_block',
  'canvas.component.block.system_menu_block.account',
  'canvas.component.block.system_menu_block.admin',
  'canvas.component.block.system_menu_block.footer',
  'canvas.component.block.system_menu_block.main',
  'canvas.component.block.system_menu_block.tools',
  'canvas.component.block.user_login_block',
  'canvas.component.block.views_block.comments_recent-block_1',
  'canvas.component.block.views_block.content_recent-block_1',
  'canvas.component.block.views_block.who_s_new-block_1',
  'canvas.component.block.views_block.who_s_online-who_s_online_block',
];

$storage = \Drupal::service('config.storage');
$dir = dirname(\Drupal::service('config.storage.sync')->getFilePath('system.performance'));

foreach ($names as $name) {
  $data = $storage->read($name);
  $yaml = \Drupal\Component\Serialization\Yaml::encode($data);
  file_put_contents($dir . '/' . $name . '.yml', $yaml);
  print $name . ' -> rewritten' . PHP_EOL;
}
