<?php
/**
 * ISF Learning Hub Theme Functions
 *
 * @package ISF_Learning_Hub
 * @since   1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue styles and scripts.
 */
function isf_enqueue_assets() {
    // Google Fonts
    wp_enqueue_style(
        'isf-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap',
        array(),
        null
    );

    // Theme stylesheet
    wp_enqueue_style(
        'isf-style',
        get_stylesheet_uri(),
        array( 'isf-google-fonts' ),
        wp_get_theme()->get( 'Version' )
    );

    // Custom JS
    wp_enqueue_script(
        'isf-scripts',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        wp_get_theme()->get( 'Version' ),
        true
    );
}
add_action( 'wp_enqueue_scripts', 'isf_enqueue_assets' );

/**
 * Theme setup.
 */
function isf_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'custom-logo', array(
        'height'      => 64,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );

    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'isf-learning-hub' ),
        'footer'  => __( 'Footer Menu', 'isf-learning-hub' ),
    ) );
}
add_action( 'after_setup_theme', 'isf_theme_setup' );
