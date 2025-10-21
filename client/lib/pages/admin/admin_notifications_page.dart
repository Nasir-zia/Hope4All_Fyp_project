import 'package:flutter/material.dart';
import '../../admin_service.dart';
import '../../widgets/common_app_bar.dart';

class AdminNotificationsPage extends StatefulWidget {
  const AdminNotificationsPage({super.key});

  @override
  State<AdminNotificationsPage> createState() => _AdminNotificationsPageState();
}

class _AdminNotificationsPageState extends State<AdminNotificationsPage> {
  final AdminService _adminService = AdminService();
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;
  String _selectedFilter = 'all';

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      final notifications = await _adminService.getNotifications();
      setState(() {
        _notifications = List<Map<String, dynamic>>.from(
          notifications.map((e) => Map<String, dynamic>.from(e)),
        );
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading notifications: $e')),
        );
      }
    }
  }

  List<Map<String, dynamic>> get _filteredNotifications {
    if (_selectedFilter == 'all') return _notifications;
    return _notifications
        .where((notification) => notification['type'] == _selectedFilter)
        .toList();
  }

  Future<void> _markAsRead(String notificationId) async {
    try {
      await _adminService.markNotificationAsRead(notificationId);
      setState(() {
        final index = _notifications.indexWhere(
          (n) => n['id'].toString() == notificationId,
        );
        if (index != -1) {
          _notifications[index]['read'] = true;
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error marking notification as read: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonAppBar(
        title: 'Notifications',
        additionalActions: [
          IconButton(
            icon: const Icon(Icons.mark_email_read),
            onPressed: () => _markAllAsRead(),
            tooltip: 'Mark all as read',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Filter Tabs
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
                        _buildFilterChip('all', 'All'),
                        const SizedBox(width: 8),
                        _buildFilterChip('approval', 'Approvals'),
                        const SizedBox(width: 8),
                        _buildFilterChip('low_stock', 'Low Stock'),
                        const SizedBox(width: 8),
                        _buildFilterChip('new_donor', 'New Users'),
                      ],
                    ),
                  ),
                ),
                // Notifications List
                Expanded(
                  child: _filteredNotifications.isEmpty
                      ? const Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.notifications_none,
                                size: 64,
                                color: Colors.grey,
                              ),
                              SizedBox(height: 16),
                              Text(
                                'No notifications',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: _loadNotifications,
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _filteredNotifications.length,
                            itemBuilder: (context, index) {
                              final notification =
                                  _filteredNotifications[index];
                              final isRead =
                                  notification['read'] as bool? ?? false;
                              return Card(
                                elevation: isRead ? 1 : 3,
                                margin: const EdgeInsets.only(bottom: 8),
                                color: isRead ? Colors.grey[50] : Colors.white,
                                child: ListTile(
                                  title: Text(
                                    notification['title'],
                                    style: TextStyle(
                                      fontWeight: isRead
                                          ? FontWeight.normal
                                          : FontWeight.bold,
                                    ),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const SizedBox(height: 4),
                                      Text(notification['message']),
                                      const SizedBox(height: 4),
                                      Text(
                                        _formatTimestamp(
                                          notification['timestamp'],
                                        ),
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                  trailing: isRead
                                      ? const Icon(
                                          Icons.check_circle,
                                          color: Colors.green,
                                          size: 20,
                                        )
                                      : IconButton(
                                          icon: const Icon(
                                            Icons.mark_email_read,
                                          ),
                                          onPressed: () => _markAsRead(
                                            notification['id'].toString(),
                                          ),
                                          tooltip: 'Mark as read',
                                        ),
                                  onTap: () {
                                    if (!isRead) {
                                      _markAsRead(
                                        notification['id'].toString(),
                                      );
                                    }
                                    _showNotificationDetails(notification);
                                  },
                                  leading: CircleAvatar(
                                    backgroundColor: _getNotificationColor(
                                      notification['type'],
                                    ),
                                    child: Icon(
                                      _getNotificationIcon(
                                        notification['type'],
                                      ),
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateNotificationDialog(),
        child: const Icon(Icons.add_alert),
        tooltip: 'Create Notification',
      ),
    );
  }

  Widget _buildFilterChip(String filter, String label) {
    final isSelected = _selectedFilter == filter;
    return FilterChip(
      selected: isSelected,
      onSelected: (selected) {
        setState(() => _selectedFilter = filter);
      },
      backgroundColor: isSelected ? Colors.blue[100] : Colors.grey[100],
      selectedColor: Colors.blue[200],
      checkmarkColor: Colors.blue,
      label: Text(label),
    );
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'approval':
        return Colors.green;
      case 'low_stock':
        return Colors.red;
      case 'new_donor':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'approval':
        return Icons.check_circle;
      case 'low_stock':
        return Icons.warning;
      case 'new_donor':
        return Icons.person_add;
      default:
        return Icons.notifications;
    }
  }

  String _formatTimestamp(String timestamp) {
    try {
      final dateTime = DateTime.parse(timestamp);
      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inDays > 0) {
        return '${difference.inDays} days ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} hours ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} minutes ago';
      } else {
        return 'Just now';
      }
    } catch (e) {
      return timestamp;
    }
  }

  void _markAllAsRead() {
    setState(() {
      for (final notification in _notifications) {
        notification['read'] = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('All notifications marked as read')),
    );
  }

  void _showNotificationDetails(Map<String, dynamic> notification) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(notification['title']),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(notification['message']),
            const SizedBox(height: 16),
            Text(
              'Type: ${notification['type']}',
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
            Text(
              'Received: ${_formatTimestamp(notification['timestamp'])}',
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showCreateNotificationDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create Notification'),
        content: const Text(
          'Broadcast notifications to users. This feature would allow admins to send targeted notifications to specific user groups.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Notification creation feature coming soon!'),
                ),
              );
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }
}
