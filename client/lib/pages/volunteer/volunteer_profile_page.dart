import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../volunteer_service.dart';
import '../../providers/auth_provider.dart';

class VolunteerProfilePage extends StatefulWidget {
  const VolunteerProfilePage({super.key});

  @override
  State<VolunteerProfilePage> createState() => _VolunteerProfilePageState();
}

class _VolunteerProfilePageState extends State<VolunteerProfilePage> {
  final VolunteerService _volunteerService = VolunteerService();
  Map<String, dynamic> _profile = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final volunteerId = authProvider.userId;
      if (volunteerId == null) {
        throw Exception('User not authenticated');
      }
      final profile = await _volunteerService.getVolunteerStats(volunteerId);
      setState(() {
        _profile = profile;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading profile: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        backgroundColor: Colors.blue,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/volunteer-home'),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const CircleAvatar(
                    radius: 60,
                    backgroundColor: Colors.blue,
                    child: Icon(Icons.person, size: 60, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _profile['name'] ?? 'Volunteer Name',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildInfoCard('Contact Information', [
                    _buildInfoRow('Email', _profile['email']),
                    _buildInfoRow('Phone', _profile['phone']),
                  ]),
                  const SizedBox(height: 16),
                  _buildInfoCard('Volunteer Statistics', [
                    _buildInfoRow('Joined', _profile['joinedDate'] ?? 'N/A'),
                    _buildInfoRow(
                      'Total Tasks',
                      '${_profile['totalTasks'] ?? 0}',
                    ),
                    _buildInfoRow(
                      'Completed Tasks',
                      '${_profile['completedTasks'] ?? 0}',
                    ),
                    _buildInfoRow(
                      'Hours Volunteered',
                      '${_profile['hoursVolunteered'] ?? 0}',
                    ),
                  ]),
                  const SizedBox(height: 16),
                  _buildActivitiesCard(),
                  const SizedBox(height: 32),
                  ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Edit profile coming soon!'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.edit),
                    label: const Text('Edit Profile'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildInfoCard(String title, List<Widget> children) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(value ?? 'N/A'),
        ],
      ),
    );
  }

  Widget _buildActivitiesCard() {
    final activities = _profile['activities'] as List<dynamic>? ?? [];
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Activities',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (activities.isEmpty)
              const Text('No recent activities')
            else
              ...activities.map(
                (activity) => ListTile(
                  leading: const Icon(Icons.check_circle, color: Colors.green),
                  title: Text(activity['activity'] ?? 'Activity'),
                  subtitle: Text(activity['date'] ?? 'Date'),
                  trailing: Text('${activity['hours'] ?? 0} hours'),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
