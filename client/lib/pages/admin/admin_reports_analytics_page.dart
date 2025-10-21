import 'package:flutter/material.dart';
import '../../admin_service.dart';
import '../../widgets/common_app_bar.dart';

class AdminReportsAnalyticsPage extends StatefulWidget {
  const AdminReportsAnalyticsPage({super.key});

  @override
  State<AdminReportsAnalyticsPage> createState() =>
      _AdminReportsAnalyticsPageState();
}

class _AdminReportsAnalyticsPageState extends State<AdminReportsAnalyticsPage> {
  final AdminService _adminService = AdminService();
  Map<String, dynamic> _reportsData = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadReportsData();
  }

  Future<void> _loadReportsData() async {
    try {
      final data = await _adminService.getReportsData();
      setState(() {
        _reportsData = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading reports data: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonAppBar(title: 'Reports & Analytics'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadReportsData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Analytics Dashboard',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Donation Trends Chart (Placeholder)
                    _buildChartSection(
                      'Donation Trends (Last 6 Months)',
                      _buildDonationTrendsChart(),
                    ),
                    const SizedBox(height: 20),
                    // User Activity Distribution
                    _buildChartSection(
                      'User Activity Distribution',
                      _buildUserActivityChart(),
                    ),
                    const SizedBox(height: 20),
                    // Request Status Summary
                    _buildChartSection(
                      'Request Status Summary',
                      _buildRequestStatusChart(),
                    ),
                    const SizedBox(height: 20),
                    // Key Metrics Cards
                    const Text(
                      'Key Metrics',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    GridView.count(
                      crossAxisCount: MediaQuery.of(context).size.width > 600
                          ? 2
                          : 1,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 2.5,
                      children: [
                        GestureDetector(
                          onTap: () => _showIdInputDialog('Active User'),
                          child: _buildMetricCard(
                            'Active Users',
                            '${_reportsData['keyMetrics']?['activeUsers'] ?? 0}',
                            Icons.people,
                            Colors.blue,
                          ),
                        ),
                        _buildMetricCard(
                          'Success Rate',
                          '${_reportsData['keyMetrics']?['successRate']?.toStringAsFixed(1) ?? '0.0'}%',
                          Icons.trending_up,
                          Colors.orange,
                        ),
                        _buildMetricCard(
                          'Avg. Response Time',
                          '${_reportsData['keyMetrics']?['avgResponseTime']?.toStringAsFixed(1) ?? '0.0'} days',
                          Icons.schedule,
                          Colors.purple,
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    // Export Reports Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => _showExportDialog(),
                        icon: const Icon(Icons.download),
                        label: const Text('Export Reports'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildChartSection(String title, Widget chart) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            SizedBox(height: 200, child: chart),
          ],
        ),
      ),
    );
  }

  Widget _buildDonationTrendsChart() {
    final trends = _reportsData['donationTrends'] as List? ?? [];
    return CustomPaint(
      painter: DonationTrendsPainter(trends, showAmounts: false),
      child: Container(),
    );
  }

  Widget _buildUserActivityChart() {
    final userActivity = _reportsData['userActivity'] as List? ?? [];
    return Column(
      children: userActivity.map<Widget>((activity) {
        final percentage = activity['percentage'] as int? ?? 0;
        final role = activity['role'] as String? ?? '';
        final count = activity['count'] as int? ?? 0;

        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    role,
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                  Text('$count users ($percentage%)'),
                ],
              ),
              const SizedBox(height: 4),
              LinearProgressIndicator(
                value: percentage / 100,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(_getRoleColor(role)),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildRequestStatusChart() {
    final requestStatus = _reportsData['requestStatus'] as List? ?? [];
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: requestStatus.map<Widget>((status) {
        final statusName = status['status'] as String? ?? '';
        final count = status['count'] as int? ?? 0;

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: _getStatusColor(statusName).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: _getStatusColor(statusName), width: 2),
          ),
          child: Column(
            children: [
              Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: _getStatusColor(statusName),
                ),
              ),
              Text(
                statusName,
                style: TextStyle(
                  color: _getStatusColor(statusName),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMetricCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    value,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    title,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getRoleColor(String role) {
    switch (role) {
      case 'Donors':
        return Colors.green;
      case 'Orphans':
        return Colors.blue;
      case 'Volunteers':
        return Colors.orange;
      case 'Orphanages':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Approved':
        return Colors.green;
      case 'Pending':
        return Colors.orange;
      case 'Rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  void _showIdInputDialog(String entityType) {
    final TextEditingController idController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Enter $entityType ID'),
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
              if (id.isNotEmpty) {
                Navigator.of(context).pop();
                await _fetchAndShowEntityDetails(entityType, id);
              }
            },
            child: const Text('Fetch'),
          ),
        ],
      ),
    );
  }

  Future<void> _fetchAndShowEntityDetails(String entityType, String id) async {
    try {
      Map<String, dynamic> data;
      if (entityType == 'Active User') {
        data = await _adminService.getUserById(id);
      } else {
        throw Exception('Unknown entity type');
      }

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('$entityType Details'),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: data.entries.map((entry) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Text('${entry.key}: ${entry.value}'),
                );
              }).toList(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error fetching $entityType details: $e')),
      );
    }
  }

  void _showExportDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Export Reports'),
        content: const Text(
          'Choose the format and date range for your report export.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              // Placeholder for export functionality
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Report export feature coming soon!'),
                ),
              );
            },
            child: const Text('Export PDF'),
          ),
        ],
      ),
    );
  }
}

// Simple chart painter for donation trends
class DonationTrendsPainter extends CustomPainter {
  final List trends;
  final bool showAmounts;

  DonationTrendsPainter(this.trends, {this.showAmounts = true});

  @override
  void paint(Canvas canvas, Size size) {
    if (trends.isEmpty) return;

    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final maxAmount = trends
        .map((t) => t['amount'] as int? ?? 0)
        .reduce((a, b) => a > b ? a : b);

    final points = <Offset>[];
    for (int i = 0; i < trends.length; i++) {
      final amount = trends[i]['amount'] as int? ?? 0;
      final x = (i / (trends.length - 1)) * size.width;
      final y = size.height - (amount / maxAmount) * size.height;
      points.add(Offset(x, y));
    }

    final path = Path();
    path.moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    canvas.drawPath(path, paint);

    // Draw points
    final pointPaint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, pointPaint);
    }

    if (showAmounts) {
      // Draw amount labels (removed as per requirement)
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
