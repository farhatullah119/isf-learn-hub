<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo">
            <?php
            if ( has_custom_logo() ) {
                the_custom_logo();
            } else {
                bloginfo( 'name' );
            }
            ?>
        </a>
        <nav>
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'site-nav',
                'fallback_cb'    => 'isf_fallback_menu',
                'depth'          => 1,
            ) );
            ?>
        </nav>
    </div>
</header>

<?php
/**
 * Fallback menu when no menu is assigned.
 */
function isf_fallback_menu() {
    echo '<ul class="site-nav">';
    echo '<li><a href="#scholarships">Scholarships</a></li>';
    echo '<li><a href="#internships">Internships</a></li>';
    echo '<li><a href="#courses">Courses</a></li>';
    echo '<li><a href="#about">About</a></li>';
    echo '<li><a href="#contact">Contact</a></li>';
    echo '</ul>';
}
?>
