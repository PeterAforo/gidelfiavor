<?php
/**
 * Admin Index - Redirects to dashboard or login
 */
require_once '../config/config.php';

if (isLoggedIn()) {
    redirect(SITE_URL . '/admin/dashboard.php');
} else {
    redirect(SITE_URL . '/admin/login.php');
}
