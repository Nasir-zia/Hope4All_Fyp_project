import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../orphan_service.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/common_app_bar.dart';

class OrphanProfilePage extends StatefulWidget {
  const OrphanProfilePage({super.key});

  @override
  State<OrphanProfilePage> createState() => _OrphanProfilePageState();
}

class _OrphanProfilePageState extends State<OrphanProfilePage> {
  final OrphanService _orphanService = OrphanService();
  bool _isEditing = false;
  bool _isLoading = true;
  Map<String, dynamic>? _orphanProfile;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _schoolController = TextEditingController();
  final TextEditingController _classController = TextEditingController();
  final TextEditingController _achievementsController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _schoolController.dispose();
    _classController.dispose();
    _achievementsController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;

      if (userId != null) {
        final profile = await _orphanService.getOrphanProfile(userId);
        setState(() {
          _orphanProfile = profile['orphan'];
          _nameController.text = _orphanProfile!['name'] ?? '';
          _schoolController.text = _orphanProfile!['school'] ?? '';
          _classController.text = _orphanProfile!['class'] ?? '';
          _achievementsController.text = _orphanProfile!['achievements'] ?? '';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading profile: $e')));
      }
    }
  }

  Future<void> _saveProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;

      if (userId != null) {
        final updateData = {
          'name': _nameController.text,
          'school': _schoolController.text,
          'class': _classController.text,
          'achievements': _achievementsController.text,
        };

        await _orphanService.updateOrphanProfile(userId, updateData);
        setState(() => _isEditing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully!')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error updating profile: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: const CommonAppBar(title: 'My Profile'),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: CommonAppBar(
        title: 'My Profile',
        additionalActions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.save : Icons.edit),
            onPressed: _isEditing
                ? _saveProfile
                : () => setState(() => _isEditing = true),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: Colors.blue,
              backgroundImage: _orphanProfile?['profilePic'] != null
                  ? NetworkImage(_orphanProfile!['profilePic'])
                  : null,
              child: _orphanProfile?['profilePic'] == null
                  ? const Icon(Icons.person, size: 50, color: Colors.white)
                  : null,
            ),
            const SizedBox(height: 20),
            _buildProfileField('Name', _nameController, Icons.person),
            const SizedBox(height: 16),
            _buildProfileField('School', _schoolController, Icons.school),
            const SizedBox(height: 16),
            _buildProfileField('Class', _classController, Icons.class_),
            const SizedBox(height: 16),
            _buildProfileField(
              'Achievements',
              _achievementsController,
              Icons.star,
              maxLines: 3,
            ),
            const SizedBox(height: 30),
            if (!_isEditing) ...[
              const Text(
                'Recent Activity',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.request_page, color: Colors.blue),
                  title: const Text('School Fees Request'),
                  subtitle: const Text('Approved - PKR 5000'),
                  trailing: const Text('2 days ago'),
                ),
              ),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.book, color: Colors.green),
                  title: const Text('Completed Math Quiz'),
                  subtitle: const Text('Score: 95%'),
                  trailing: const Text('1 week ago'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildProfileField(
    String label,
    TextEditingController controller,
    IconData icon, {
    int maxLines = 1,
  }) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(icon, color: Colors.blue),
            const SizedBox(width: 16),
            Expanded(
              child: _isEditing
                  ? TextFormField(
                      controller: controller,
                      decoration: InputDecoration(labelText: label),
                      maxLines: maxLines,
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          label,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                        Text(
                          controller.text,
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
