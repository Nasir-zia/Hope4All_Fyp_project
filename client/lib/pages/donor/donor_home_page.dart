import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../../../donor_service.dart';
import '../../../providers/auth_provider.dart';
import '../../../widgets/common_app_bar.dart';

class DonorHomePage extends StatefulWidget {
  const DonorHomePage({super.key});

  @override
  State<DonorHomePage> createState() => _DonorHomePageState();
}

class _DonorHomePageState extends State<DonorHomePage> {
  final DonorService _donorService = DonorService();
  List<dynamic> _donors = [];
  bool _isLoading = false;
  Map<String, dynamic>? _currentUserProfile;

  // Form fields for adding/editing donor
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cityController = TextEditingController();
  String? _editingDonorId;
  bool _isEditing = false;

  List<String> _causeTypes = [];
  List<String> _schoolLevels = [];
  List<String> _areas = [];
  List<String> _selectedCauseTypes = [];
  List<String> _selectedSchoolLevels = [];
  List<String> _selectedAreas = [];

  XFile? _selectedProfilePic;
  List<PlatformFile> _selectedDocuments = [];

  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadDonors();
    _loadPreferenceOptions();
    _loadCurrentUserProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _loadDonors() async {
    setState(() => _isLoading = true);
    try {
      final donors = await _donorService.getDonors();
      if (mounted) setState(() => _donors = donors);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading donors: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _loadPreferenceOptions() async {
    try {
      final options = await _donorService.getPreferenceOptions();
      if (mounted) {
        setState(() {
          _causeTypes = List<String>.from(options['options']['causeTypes']);
          _schoolLevels = List<String>.from(options['options']['schoolLevels']);
          _areas = List<String>.from(options['options']['areas']);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading preference options: $e')),
        );
      }
    }
  }

  Future<void> _loadCurrentUserProfile() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId;
    if (userId != null) {
      try {
        final profile = await _donorService.getDonorProfile(userId);
        if (mounted) setState(() => _currentUserProfile = profile['donor']);
      } catch (e) {
        // Handle error
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

  void _startEditing(dynamic donor) {
    setState(() {
      _isEditing = true;
      _editingDonorId = donor['_id'];
      _nameController.text = donor['name'] ?? '';
      _emailController.text = donor['email'] ?? '';
      _phoneController.text = donor['phone'] ?? '';
      _cityController.text = donor['city'] ?? '';
      _selectedCauseTypes = List<String>.from(
        donor['preferences']['causeType'] ?? [],
      );
      _selectedSchoolLevels = List<String>.from(
        donor['preferences']['schoolLevel'] ?? [],
      );
      _selectedAreas = List<String>.from(donor['preferences']['area'] ?? []);
    });
  }

  void _clearForm() {
    _nameController.clear();
    _emailController.clear();
    _phoneController.clear();
    _cityController.clear();
    setState(() {
      _editingDonorId = null;
      _isEditing = false;
      _selectedProfilePic = null;
      _selectedDocuments = [];
      _selectedCauseTypes = [];
      _selectedSchoolLevels = [];
      _selectedAreas = [];
    });
  }

  Future<void> _saveDonor() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId;

    if (userId == null) return;

    setState(() => _isLoading = true);
    try {
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
        'notificationSettings': {
          'donationUpdates': true,
          'impactReports': true,
          'newOpportunities': true,
        },
      };

      if (_editingDonorId != null) {
        // Update existing donor
        await _donorService.updateDonorProfileWithFiles(
          _editingDonorId!,
          profileData,
          _selectedProfilePic,
          _selectedDocuments.isNotEmpty ? _selectedDocuments : null,
        );
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Donor updated successfully!')),
          );
        }
      } else {
        // Register new donor
        await _donorService.registerDonor(
          userId: userId,
          name: _nameController.text,
          email: _emailController.text,
          phone: _phoneController.text,
          city: _cityController.text,
          preferences: {
            'causeType': _selectedCauseTypes,
            'schoolLevel': _selectedSchoolLevels,
            'area': _selectedAreas,
          },
        );
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Donor registered successfully!')),
          );
        }
      }

      _clearForm();
      await _loadDonors();
      if (mounted) {
        context.go('/donor-profile');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error saving donor: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _deleteDonor(String donorId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Donor'),
        content: const Text('Are you sure you want to delete this donor?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      setState(() => _isLoading = true);
      try {
        await _donorService.deleteDonor(donorId);
        await _loadDonors();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Donor deleted successfully!')),
          );
          context.go('/donor-home');
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Error deleting donor: $e')));
        }
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;
    final padding = isMobile ? 8.0 : 16.0;

    return Scaffold(
      appBar: CommonAppBar(
        title: 'Donor Management',
        additionalActions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDonors,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(padding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Donors List',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 10),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ListView.builder(
                      itemCount: _donors.length,
                      itemBuilder: (context, index) {
                        final donor = _donors[index];
                        return Card(
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundImage:
                                  donor['profilePic'] != null &&
                                      donor['profilePic'].isNotEmpty
                                  ? NetworkImage(donor['profilePic'])
                                  : null,
                              child:
                                  donor['profilePic'] == null ||
                                      donor['profilePic'].isEmpty
                                  ? Text(donor['name']?[0] ?? 'D')
                                  : null,
                            ),
                            title: Text(donor['name'] ?? 'Unknown'),
                            subtitle: Text(donor['email'] ?? ''),
                            trailing: isMobile
                                ? PopupMenuButton<String>(
                                    onSelected: (value) {
                                      if (value == 'edit') {
                                        _startEditing(donor);
                                      } else if (value == 'delete') {
                                        _deleteDonor(donor['_id']);
                                      }
                                    },
                                    itemBuilder: (context) => [
                                      const PopupMenuItem(
                                        value: 'edit',
                                        child: Text('Edit'),
                                      ),
                                      const PopupMenuItem(
                                        value: 'delete',
                                        child: Text('Delete'),
                                      ),
                                    ],
                                  )
                                : Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      IconButton(
                                        icon: const Icon(Icons.edit),
                                        onPressed: () => _startEditing(donor),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.delete),
                                        onPressed: () =>
                                            _deleteDonor(donor['_id']),
                                      ),
                                    ],
                                  ),
                            onTap: () {
                              // Navigate to donor profile
                              context.go('/donor-profile');
                            },
                          ),
                        );
                      },
                    ),
            ),
            const SizedBox(height: 20),
            Text(
              _isEditing ? 'Edit Donor' : 'Add New Donor',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),
            Expanded(
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Name',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) =>
                            value?.isEmpty ?? true ? 'Required' : null,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) =>
                            value?.isEmpty ?? true ? 'Required' : null,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _phoneController,
                        decoration: const InputDecoration(
                          labelText: 'Phone',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) =>
                            value?.isEmpty ?? true ? 'Required' : null,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _cityController,
                        decoration: const InputDecoration(
                          labelText: 'City',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 10),
                      _buildMultiSelectField(
                        'Preferred Cause Types',
                        _selectedCauseTypes,
                        _causeTypes,
                        Icons.favorite,
                        (values) =>
                            setState(() => _selectedCauseTypes = values),
                      ),
                      const SizedBox(height: 10),
                      _buildMultiSelectField(
                        'Preferred School Levels',
                        _selectedSchoolLevels,
                        _schoolLevels,
                        Icons.school,
                        (values) =>
                            setState(() => _selectedSchoolLevels = values),
                      ),
                      const SizedBox(height: 10),
                      _buildMultiSelectField(
                        'Preferred Areas',
                        _selectedAreas,
                        _areas,
                        Icons.location_on,
                        (values) => setState(() => _selectedAreas = values),
                      ),
                      const SizedBox(height: 10),
                      isMobile
                          ? Column(
                              children: [
                                ElevatedButton.icon(
                                  onPressed: _pickProfilePicture,
                                  icon: const Icon(Icons.camera_alt),
                                  label: const Text('Profile Picture'),
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: const Size(
                                      double.infinity,
                                      50,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                ElevatedButton.icon(
                                  onPressed: _pickDocuments,
                                  icon: const Icon(Icons.attach_file),
                                  label: const Text('Documents'),
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: const Size(
                                      double.infinity,
                                      50,
                                    ),
                                  ),
                                ),
                              ],
                            )
                          : Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: _pickProfilePicture,
                                    icon: const Icon(Icons.camera_alt),
                                    label: const Text('Profile Picture'),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: _pickDocuments,
                                    icon: const Icon(Icons.attach_file),
                                    label: const Text('Documents'),
                                  ),
                                ),
                              ],
                            ),
                      if (_selectedProfilePic != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 10),
                          child: Text(
                            'Profile Pic: ${_selectedProfilePic!.name}',
                          ),
                        ),
                      if (_selectedDocuments.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 10),
                          child: Text(
                            'Documents: ${_selectedDocuments.length} selected',
                          ),
                        ),
                      const SizedBox(height: 20),
                      isMobile
                          ? Column(
                              children: [
                                ElevatedButton(
                                  onPressed: _isLoading ? null : _saveDonor,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    minimumSize: const Size(
                                      double.infinity,
                                      50,
                                    ),
                                  ),
                                  child: _isLoading
                                      ? const CircularProgressIndicator()
                                      : Text(
                                          _isEditing
                                              ? 'Update Donor'
                                              : 'Add Donor',
                                        ),
                                ),
                                if (_isEditing) ...[
                                  const SizedBox(height: 10),
                                  ElevatedButton(
                                    onPressed: _clearForm,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.grey,
                                      minimumSize: const Size(
                                        double.infinity,
                                        50,
                                      ),
                                    ),
                                    child: const Text('Cancel'),
                                  ),
                                ],
                              ],
                            )
                          : Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: _isLoading ? null : _saveDonor,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue,
                                      minimumSize: const Size(
                                        double.infinity,
                                        50,
                                      ),
                                    ),
                                    child: _isLoading
                                        ? const CircularProgressIndicator()
                                        : Text(
                                            _isEditing
                                                ? 'Update Donor'
                                                : 'Add Donor',
                                          ),
                                  ),
                                ),
                                if (_isEditing) ...[
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: _clearForm,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.grey,
                                        minimumSize: const Size(
                                          double.infinity,
                                          50,
                                        ),
                                      ),
                                      child: const Text('Cancel'),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                    ],
                  ),
                ),
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Colors.blue),
                const SizedBox(width: 16),
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
              ],
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
        ),
      ),
    );
  }
}
