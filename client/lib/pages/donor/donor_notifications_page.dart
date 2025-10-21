import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/common_app_bar.dart';

class DonorNotificationsPage extends StatefulWidget {
  const DonorNotificationsPage({super.key});

  @override
  State<DonorNotificationsPage> createState() => _DonorNotificationsPageState();
}

class _DonorNotificationsPageState extends State<DonorNotificationsPage> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      // Placeholder: Fetch notifications
      // In real implementation, call _donorService.getNotifications()
      setState(() {
        _notifications = [
          {
            'id': 1,
            'type': 'donation_update',
            'title': 'Donation Delivered',
            'message':
                'Your donation of PKR 5000 for Ahmed\'s school fees has been delivered.',
            'date': '2023-10-01',
            'read': false,
          },
          {
            'id': 2,
            'type': 'delivery_notification',
            'title': 'Delivery Update',
            'message':
                'Stationery items for Fatima are being prepared for delivery.',
            'date': '2023-10-05',
            'read': true,
          },
          {
            'id': 3,
            'type': 'thank_you',
            'title': 'Thank You Note',
            'message':
                'Ahmed\'s family sent a thank you note for your generous donation.',
            'date': '2023-09-28',
            'read': false,
          },
        ];
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading notifications: $e')),
      );
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'donation_update':
        return Icons.check_circle;
      case 'delivery_notification':
        return Icons.local_shipping;
      case 'thank_you':
        return Icons.favorite;
      default:
        return Icons.notifications;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'donation_update':
        return Colors.green;
      case 'delivery_notification':
        return Colors.blue;
      case 'thank_you':
        return Colors.pink;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonAppBar(
        title: 'Notifications',
        additionalActions: [
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
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
          ? const Center(child: Text('No notifications'))
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _notifications.length,
              itemBuilder: (context, index) {
                final notification = _notifications[index];
                return Card(
                  elevation: notification['read'] ? 1 : 4,
                  margin: const EdgeInsets.only(bottom: 12.0),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: _getNotificationColor(
                        notification['type'],
                      ).withOpacity(0.2),
                      child: Icon(
                        _getNotificationIcon(notification['type']),
                        color: _getNotificationColor(notification['type']),
                      ),
                    ),
                    title: Text(
                      notification['title'],
                      style: TextStyle(
                        fontWeight: notification['read']
                            ? FontWeight.normal
                            : FontWeight.bold,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(notification['message']),
                        const SizedBox(height: 4),
                        Text(
                          notification['date'],
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                    trailing: notification['read']
                        ? null
                        : Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.blue,
                              shape: BoxShape.circle,
                            ),
                          ),
                    onTap: () {
                      // Mark as read
                      setState(() {
                        _notifications[index]['read'] = true;
                      });
                      // Show full notification or navigate
                    },
                  ),
                );
              },
            ),
    );
  }
}
