import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../widgets/common_app_bar.dart';
import '../../providers/auth_provider.dart';
import '../../orphan_service.dart';

class OrphanTrackRequestsPage extends StatefulWidget {
  const OrphanTrackRequestsPage({super.key});

  @override
  State<OrphanTrackRequestsPage> createState() =>
      _OrphanTrackRequestsPageState();
}

class _OrphanTrackRequestsPageState extends State<OrphanTrackRequestsPage> {
  final OrphanService _orphanService = OrphanService();
  List<Map<String, dynamic>> _requests = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadRequests();
  }

  Future<void> _loadRequests() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;

      if (userId != null) {
        // Get orphan profile to find orphanId
        final profile = await _orphanService.getOrphanProfile(userId);
        final orphanId = profile['orphan']['_id'];

        // Fetch requests
        final requests = await _orphanService.getRequestsByOrphan(orphanId);

        setState(() {
          _requests = List<Map<String, dynamic>>.from(requests);
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading requests: $e')));
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Approved':
        return Colors.green;
      case 'Pending':
        return Colors.orange;
      case 'In Progress':
        return Colors.blue;
      case 'Rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonAppBar(title: 'Track Requests'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _requests.isEmpty
          ? const Center(child: Text('No requests found'))
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _requests.length,
              itemBuilder: (context, index) {
                final request = _requests[index];
                return Card(
                  elevation: 4,
                  margin: const EdgeInsets.only(bottom: 16.0),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              request['type'],
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Chip(
                              label: Text(request['status']),
                              backgroundColor: _getStatusColor(
                                request['status'],
                              ),
                              labelStyle: const TextStyle(color: Colors.white),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('Amount: PKR ${request['amount']}'),
                        Text('Date: ${request['date']}'),
                        const SizedBox(height: 12),
                        LinearProgressIndicator(
                          value: request['progress'],
                          backgroundColor: Colors.grey[300],
                          valueColor: AlwaysStoppedAnimation<Color>(
                            _getStatusColor(request['status']),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${(request['progress'] * 100).toInt()}% Complete',
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
