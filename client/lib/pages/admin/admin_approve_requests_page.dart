import 'package:flutter/material.dart';
import '../../../admin_service.dart';
import '../../../widgets/common_app_bar.dart';

class AdminApproveRequestsPage extends StatefulWidget {
  const AdminApproveRequestsPage({super.key});

  @override
  State<AdminApproveRequestsPage> createState() =>
      _AdminApproveRequestsPageState();
}

class _AdminApproveRequestsPageState extends State<AdminApproveRequestsPage> {
  final AdminService _adminService = AdminService();
  List<Map<String, dynamic>> _requests = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadRequests();
  }

  Future<void> _loadRequests() async {
    try {
      final requests = await _adminService.getPendingRequests();
      if (mounted) {
        setState(() {
          _requests = List<Map<String, dynamic>>.from(
            requests.map((e) => Map<String, dynamic>.from(e)),
          );
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _requests = []; // Empty array on error
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading requests: $e')));
      }
    }
  }

  Future<void> _approveRequest(String requestId) async {
    try {
      // Show loading
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Approving request...')));

      await _adminService.approveRequest(requestId);
      if (mounted) {
        setState(() {
          _requests.removeWhere(
            (request) =>
                request['_id'].toString() == requestId || // FIXED: Use _id
                request['id'].toString() == requestId,
          );
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Request approved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        _loadRequests(); // Reload to get fresh data
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ Error approving request: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _rejectRequest(String requestId) async {
    final reasonController = TextEditingController();
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reject Request'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Please provide a reason for rejection:'),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                hintText: 'Reason for rejection',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(reasonController.text),
            child: const Text('Reject'),
          ),
        ],
      ),
    );

    if (result != null && result.isNotEmpty) {
      try {
        await _adminService.rejectRequest(requestId, result);
        if (mounted) {
          setState(() {
            _requests.removeWhere(
              (request) =>
                  request['_id'].toString() == requestId || // FIXED: Use _id
                  request['id'].toString() == requestId,
            );
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✅ Request rejected successfully!'),
              backgroundColor: Colors.red,
            ),
          );
          _loadRequests(); // Reload to get fresh data
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('❌ Error rejecting request: $e')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonAppBar(title: 'Approve Requests'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _requests.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, size: 64, color: Colors.green),
                  SizedBox(height: 16),
                  Text(
                    'No pending requests',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              onRefresh: _loadRequests,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _requests.length,
                itemBuilder: (context, index) {
                  final request = _requests[index];
                  return Card(
                    elevation: 3,
                    margin: const EdgeInsets.only(bottom: 16),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.child_care,
                                color: Colors.blue,
                                size: 24,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _getOrphanName(
                                    request,
                                  ), // FIXED: Proper orphan name
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.orange[100],
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'PENDING',
                                  style: TextStyle(
                                    color: Colors.orange,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          _buildDetailRow(
                            'Request Type',
                            request['type'] ?? 'Unknown',
                            Icons.category,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            'Units',
                            '${request['units'] ?? 0} ${request['unitType'] ?? ''}',
                            Icons.numbers,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            'School',
                            request['school'] ?? 'N/A',
                            Icons.school,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            'Class',
                            request['class'] ?? 'N/A',
                            Icons.class_,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            'Description',
                            request['description'] ?? 'No description',
                            Icons.description,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            'Submitted',
                            _formatDate(request['createdAt']),
                            Icons.calendar_today,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () => _approveRequest(
                                    request['_id']
                                            ?.toString() ?? // FIXED: Use _id
                                        request['id'].toString(),
                                  ),
                                  icon: const Icon(
                                    Icons.check,
                                    color: Colors.white,
                                  ),
                                  label: const Text(
                                    'Approve',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 12,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () => _rejectRequest(
                                    request['_id']
                                            ?.toString() ?? // FIXED: Use _id
                                        request['id'].toString(),
                                  ),
                                  icon: const Icon(
                                    Icons.close,
                                    color: Colors.red,
                                  ),
                                  label: const Text(
                                    'Reject',
                                    style: TextStyle(color: Colors.red),
                                  ),
                                  style: OutlinedButton.styleFrom(
                                    side: const BorderSide(color: Colors.red),
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 12,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }

  // FIXED: Proper orphan name extraction
  String _getOrphanName(Map<String, dynamic> request) {
    try {
      final orphanId = request['orphanId'];
      if (orphanId != null && orphanId is Map && orphanId['name'] != null) {
        return orphanId['name'];
      }
      if (orphanId != null && orphanId is String) {
        return 'Orphan ID: $orphanId';
      }
      return 'Unknown Orphan';
    } catch (e) {
      return 'Unknown Orphan';
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  Widget _buildDetailRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: Colors.grey[700],
          ),
        ),
        Expanded(child: Text(value)),
      ],
    );
  }
}
