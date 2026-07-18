<?php

/**
 * @file
 * Theme settings for the MJS theme.
 */

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function mjs_form_system_theme_settings_alter(array &$form, \Drupal\Core\Form\FormStateInterface $form_state): void {
  $form['mjs_design_tokens'] = [
    '#type' => 'details',
    '#title' => t('Design Tokens'),
    '#open' => TRUE,
  ];

  $form['mjs_design_tokens']['mjs_caption_font_family'] = [
    '#type' => 'textfield',
    '#title' => t('Caption font family'),
    '#default_value' => theme_get_setting('mjs_caption_font_family'),
    '#description' => t('CSS font-family value for image captions. Leave blank to use the theme default.'),
    '#placeholder' => '"Raleway", sans-serif',
  ];

  $form['mjs_design_tokens']['mjs_caption_font_size'] = [
    '#type' => 'textfield',
    '#title' => t('Caption font size'),
    '#default_value' => theme_get_setting('mjs_caption_font_size'),
    '#description' => t('CSS font-size value for image captions. Leave blank to use the theme default.'),
    '#placeholder' => '0.875rem',
  ];
}
