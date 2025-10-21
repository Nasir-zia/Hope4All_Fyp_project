import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class LogoutHelper {
  /// Show logout confirmation dialog
  static Future<void> showLogoutDialog(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await logout(context);
    }
  }

  /// Logout without confirmation
  static Future<void> logout(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.logout();
    
    if (context.mounted) {
      context.go('/welcome');
    }
  }

  /// Get home route based on user role
  static String getHomeRoute(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userRole = authProvider.userRole;
    
    switch (userRole) {
      case 'donor':
        return '/donor-home';
      case 'orphan':
        return '/orphan-home';
      case 'volunteer':
        return '/volunteer-home';
      case 'admin':
        return '/admin-dashboard';
      case 'orphanage':
        return '/orphanage-dashboard';
      default:
        return '/welcome';
    }
  }

  /// Create logout icon button
  static Widget logoutButton(BuildContext context, {bool showConfirmation = false}) {
    return IconButton(
      icon: const Icon(Icons.logout),
      tooltip: 'Logout',
      onPressed: () async {
        if (showConfirmation) {
          await showLogoutDialog(context);
        } else {
          await logout(context);
        }
      },
    );
  }

  /// Create back button that goes to appropriate home
  static Widget backToHomeButton(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        final homeRoute = getHomeRoute(context);
        context.go(homeRoute);
      },
    );
  }
}
