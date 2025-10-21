import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../admin_service.dart';
import '../../widgets/common_app_bar.dart';

class AdminUserManagementPage extends StatefulWidget {
  const AdminUserManagementPage({super.key});

  @override
  State<AdminUserManagementPage> createState() =>
      _AdminUserManagementPageState();
}

class _AdminUserManagementPageState extends State<AdminUserManagementPage> {
  final AdminService _adminService = AdminService();
  List<Map<String, dynamic>> _users = [];
  bool _isLoading = true;
  String _selectedFilter = 'all';

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    try {
      final users = await _adminService.getUsers();

      setState(() {
        _users = List<Map<String, dynamic>>.from(
          users.map((e) => Map<String, dynamic>.from(e)),
        );
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(' Error loading users: $e')));
    }
  }

  List<Map<String, dynamic>> get _filteredUsers {
    if (_selectedFilter == 'all') return _users;
    return _users.where((user) => user['role'] == _selectedFilter).toList();
  }

  Future<void> _updateUserStatus(String userId, String newStatus) async {
    try {
      await _adminService.updateUserStatus(userId, newStatus);
      setState(() {
        final index = _users.indexWhere(
          (user) => user['id'].toString() == userId,
        );
        if (index != -1) {
          _users[index]['status'] = newStatus;
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ User status updated to $newStatus')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(' Error updating user status: $e')),
      );
    }
  }

  String _formatJoinDate(String? joinDate) {
    if (joinDate == null || joinDate.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(joinDate);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (_) {
      return joinDate;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonAppBar(title: 'User Management'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // 🔹 Filter Tabs
                Container(
                  color: Colors.white,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: Row(
                      children: [
                        _buildFilterChip('all', 'All Users'),
                        const SizedBox(width: 8),
                        _buildFilterChip('donor', 'Donors'),
                        const SizedBox(width: 8),
                        _buildFilterChip('orphan', 'Orphans'),
                        const SizedBox(width: 8),
                        _buildFilterChip('volunteer', 'Volunteers'),
                        const SizedBox(width: 8),
                        _buildFilterChip('orphanage', 'Orphanages'),
                      ],
                    ),
                  ),
                ),

                // 🔹 User List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadUsers,
                    child: _filteredUsers.isEmpty
                        ? const Center(
                            child: Text(
                              'No users found.',
                              style: TextStyle(color: Colors.grey),
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _filteredUsers.length,
                            itemBuilder: (context, index) {
                              final user = _filteredUsers[index];
                              return Card(
                                elevation: 2,
                                margin: const EdgeInsets.only(bottom: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: _getRoleColor(
                                      user['role'],
                                    ),
                                    radius: 26,
                                    child: Icon(
                                      _getRoleIcon(user['role']),
                                      color: Colors.white,
                                      size: 22,
                                    ),
                                  ),
                                  title: Text(
                                    user['username'] ?? 'Unknown User',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const SizedBox(height: 2),
                                      Text(
                                        user['email'] ?? 'No email provided',
                                        style: const TextStyle(fontSize: 13),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Role: ${user['role'] ?? 'Unknown'}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[700],
                                        ),
                                      ),
                                      Text(
                                        'Joined: ${_formatJoinDate(DateTime.now().toIso8601String())}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                  trailing: _buildStatusDropdown(user),
                                ),
                              );
                            },
                          ),
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddUserDialog,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilterChip(String filter, String label) {
    final isSelected = _selectedFilter == filter;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _selectedFilter = filter),
      backgroundColor: isSelected ? Colors.blue[100] : Colors.grey[100],
      selectedColor: Colors.blue[200],
      checkmarkColor: Colors.blue,
    );
  }

  Widget _buildStatusDropdown(Map<String, dynamic> user) {
    final currentStatus = user['status'] ?? 'pending';
    return DropdownButton<String>(
      value: currentStatus,
      items: ['pending', 'verified', 'suspended']
          .map(
            (status) => DropdownMenuItem(
              value: status,
              child: Text(
                status.toUpperCase(),
                style: TextStyle(
                  color: _getStatusColor(status),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          )
          .toList(),
      onChanged: (newStatus) {
        if (newStatus != null && newStatus != currentStatus) {
          _updateUserStatus(user['id'].toString(), newStatus);
        }
      },
      underline: const SizedBox(),
    );
  }

  // 🔹 Helper Methods
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

  void _showAddUserDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add New User'),
        content: const Text(
          'User registration is handled through the main app. This feature would integrate with the registration flow.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
