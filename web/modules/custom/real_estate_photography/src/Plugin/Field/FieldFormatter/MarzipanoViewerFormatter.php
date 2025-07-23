<?php

namespace Drupal\real_estate_photography\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'marzipano_viewer' formatter.
 *
 * @FieldFormatter(
 *   id = "marzipano_viewer",
 *   label = @Translation("Marzipano 360° Viewer"),
 *   field_types = {
 *     "string",
 *     "uri"
 *   }
 * )
 */
class MarzipanoViewerFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'width' => '100%',
      'height' => '500px',
      'auto_rotate' => FALSE,
      'controls' => TRUE,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    return [
      'width' => [
        '#title' => $this->t('Width'),
        '#type' => 'textfield',
        '#default_value' => $this->getSetting('width'),
        '#description' => $this->t('Width of the viewer (e.g., 100%, 800px)'),
      ],
      'height' => [
        '#title' => $this->t('Height'),
        '#type' => 'textfield',
        '#default_value' => $this->getSetting('height'),
        '#description' => $this->t('Height of the viewer (e.g., 500px, 60vh)'),
      ],
      'auto_rotate' => [
        '#title' => $this->t('Auto-rotate'),
        '#type' => 'checkbox',
        '#default_value' => $this->getSetting('auto_rotate'),
        '#description' => $this->t('Automatically rotate the panorama'),
      ],
      'controls' => [
        '#title' => $this->t('Show controls'),
        '#type' => 'checkbox',
        '#default_value' => $this->getSetting('controls'),
        '#description' => $this->t('Show navigation controls'),
      ],
    ] + parent::settingsForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    $summary[] = $this->t('Dimensions: @width × @height', [
      '@width' => $this->getSetting('width'),
      '@height' => $this->getSetting('height'),
    ]);
    if ($this->getSetting('auto_rotate')) {
      $summary[] = $this->t('Auto-rotate enabled');
    }
    if (!$this->getSetting('controls')) {
      $summary[] = $this->t('Controls hidden');
    }
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach ($items as $delta => $item) {
      $viewer_id = 'marzipano-viewer-' . uniqid();
      
      $elements[$delta] = [
        '#theme' => 'marzipano_viewer',
        '#panorama_url' => $item->value,
        '#viewer_id' => $viewer_id,
        '#settings' => [
          'width' => $this->getSetting('width'),
          'height' => $this->getSetting('height'),
          'autoRotate' => $this->getSetting('auto_rotate'),
          'controls' => $this->getSetting('controls'),
        ],
        '#attached' => [
          'library' => ['real_estate_photography/marzipano'],
        ],
      ];
    }

    return $elements;
  }

}
