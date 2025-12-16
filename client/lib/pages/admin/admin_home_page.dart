import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../admin_service.dart';
import '../../widgets/common_app_bar.dart';

class AdminHomePage extends StatefulWidget {
  const AdminHomePage({super.key});

  @override
  State<AdminHomePage> createState() => _AdminHomePageState();
}

class _AdminHomePageState extends State<AdminHomePage> {
  final AdminService _adminService = AdminService();
  Map<String, dynamic> _stats = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    try {
      final stats = await _adminService.getDashboardStats();
      if (mounted) {
        setState(() {
          _stats = stats;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading data: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonAppBar(
        title: 'Admin Dashboard',
        additionalActions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.go('/profile'),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadStats,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Welcome to Admin Dashboard',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Stats Cards
                    GridView.count(
                      crossAxisCount: MediaQuery.of(context).size.width > 600
                          ? 3
                          : 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      children: [
                        if ((_stats['totalUsers'] ?? 0) > 0)
                          _buildStatCard(
                            'Total Users',
                            _stats['totalUsers']?.toString() ?? '0',
                            Icons.people,
                            Colors.blue,
                            () => _showIdInputDialog('user'),
                          ),
                        if ((_stats['activeDonors'] ?? 0) > 0)
                          _buildStatCard(
                            'Active Donors',
                            _stats['activeDonors']?.toString() ?? '0',
                            Icons.volunteer_activism,
                            Colors.green,
                            () => _showIdInputDialog('donor'),
                          ),
                        if ((_stats['pendingRequests'] ?? 0) > 0)
                          _buildStatCard(
                            'Pending Requests',
                            _stats['pendingRequests']?.toString() ?? '0',
                            Icons.pending,
                            Colors.orange,
                            () => context.go('/approve-requests'),
                          ),
                        if ((_stats['totalDonations'] ?? 0) > 0)
                          _buildStatCard(
                            'Total Donations',
                            'PKR ${_stats['totalDonations']?.toString() ?? '0'}',
                            Icons.attach_money,
                            Colors.purple,
                            () => context.go('/reports'),
                          ),
                        if ((_stats['activeVolunteers'] ?? 0) > 0)
                          _buildStatCard(
                            'Active Volunteers',
                            _stats['activeVolunteers']?.toString() ?? '0',
                            Icons.group,
                            Colors.teal,
                            () => _showIdInputDialog('volunteer'),
                          ),
                        if ((_stats['totalOrphans'] ?? 0) > 0)
                          _buildStatCard(
                            'Total Orphans',
                            _stats['totalOrphans']?.toString() ?? '0',
                            Icons.child_care,
                            Colors.pink,
                            () => _showIdInputDialog('orphan'),
                          ),
                        if ((_stats['totalOrphanages'] ?? 0) > 0)
                          _buildStatCard(
                            'Total Orphanages',
                            _stats['totalOrphanages']?.toString() ?? '0',
                            Icons.business,
                            Colors.indigo,
                            () => _showIdInputDialog('orphanage'),
                          ),
                      ],
                    ),
                    const SizedBox(height: 30),
                    // Quick Actions
                    const Text(
                      'Quick Actions',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    GridView.count(
                      crossAxisCount: MediaQuery.of(context).size.width > 600
                          ? 4
                          : 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.2,
                      children: [
                        _buildActionCard(
                          'Manage Users',
                          Icons.manage_accounts,
                          Colors.blue,
                          () => context.go('/manage-users'),
                        ),
                        _buildActionCard(
                          'Approve Requests',
                          Icons.check_circle,
                          Colors.green,
                          () => context.go('/approve-requests'),
                        ),

                        _buildActionCard(
                          'Reports',
                          Icons.bar_chart,
                          Colors.purple,
                          () => context.go('/reports'),
                        ),
                        _buildActionCard(
                          'Notifications',
                          Icons.notifications,
                          Colors.red,
                          () => context.go('/admin-notifications'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 32, color: color),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard(
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 24, color: color),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showIdInputDialog(String type) {
    final TextEditingController idController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Enter ${type.capitalize()} ID'),
          content: TextField(
            controller: idController,
            decoration: InputDecoration(
              hintText: 'Enter ID',
              border: const OutlineInputBorder(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () async {
                final id = idController.text.trim();
                if (id.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please enter an ID')),
                  );
                  return;
                }
                Navigator.of(context).pop();
                await _fetchAndShowDetails(type, id);
              },
              child: const Text('Fetch'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _fetchAndShowDetails(String type, String id) async {
    try {
      Map<String, dynamic> details;
      String title;

      switch (type) {
        case 'orphan':
          details = await _adminService.getOrphanById(id);
          title = 'Orphan Details';
          break;
        case 'donor':
          details = await _adminService.getDonorById(id);
          title = 'Donor Details';
          break;
        case 'orphanage':
          details = await _adminService.getOrphanageById(id);
          title = 'Orphanage Details';
          break;
        case 'volunteer':
          details = await _adminService.getVolunteerById(id);
          title = 'Volunteer Details';
          break;
        case 'user':
          // For users, we might need a different approach since there's no getUserById
          // Perhaps redirect to manage users page or show a message
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('User details not available via ID')),
          );
          return;
        default:
          return;
      }

      if (mounted) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text(title),
              content: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: _buildDetailsList(details, type),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Close'),
                ),
              ],
            );
          },
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading details: $e')));
      }
    }
  }

  List<Widget> _buildDetailsList(Map<String, dynamic> details, String type) {
    List<Widget> widgets = [];

    details.forEach((key, value) {
      if (key != '_id' && key != '__v' && key != 'password') {
        String displayKey = key
            .replaceAllMapped(
              RegExp(r'([A-Z])'),
              (match) => ' ${match.group(1)}',
            )
            .capitalize();

        String displayValue = value?.toString() ?? 'N/A';

        if (value is Map && value.containsKey('name')) {
          displayValue = value['name'];
        }

        widgets.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$displayKey: ',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Expanded(child: Text(displayValue)),
              ],
            ),
          ),
        );
      }
    });

    return widgets;
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}
