<?php

namespace Drupal\real_estate_photography\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Portfolio Projects' block.
 *
 * @Block(
 *   id = "portfolio_projects_block",
 *   admin_label = @Translation("Portfolio Projects"),
 *   category = @Translation("Real Estate Photography")
 * )
 */
class PortfolioProjectsBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new PortfolioProjectsBlock instance.
   *
   * @param array $configuration
   *   The plugin configuration.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'project_type' => 'all',
      'limit' => 6,
      'grid_columns' => 3,
      'show_featured' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);

    $config = $this->getConfiguration();

    $form['project_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Project Type'),
      '#default_value' => $config['project_type'],
      '#options' => [
        'all' => $this->t('All Projects'),
        'interior' => $this->t('Interior Photography'),
        'exterior' => $this->t('Exterior Photography'),
        '360_tour' => $this->t('360° Tours'),
        'floor_plan' => $this->t('Floor Plans'),
      ],
    ];

    $form['limit'] = [
      '#type' => 'number',
      '#title' => $this->t('Number of projects to display'),
      '#default_value' => $config['limit'],
      '#min' => 1,
      '#max' => 50,
    ];

    $form['grid_columns'] = [
      '#type' => 'select',
      '#title' => $this->t('Grid Columns'),
      '#default_value' => $config['grid_columns'],
      '#options' => [
        2 => $this->t('2 Columns'),
        3 => $this->t('3 Columns'),
        4 => $this->t('4 Columns'),
      ],
    ];

    $form['show_featured'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show featured project (spans 2 columns)'),
      '#default_value' => $config['show_featured'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['project_type'] = $values['project_type'];
    $this->configuration['limit'] = $values['limit'];
    $this->configuration['grid_columns'] = $values['grid_columns'];
    $this->configuration['show_featured'] = $values['show_featured'];
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    
    // Load portfolio projects
    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'portfolio_project')
      ->condition('status', 1)
      ->sort('created', 'DESC')
      ->range(0, $config['limit'])
      ->accessCheck(TRUE);

    // Filter by project type if specified
    if ($config['project_type'] !== 'all') {
      $query->condition('field_project_type', $config['project_type']);
    }

    $node_ids = $query->execute();
    
    if (empty($node_ids)) {
      return [
        '#markup' => $this->t('No portfolio projects found.'),
      ];
    }

    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($node_ids);
    $cards = [];

    foreach ($nodes as $delta => $node) {
      $is_featured = $config['show_featured'] && $delta === 0;
      
      $cards[] = [
        '#theme' => 'property_card',
        '#title' => $node->getTitle(),
        '#image' => $node->hasField('field_hero_image') && !$node->get('field_hero_image')->isEmpty() 
          ? $node->get('field_hero_image')->view(['label' => 'hidden']) 
          : NULL,
        '#location' => $node->hasField('field_location') && !$node->get('field_location')->isEmpty() 
          ? $node->get('field_location')->value 
          : NULL,
        '#type' => $node->hasField('field_project_type') && !$node->get('field_project_type')->isEmpty() 
          ? $node->get('field_project_type')->value 
          : NULL,
        '#url' => $node->toUrl()->toString(),
        '#wrapper_attributes' => [
          'class' => $is_featured ? ['property-card--featured'] : [],
        ],
      ];
    }

    return [
      '#theme' => 'item_list',
      '#items' => $cards,
      '#attributes' => [
        'class' => [
          'property-cards-grid',
          'property-cards-grid--' . $config['grid_columns'] . '-col',
        ],
      ],
      '#attached' => [
        'library' => ['real_estate_photography/portfolio-cards'],
      ],
    ];
  }

}
