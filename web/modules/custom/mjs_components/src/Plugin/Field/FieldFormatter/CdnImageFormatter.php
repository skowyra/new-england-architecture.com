<?php

namespace Drupal\mjs_components\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\Attribute\FieldFormatter;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Renders a link field's URL as an mjs-image component.
 */
#[FieldFormatter(
  id: 'mjs_cdn_image',
  label: new TranslatableMarkup('CDN Image'),
  field_types: [
    'link',
  ],
)]
class CdnImageFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'max_width' => '',
      'thumbnail' => FALSE,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $form = parent::settingsForm($form, $form_state);

    $form['max_width'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Max width'),
      '#description' => $this->t('CSS max-width value, e.g. 300px. Leave blank for no limit.'),
      '#default_value' => $this->getSetting('max_width'),
    ];

    $form['thumbnail'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Display as thumbnail'),
      '#description' => $this->t('Crops the image to a square and fills the max width, instead of preserving its original aspect ratio.'),
      '#default_value' => $this->getSetting('thumbnail'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = parent::settingsSummary();

    $max_width = $this->getSetting('max_width');
    $summary[] = !empty($max_width)
      ? $this->t('Max width: @width', ['@width' => $max_width])
      : $this->t('No max width');

    if ($this->getSetting('thumbnail')) {
      $summary[] = $this->t('Cropped to a square thumbnail');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = [];
    $max_width = $this->getSetting('max_width');
    $thumbnail = $this->getSetting('thumbnail');

    foreach ($items as $delta => $item) {
      $image = [
        '#type' => 'component',
        '#component' => 'mjs_components:mjs-image',
        '#props' => [
          'src' => $item->uri,
          'alt' => $item->title ?? '',
        ],
      ];

      if (empty($max_width) && !$thumbnail) {
        $element[$delta] = $image;
        continue;
      }

      $classes = $thumbnail ? ['mjs-image--thumbnail'] : [];
      $style = !empty($max_width) ? 'max-width: ' . $max_width . ';' : '';

      $element[$delta] = [
        '#type' => 'container',
        '#attributes' => [
          'class' => $classes,
          'style' => $style,
        ],
        'image' => $image,
      ];
    }

    return $element;
  }

}
