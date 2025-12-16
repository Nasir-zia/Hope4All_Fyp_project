import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/progress_card.dart';
import '../../widgets/animated_card.dart';
import '../../widgets/education_illustration.dart';
import '../../widgets/common_app_bar.dart';
import '../../providers/auth_provider.dart';
import '../../orphan_service.dart';
import '../../donor_service.dart';

class OrphanHomePage extends StatefulWidget {
  const OrphanHomePage({super.key});

  @override
  State<OrphanHomePage> createState() => _OrphanHomePageState();
}

class _OrphanHomePageState extends State<OrphanHomePage>
    with SingleTickerProviderStateMixin {
  final OrphanService _orphanService = OrphanService();
  final DonorService _donorService = DonorService();
  List<Map<String, dynamic>> _requests = [];
  List<Map<String, dynamic>> _donations = [];
  bool _isLoading = true;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );

    _loadData();
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;

      if (userId != null) {
        // Get orphan profile to find orphanId
        final profile = await _orphanService.getOrphanProfile(userId);
        final orphanId = profile['orphan']['_id'];

        // Fetch requests and donations
        final requests = await _orphanService.getRequestsByOrphan(orphanId);
        final donations = await _donorService.getDonationHistory(orphanId);

        setState(() {
          _requests = List<Map<String, dynamic>>.from(requests);
          _donations = List<Map<String, dynamic>>.from(donations);
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading data: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonAppBar(
        title: 'Orphan Dashboard',
        additionalActions: [
          IconButton(
            icon: Icon(AppTheme.heartIcon),
            onPressed: () => context.go('/orphan-profile'),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () async {
              final authProvider = Provider.of<AuthProvider>(
                context,
                listen: false,
              );
              await authProvider.logout();
              if (context.mounted) {
                context.go('/welcome');
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: AppTheme.lightGreen))
          : FadeTransition(
              opacity: _fadeAnimation,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        EducationIllustration(
                          size: 50,
                          color: AppTheme.skyBlue,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            'Welcome to Your Dashboard',
                            style: Theme.of(context).textTheme.headlineMedium
                                ?.copyWith(color: Colors.black87),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 30),
                    Expanded(
                      child: ListView(
                        children: [
                          AnimatedCard(
                            child: _buildSection(
                              'Education Requests',
                              _requests,
                              () => context.go('/orphan-submit-request'),
                              AppTheme.bookIcon,
                            ),
                          ),
                          const SizedBox(height: 20),
                          AnimatedCard(
                            child: _buildSection(
                              'Donation Status',
                              _donations,
                              () => context.go('/orphan-track-requests'),
                              AppTheme.volunteerIcon,
                            ),
                          ),
                          const SizedBox(height: 20),
                          AnimatedCard(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: ElevatedButton.icon(
                                onPressed: () =>
                                    context.go('/orphan-learning-resources'),
                                icon: Icon(
                                  AppTheme.bookIcon,
                                  color: AppTheme.white,
                                ),
                                label: const Text('Learning Resources'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.lightGreen,
                                  minimumSize: const Size(double.infinity, 50),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
      floatingActionButton: AnimatedCard(
        child: FloatingActionButton(
          onPressed: () => context.go('/orphan-submit-request'),
          backgroundColor: AppTheme.skyBlue,
          child: Icon(Icons.add, color: AppTheme.white),
        ),
      ),
    );
  }

  Widget _buildSection(
    String title,
    List<Map<String, dynamic>> items,
    VoidCallback onViewAll,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, color: AppTheme.skyBlue, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontSize: 18,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: onViewAll,
                child: Text(
                  'View All',
                  style: TextStyle(color: AppTheme.skyBlue),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...items
              .take(2)
              .map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: ProgressCard(
                    title: item['type'] ?? item['donor'],
                    subtitle: 'Status: ${item['status']}',
                    progress: item['progress'] ?? 0.0,
                    icon: icon,
                    onTap: () => context.go('/orphan-track-requests'),
                  ),
                ),
              ),
        ],
      ),
    );
  }
}
