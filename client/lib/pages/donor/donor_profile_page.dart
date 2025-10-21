import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../donor_service.dart';
import '../../../providers/auth_provider.dart';
import '../../../widgets/common_app_bar.dart';

class DonorProfilePage extends StatefulWidget {
  const DonorProfilePage({super.key});

  @override
  State<DonorProfilePage> createState() => _DonorProfilePageState();
}

class _DonorProfilePageState extends State<DonorProfilePage> {
  final DonorService _donorService = DonorService();
  bool _isEditing = false;
  bool _isLoading = true;
  Map<String, dynamic>? _donorProfile;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();

  List<String> _selectedCauseTypes = [];
  List<String> _selectedSchoolLevels = [];
  List<String> _selectedAreas = [];

  List<String> _causeTypes = [];
  List<String> _schoolLevels = [];
  List<String> _areas = [];

  XFile? _selectedProfilePic;
  List<PlatformFile> _selectedDocuments = [];

  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;

      if (userId != null) {
        final profile = await _donorService.getDonorProfile(userId);
        final options = await _donorService.getPreferenceOptions();
        setState(() {
          _donorProfile = profile['donor'];
          _causeTypes = List<String>.from(options['options']['causeTypes']);
          _schoolLevels = List<String>.from(options['options']['schoolLevels']);
          _areas = List<String>.from(options['options']['areas']);
          _nameController.text = _donorProfile!['name'] ?? '';
          _emailController.text = _donorProfile!['email'] ?? '';
          _phoneController.text = _donorProfile!['phone'] ?? '';
          _cityController.text = _donorProfile!['city'] ?? '';
          _selectedCauseTypes = List<String>.from(
            _donorProfile!['preferences']['causeType'] ?? [],
          );
          _selectedSchoolLevels = List<String>.from(
            _donorProfile!['preferences']['schoolLevel'] ?? [],
          );
          _selectedAreas = List<String>.from(
            _donorProfile!['preferences']['area'] ?? [],
          );
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

  Future<void> _pickProfilePicture() async {
    final XFile? image = await _imagePicker.pickImage(
      source: ImageSource.gallery,
    );
    if (image != null) {
      setState(() {
        _selectedProfilePic = image;
      });
    }
  }

  Future<void> _pickDocuments() async {
    final result = await FilePicker.platform.pickFiles(
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    );

    if (result != null) {
      setState(() {
        _selectedDocuments = result.files;
      });
    }
  }

  Future<void> _saveProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;

      if (userId == null) return;

      final profileData = {
        'name': _nameController.text,
        'email': _emailController.text,
        'phone': _phoneController.text,
        'city': _cityController.text,
        'preferences': {
          'causeType': _selectedCauseTypes,
          'schoolLevel': _selectedSchoolLevels,
          'area': _selectedAreas,
        },
        'notificationSettings': _donorProfile?['notificationSettings'] ?? {},
      };

      await _donorService.updateDonorProfileWithFiles(
        userId,
        profileData,
        _selectedProfilePic,
        _selectedDocuments.isNotEmpty ? _selectedDocuments : null,
      );

      // Reload profile to get updated data
      await _loadProfile();

      if (mounted) {
        setState(() {
          _isEditing = false;
          _selectedProfilePic = null;
          _selectedDocuments = [];
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error updating profile: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            // Profile Picture Section
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Colors.blue.shade100,
                    backgroundImage: _selectedProfilePic != null
                        ? Image.file(File(_selectedProfilePic!.path)).image
                        : (_donorProfile?['profilePic'] != null &&
                              _donorProfile!['profilePic'].isNotEmpty)
                        ? CachedNetworkImageProvider(
                            _donorProfile!['profilePic'],
                          )
                        : null,
                    child:
                        (_selectedProfilePic == null &&
                            (_donorProfile?['profilePic'] == null ||
                                _donorProfile!['profilePic'].isEmpty))
                        ? const Icon(Icons.person, size: 60, color: Colors.blue)
                        : null,
                  ),
                  if (_isEditing)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: CircleAvatar(
                        backgroundColor: Colors.blue,
                        radius: 20,
                        child: IconButton(
                          icon: const Icon(
                            Icons.camera_alt,
                            color: Colors.white,
                            size: 20,
                          ),
                          onPressed: _pickProfilePicture,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            _buildProfileField('Name', _nameController, Icons.person),
            const SizedBox(height: 16),
            _buildProfileField('Email', _emailController, Icons.email),
            const SizedBox(height: 16),
            _buildProfileField('Phone', _phoneController, Icons.phone),
            const SizedBox(height: 16),
            _buildProfileField('City', _cityController, Icons.location_city),
            const SizedBox(height: 16),
            _buildMultiSelectField(
              'Preferred Cause Types',
              _selectedCauseTypes,
              _causeTypes,
              Icons.favorite,
              (values) => setState(() => _selectedCauseTypes = values),
            ),
            const SizedBox(height: 16),
            _buildMultiSelectField(
              'Preferred School Levels',
              _selectedSchoolLevels,
              _schoolLevels,
              Icons.school,
              (values) => setState(() => _selectedSchoolLevels = values),
            ),
            const SizedBox(height: 16),
            _buildMultiSelectField(
              'Preferred Areas',
              _selectedAreas,
              _areas,
              Icons.location_on,
              (values) => setState(() => _selectedAreas = values),
            ),
            const SizedBox(height: 16),
            // Documents Section
            if (_isEditing) ...[
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.attach_file, color: Colors.blue),
                          const SizedBox(width: 16),
                          const Text(
                            'Upload Documents',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const Spacer(),
                          ElevatedButton.icon(
                            onPressed: _pickDocuments,
                            icon: const Icon(Icons.add),
                            label: const Text('Add Files'),
                          ),
                        ],
                      ),
                      if (_selectedDocuments.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        ..._selectedDocuments.map(
                          (doc) => ListTile(
                            leading: const Icon(Icons.insert_drive_file),
                            title: Text(doc.name),
                            subtitle: Text('${(doc.size / 1024).round()} KB'),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () {
                                setState(() {
                                  _selectedDocuments.remove(doc);
                                });
                              },
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ] else if (_donorProfile?['documents'] != null &&
                _donorProfile!['documents'].isNotEmpty) ...[
              const Text(
                'Uploaded Documents',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              ...(_donorProfile!['documents'] as List).map(
                (doc) => Card(
                  child: ListTile(
                    leading: const Icon(Icons.insert_drive_file),
                    title: Text(doc['name']),
                    subtitle: Text(
                      'Uploaded: ${DateTime.parse(doc['uploadedAt']).toLocal().toString().split(' ')[0]}',
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.download),
                      onPressed: () {
                        // TODO: Implement document download
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
            if (!_isEditing && _donorProfile != null) ...[
              const Text(
                'Donation Summary',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        child: _buildStat(
                          'Total Donated',
                          'PKR ${_donorProfile!['totalDonated'] ?? 0}',
                        ),
                      ),
                      Expanded(
                        child: _buildStat(
                          'Children Helped',
                          '${_donorProfile!['childrenHelped'] ?? 0}',
                        ),
                      ),
                      Expanded(
                        child: _buildStat(
                          'Matched Orphans',
                          '${_donorProfile!['matchedOrphans']?.length ?? 0}',
                        ),
                      ),
                    ],
                  ),
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
    IconData icon,
  ) {
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

  Widget _buildMultiSelectField(
    String label,
    List<String> values,
    List<String> items,
    IconData icon,
    ValueChanged<List<String>> onChanged,
  ) {
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
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          label,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 4,
                          children: items.map((item) {
                            final isSelected = values.contains(item);
                            return FilterChip(
                              label: Text(item),
                              selected: isSelected,
                              onSelected: (selected) {
                                List<String> newValues = List.from(values);
                                if (selected) {
                                  newValues.add(item);
                                } else {
                                  newValues.remove(item);
                                }
                                onChanged(newValues);
                              },
                              selectedColor: Colors.blue.shade100,
                              checkmarkColor: Colors.blue,
                            );
                          }).toList(),
                        ),
                      ],
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
                          values.isEmpty ? 'None selected' : values.join(', '),
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

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
