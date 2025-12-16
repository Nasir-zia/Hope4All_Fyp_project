import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../admin_service.dart';
import '../../widgets/common_app_bar.dart';

class AdminUserDetailPage extends StatefulWidget {
  final Map<String, dynamic> user;

  const AdminUserDetailPage({super.key, required this.user});

  @override
  State<AdminUserDetailPage> createState() => _AdminUserDetailPageState();
}

class _AdminUserDetailPageState extends State<AdminUserDetailPage> {
  final AdminService _adminService = AdminService();
  late Map<String, dynamic> _user;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _user = Map<String, dynamic>.from(widget.user);
  }

  Future<void> _updateUserStatus(String newStatus) async {
    setState(() => _isLoading = true);
    try {
      await _adminService.updateUserStatus(_user['_id'].toString(), newStatus);
      setState(() {
        _user['status'] = newStatus;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(' User status updated to $newStatus')),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(' Error updating status: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (_) {
      return dateString;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonAppBar(title: 'User Details'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Header
            Center(
              child: Column(
                children: [
                  _user['profilePic'] != null && _user['profilePic'].isNotEmpty
                      ? CircleAvatar(
                          radius: 50,
                          backgroundImage: NetworkImage(_user['profilePic']),
                          onBackgroundImageError: (_, __) => Icon(
                            _getRoleIcon(_user['role']),
                            size: 50,
                            color: Colors.white,
                          ),
                          backgroundColor: _getRoleColor(_user['role']),
                        )
                      : CircleAvatar(
                          radius: 50,
                          backgroundColor: _getRoleColor(_user['role']),
                          child: Icon(
                            _getRoleIcon(_user['role']),
                            size: 50,
                            color: Colors.white,
                          ),
                        ),
                  const SizedBox(height: 16),
                  Text(
                    _user['username'] ?? 'Unknown User',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(_user['status']),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      (_user['status'] ?? 'pending').toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Basic Information
            _buildSectionTitle('Basic Information'),
            _buildInfoCard([
              _buildInfoRow('Username', _user['username'] ?? 'N/A'),
              _buildInfoRow('Email', _user['email'] ?? 'N/A'),
              _buildInfoRow('Role', _user['role'] ?? 'N/A'),
              _buildInfoRow('Joined', _formatDate(_user['createdAt'])),
            ]),

            const SizedBox(height: 24),

            // Role-specific Information
            if (_user['role'] == 'orphan') ...[
              _buildSectionTitle('Orphan Details'),
              _buildInfoCard([
                _buildInfoRow('Name', _user['name'] ?? 'N/A'),
                _buildInfoRow('Age', _user['age']?.toString() ?? 'N/A'),
                _buildInfoRow('Gender', _user['gender'] ?? 'N/A'),
                _buildInfoRow('Location', _user['location'] ?? 'N/A'),
              ]),
              if (_user['supportingDocs'] != null &&
                  _user['supportingDocs'].isNotEmpty) ...[
                const SizedBox(height: 16),
                _buildImageSection('Supporting Documents', [
                  _user['supportingDocs'],
                ]),
              ],
            ] else if (_user['role'] == 'donor') ...[
              _buildSectionTitle('Donor Details'),
              _buildInfoCard([
                _buildInfoRow('Name', _user['name'] ?? 'N/A'),
                _buildInfoRow('Phone', _user['phone'] ?? 'N/A'),
                _buildInfoRow('City', _user['city'] ?? 'N/A'),
              ]),
              if (_user['documents'] != null &&
                  (_user['documents'] as List).isNotEmpty) ...[
                const SizedBox(height: 16),
                _buildDocumentsSection('Documents', _user['documents']),
              ],
            ],

            const SizedBox(height: 32),

            // Status Update Section
            _buildSectionTitle('Update Status'),
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Change User Status',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _isLoading
                                ? null
                                : () => _updateUserStatus('verified'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Text(
                              'Verify User',
                              style: TextStyle(color: Colors.white),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _isLoading
                                ? null
                                : () => _updateUserStatus('suspended'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Text(
                              'Suspend User',
                              style: TextStyle(color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.blue,
        ),
      ),
    );
  }

  Widget _buildInfoCard(List<Widget> children) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: children),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 16))),
        ],
      ),
    );
  }

  Widget _buildImageSection(String title, List<String> imageUrls) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: imageUrls.length,
            itemBuilder: (context, index) {
              return Container(
                width: 200,
                margin: const EdgeInsets.only(right: 8),
                child: Image.network(
                  imageUrls[index],
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.image_not_supported, size: 50),
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDocumentsSection(String title, List<dynamic> documents) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ...documents.map(
          (doc) => Card(
            child: ListTile(
              leading: const Icon(Icons.description),
              title: Text(doc['name'] ?? 'Document'),
              subtitle: Text('Uploaded: ${_formatDate(doc['uploadedAt'])}'),
              trailing: IconButton(
                icon: const Icon(Icons.download),
                onPressed: () {
                  // TODO: Implement document download
                },
              ),
            ),
          ),
        ),
      ],
    );
  }

  Color _getRoleColor(String? role) {
    switch (role) {
      case 'donor':
        return Colors.green;
      case 'orphan':
        return Colors.blue;
      case 'volunteer':
        return Colors.orange;
      case 'orphanage':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  IconData _getRoleIcon(String? role) {
    switch (role) {
      case 'donor':
        return Icons.volunteer_activism;
      case 'orphan':
        return Icons.child_care;
      case 'volunteer':
        return Icons.group;
      case 'orphanage':
        return Icons.business;
      default:
        return Icons.person;
    }
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'verified':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'suspended':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
