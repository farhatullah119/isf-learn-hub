<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <h4><?php bloginfo( 'name' ); ?></h4>
                <p><?php bloginfo( 'description' ); ?></p>
            </div>
            <div class="footer-col">
                <h4>Quick Links</h4>
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'menu_class'     => '',
                    'fallback_cb'    => false,
                    'depth'          => 1,
                ) );
                ?>
            </div>
            <div class="footer-col">
                <h4>Contact</h4>
                <ul>
                    <li>Email: info@isflearninghub.org</li>
                    <li><a href="https://whatsapp.com/channel/0029VauLh2hFXUucg7QyOg2r" target="_blank" rel="noopener">WhatsApp Channel</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?php echo date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. All rights reserved.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
