<?php

namespace Drupal\real_estate_photography\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides an A-Frame 360° viewer block (CORS-friendly).
 *
 * @Block(
 *   id = "aframe_viewer_block",
 *   admin_label = @Translation("A-Frame 360° Viewer"),
 *   category = @Translation("Real Estate Photography")
 * )
 */
class AFrameViewerBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'panorama_url' => '',
      'width' => '100%',
      'height' => '500px',
      'title' => '',
      'autorotate' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();

    $form['panorama_url'] = [
      '#type' => 'url',
      '#title' => $this->t('Panorama URL'),
      '#description' => $this->t('Enter the URL of the 360° panorama image. A-Frame handles CORS better than Marzipano.'),
      '#default_value' => $config['panorama_url'],
      '#required' => TRUE,
    ];

    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Viewer Title'),
      '#description' => $this->t('Optional title to display above the viewer.'),
      '#default_value' => $config['title'],
    ];

    $form['width'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Width'),
      '#description' => $this->t('Viewer width (e.g., 100%, 800px).'),
      '#default_value' => $config['width'],
    ];

    $form['height'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Height'),
      '#description' => $this->t('Viewer height (e.g., 500px, 60vh).'),
      '#default_value' => $config['height'],
    ];

    $form['autorotate'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Auto-rotate'),
      '#description' => $this->t('Enable automatic rotation of the panorama.'),
      '#default_value' => $config['autorotate'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['panorama_url'] = $form_state->getValue('panorama_url');
    $this->configuration['title'] = $form_state->getValue('title');
    $this->configuration['width'] = $form_state->getValue('width');
    $this->configuration['height'] = $form_state->getValue('height');
    $this->configuration['autorotate'] = $form_state->getValue('autorotate');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    
    if (empty($config['panorama_url'])) {
      return [
        '#markup' => $this->t('Please configure the panorama URL in the block settings.'),
      ];
    }

    $viewer_id = 'aframe-viewer-' . $this->getPluginId() . '-' . substr(md5($config['panorama_url']), 0, 8);

    $build = [
      '#theme' => 'aframe_viewer',
      '#panorama_url' => $config['panorama_url'],
      '#viewer_id' => $viewer_id,
      '#width' => $config['width'],
      '#height' => $config['height'],
      '#title' => $config['title'],
      '#autorotate' => $config['autorotate'],
      '#attached' => [
        'library' => [
          'real_estate_photography/aframe_viewer',
        ],
        'html_head' => [
          [
            [
              '#tag' => 'script',
              '#attributes' => [
                'src' => 'https://aframe.io/releases/1.4.0/aframe.min.js',
              ],
            ],
            'aframe_library'
          ]
        ],
      ],
    ];

    return $build;
  }

}
