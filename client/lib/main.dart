import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'services/navigation_service.dart';
import 'theme/app_theme.dart';
import 'pages/common/auth_screen.dart';
import 'pages/common/role_selection_screen.dart';
import 'pages/common/login_page.dart';
import 'pages/common/register_page.dart';
import 'pages/donor/donate_page.dart';
import 'pages/donor/donation_history_page.dart';
import 'pages/donor/donor_registration_form.dart';
import 'pages/donor/donor_home_page.dart';
import 'pages/donor/donor_notifications_page.dart';
import 'pages/donor/donor_profile_page.dart';
import 'pages/donor/donor_service_page.dart';
import 'pages/orphan/orphan_registration_form.dart';
import 'pages/orphan/orphan_home_page.dart';
import 'pages/orphan/orphan_submit_request_page.dart';
import 'pages/orphan/orphan_track_requests_page.dart';
import 'pages/orphan/orphan_learning_resources_page.dart';
import 'pages/orphan/orphan_profile_page.dart';
import 'pages/volunteer/volunteer_home_page.dart';
import 'pages/volunteer/volunteer_task_list_page.dart';
import 'pages/volunteer/volunteer_chat_page.dart';
import 'pages/volunteer/volunteer_profile_page.dart';
import 'pages/admin/admin_home_page.dart';
import 'pages/admin/admin_user_management_page.dart';
import 'pages/admin/admin_approve_requests_page.dart';
import 'pages/admin/admin_inventory_management_page.dart';
import 'pages/admin/admin_reports_analytics_page.dart';
import 'pages/admin/admin_notifications_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => AuthProvider())],
      child: MaterialApp.router(
        title: 'Hope4All',
        theme: AppTheme.lightTheme,
        routerConfig: _router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  initialLocation: '/auth',
  redirect: (context, state) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final isAuthenticated = authProvider.isAuthenticated;
    final userRole = authProvider.userRole;

    final isAuthRoute = state.matchedLocation == '/auth';
    final isRoleSelectionRoute = state.matchedLocation == '/role-selection';
    final isLoginRoute = state.matchedLocation == '/login';
    final isRegisterRoute = state.matchedLocation == '/register';

    // If not authenticated and not on initial screens, redirect to auth
    if (!isAuthenticated &&
        !isAuthRoute &&
        !isRoleSelectionRoute &&
        !isLoginRoute &&
        !isRegisterRoute) {
      return '/auth';
    }

    // If authenticated and on auth screens, redirect to dashboard
    if (isAuthenticated &&
        (isLoginRoute ||
            isRegisterRoute ||
            isAuthRoute ||
            isRoleSelectionRoute)) {
      return NavigationService.getInitialRoute(userRole);
    }

    // Role-based access control
    if (isAuthenticated) {
      final allowedRoutes = NavigationService.getAllowedRoutes(userRole);
      final currentRoute = state.matchedLocation;
      if (!allowedRoutes.contains(currentRoute)) {
        return NavigationService.getInitialRoute(userRole);
      }
    }

    return null;
  },
  routes: [
    GoRoute(path: '/auth', builder: (context, state) => const AuthScreen()),
    GoRoute(
      path: '/role-selection',
      builder: (context, state) => const RoleSelectionScreen(),
    ),
    GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(
      path: '/donor-form',
      builder: (context, state) => const DonorRegistrationForm(),
    ),
    GoRoute(
      path: '/orphan-form',
      builder: (context, state) => const OrphanRegistrationForm(),
    ),
    GoRoute(
      path: '/donor-dashboard',
      builder: (context, state) => const DonorDashboardPage(),
    ),
    GoRoute(
      path: '/orphanage-dashboard',
      builder: (context, state) => const OrphanageDashboardPage(),
    ),
    GoRoute(
      path: '/admin-dashboard',
      builder: (context, state) => const AdminHomePage(),
    ),
    GoRoute(path: '/donate', builder: (context, state) => const DonatePage()),
    GoRoute(
      path: '/donation-history',
      builder: (context, state) => const DonationHistoryPage(),
    ),
    GoRoute(path: '/profile', builder: (context, state) => const ProfilePage()),
    GoRoute(
      path: '/orphan-dashboard',
      builder: (context, state) => const OrphanHomePage(),
    ),
    GoRoute(
      path: '/orphan-submit-request',
      builder: (context, state) => const OrphanSubmitRequestPage(),
    ),
    GoRoute(
      path: '/orphan-track-requests',
      builder: (context, state) => const OrphanTrackRequestsPage(),
    ),
    GoRoute(
      path: '/orphan-learning-resources',
      builder: (context, state) => const OrphanLearningResourcesPage(),
    ),
    GoRoute(
      path: '/orphan-profile',
      builder: (context, state) => const OrphanProfilePage(),
    ),
    GoRoute(
      path: '/donor-home',
      builder: (context, state) => const DonorHomePage(),
    ),
    GoRoute(
      path: '/donor-notifications',
      builder: (context, state) => const DonorNotificationsPage(),
    ),
    GoRoute(
      path: '/donor-profile',
      builder: (context, state) => const DonorProfilePage(),
    ),
    GoRoute(
      path: '/donor-service',
      builder: (context, state) => const DonorServicePage(),
    ),
    GoRoute(
      path: '/volunteer-home',
      builder: (context, state) => const VolunteerHomePage(),
    ),
    GoRoute(
      path: '/volunteer-task-list',
      builder: (context, state) => const VolunteerTaskListPage(),
    ),
    GoRoute(
      path: '/volunteer-chat',
      builder: (context, state) => const VolunteerChatPage(),
    ),
    GoRoute(
      path: '/volunteer-profile',
      builder: (context, state) => const VolunteerProfilePage(),
    ),
    GoRoute(
      path: '/manage-users',
      builder: (context, state) => const AdminUserManagementPage(),
    ),
    GoRoute(
      path: '/approve-requests',
      builder: (context, state) => const AdminApproveRequestsPage(),
    ),
    GoRoute(
      path: '/inventory-management',
      builder: (context, state) => const AdminInventoryManagementPage(),
    ),
    GoRoute(
      path: '/reports',
      builder: (context, state) => const AdminReportsAnalyticsPage(),
    ),
    GoRoute(
      path: '/admin-notifications',
      builder: (context, state) => const AdminNotificationsPage(),
    ),
  ],
);

class DonorDashboardPage extends StatelessWidget {
  const DonorDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Donor Dashboard')),
      body: const Center(child: Text('Donor Dashboard')),
    );
  }
}

class OrphanageDashboardPage extends StatelessWidget {
  const OrphanageDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Orphanage Dashboard')),
      body: const Center(child: Text('Orphanage Dashboard')),
    );
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: const Center(child: Text('Profile Page')),
    );
  }
}
