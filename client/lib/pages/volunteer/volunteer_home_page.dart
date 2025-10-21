import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../volunteer_service.dart';
import '../../providers/auth_provider.dart';

class VolunteerHomePage extends StatefulWidget {
  const VolunteerHomePage({super.key});

  @override
  State<VolunteerHomePage> createState() => _VolunteerHomePageState();
}

class _VolunteerHomePageState extends State<VolunteerHomePage> {
  final VolunteerService _volunteerService = VolunteerService();
  List<Map<String, dynamic>> _assignedTasks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final volunteerId = authProvider.userId;
      if (volunteerId == null) {
        throw Exception('User not authenticated');
      }
      final tasks = await _volunteerService.getAssignedTasks(volunteerId);
      setState(() {
        _assignedTasks = List<Map<String, dynamic>>.from(tasks);
        _isLoading = false;
      });
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
      appBar: AppBar(
        title: const Text('Volunteer Dashboard'),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(
            icon: const Icon(Icons.chat),
            onPressed: () => context.go('/volunteer-chat'),
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.go('/volunteer-profile'),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Welcome to Your Dashboard',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: ListView(
                      children: [
                        _buildSection(
                          'Assigned Tasks & Visits',
                          _assignedTasks,
                          () => context.go('/volunteer-task-list'),
                          Icons.assignment,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton.icon(
                          onPressed: () => context.go('/volunteer-task-list'),
                          icon: const Icon(Icons.list),
                          label: const Text('View All Missions'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            minimumSize: const Size(double.infinity, 50),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/volunteer-task-list'),
        child: const Icon(Icons.add_task),
      ),
    );
  }

  Widget _buildSection(
    String title,
    List<Map<String, dynamic>> items,
    VoidCallback onViewAll,
    IconData icon,
  ) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(icon, color: Colors.blue),
                    const SizedBox(width: 8),
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                TextButton(onPressed: onViewAll, child: const Text('View All')),
              ],
            ),
            const SizedBox(height: 10),
            ...items
                .take(3)
                .map(
                  (item) => ListTile(
                    title: Text(item['title']),
                    subtitle: Text('${item['description']} - ${item['date']}'),
                    trailing: Text(item['status']),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}
