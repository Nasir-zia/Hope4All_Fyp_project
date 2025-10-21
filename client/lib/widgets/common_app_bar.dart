import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class CommonAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? additionalActions;
  final bool showBackButton;
  final String? backRoute;

  const CommonAppBar({
    super.key,
    required this.title,
    this.additionalActions,
    this.showBackButton = true,
    this.backRoute,
  });

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userRole = authProvider.userRole;
    
    String homeRoute = '/welcome';
    switch (userRole) {
      case 'donor':
        homeRoute = '/donor-home';
        break;
      case 'orphan':
        homeRoute = '/orphan-home';
        break;
      case 'volunteer':
        homeRoute = '/volunteer-home';
        break;
      case 'admin':
        homeRoute = '/admin-dashboard';
        break;
      case 'orphanage':
        homeRoute = '/orphanage-dashboard';
        break;
    }

    return AppBar(
      title: Text(title),
      leading: showBackButton
          ? IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () {
                if (backRoute != null) {
                  context.go(backRoute!);
                } else {
                  context.go(homeRoute);
                }
              },
            )
          : null,
      automaticallyImplyLeading: showBackButton,
      actions: [
        if (additionalActions != null) ...additionalActions!,
        IconButton(
          icon: const Icon(Icons.logout),
          tooltip: 'Logout',
          onPressed: () async {
            await authProvider.logout();
            if (context.mounted) {
              context.go('/welcome');
            }
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
