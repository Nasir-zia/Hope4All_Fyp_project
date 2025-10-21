import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NavigationService {
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static void navigateTo(String routeName, {Object? extra}) {
    navigatorKey.currentContext?.go(routeName, extra: extra);
  }

  static void navigateToNamed(
    String routeName, {
    Map<String, String> pathParameters = const {},
    Object? extra,
  }) {
    navigatorKey.currentContext?.goNamed(
      routeName,
      pathParameters: pathParameters,
      extra: extra,
    );
  }

  static void push(String routeName, {Object? extra}) {
    navigatorKey.currentContext?.push(routeName, extra: extra);
  }

  static void pushNamed(
    String routeName, {
    Map<String, String> pathParameters = const {},
    Object? extra,
  }) {
    navigatorKey.currentContext?.pushNamed(
      routeName,
      pathParameters: pathParameters,
      extra: extra,
    );
  }

  static void pop() {
    navigatorKey.currentContext?.pop();
  }

  static String getInitialRoute(String? role) {
    if (role == null) {
      return '/login';
    }
    switch (role) {
      case 'donor':
        return '/donor-home';
      case 'orphan':
        return '/orphan-dashboard';
      case 'admin':
        return '/admin-dashboard';
      case 'volunteer':
        return '/volunteer-home';
      default:
        return '/home';
    }
  }

  static List<String> getAllowedRoutes(String? role) {
    if (role == null) {
      return ['/login', '/register'];
    }
    switch (role) {
      case 'donor':
        return [
          '/donor-dashboard',
          '/donate',
          '/donation-history',
          '/profile',
          '/donor-form',
        ];
      case 'orphan':
        return [
          '/orphan-dashboard',
          '/orphan-submit-request',
          '/orphan-track-requests',
          '/orphan-learning-resources',
          '/orphan-profile',
        ];
      case 'admin':
        return [
          '/admin-dashboard',
          '/manage-users',
          '/approve-requests',
          '/inventory-management',
          '/reports',
          '/admin-notifications',
          '/profile',
        ];
      case 'volunteer':
        return [
          '/volunteer-home',
          '/volunteer-task-list',
          '/volunteer-chat',
          '/volunteer-profile',
        ];
      default:
        return ['/home'];
    }
  }
}
