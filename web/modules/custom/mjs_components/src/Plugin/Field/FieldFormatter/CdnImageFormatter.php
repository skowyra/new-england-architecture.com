<?php

namespace Drupal\mjs_components\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\Attribute\FieldFormatter;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
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
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = [];

    foreach ($items as $delta => $item) {
      $element[$delta] = [
        '#type' => 'component',
        '#component' => 'mjs_components:mjs-image',
        '#props' => [
          'src' => $item->uri,
          'alt' => $item->title ?? '',
        ],
      ];
    }

    return $element;
  }

}
