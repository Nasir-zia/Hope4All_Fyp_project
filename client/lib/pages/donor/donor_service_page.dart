import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../../donor_service.dart';
import '../../theme/app_theme.dart';
import '../../providers/auth_provider.dart';

class DonorServicePage extends StatefulWidget {
  const DonorServicePage({super.key});

  @override
  State<DonorServicePage> createState() => _DonorServicePageState();
}

class _DonorServicePageState extends State<DonorServicePage> {
  final DonorService _donorService = DonorService();
  List<dynamic> _donors = [];
  Map<String, dynamic>? _profile;
  bool _isLoading = false;

  // Form fields for adding product
  final _formKey = GlobalKey<FormState>();
  final _productNameController = TextEditingController();
  final _productDescriptionController = TextEditingController();
  final _productPriceController = TextEditingController();
  final _productCategoryController = TextEditingController();
  XFile? _productImage;
  List<PlatformFile> _productDocuments = [];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadProfile();
  }

  @override
  void initState() {
    super.initState();
    _loadDonors();
    _loadProfile();
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

  Future<void> _loadProfile() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final donorId = authProvider.userId;
    if (donorId != null) {
      try {
        final profile = await _donorService.getDonorProfile(donorId);
        if (mounted) setState(() => _profile = profile);
      } catch (e) {
        // Handle error
      }
    }
  }

  Future<void> _pickProductImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => _productImage = pickedFile);
    }
  }

  Future<void> _pickProductDocuments() async {
    final result = await FilePicker.platform.pickFiles(
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    );
    if (result != null) {
      setState(() => _productDocuments = result.files);
    }
  }

  Future<void> _addProduct() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final donorId = authProvider.userId;
    if (donorId == null) return;

    setState(() => _isLoading = true);
    try {
      // Prepare product data
      final productData = {
        'name': _productNameController.text,
        'description': _productDescriptionController.text,
        'price': double.tryParse(_productPriceController.text) ?? 0.0,
        'category': _productCategoryController.text,
        'donorId': donorId,
        // Add other product fields as needed
      };

      // For now, we'll simulate adding a product by updating the donor profile
      // In a real app, you'd have a separate product service
      await _donorService.updateDonorProfileWithFiles(
        donorId,
        productData,
        _productImage,
        _productDocuments,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Product added successfully!')),
        );
        _clearForm();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error adding product: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _clearForm() {
    _productNameController.clear();
    _productDescriptionController.clear();
    _productPriceController.clear();
    _productCategoryController.clear();
    setState(() {
      _productImage = null;
      _productDocuments = [];
    });
  }

  @override
  void dispose() {
    _productNameController.dispose();
    _productDescriptionController.dispose();
    _productPriceController.dispose();
    _productCategoryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Welcome, ${_profile?['name'] ?? 'Donor'}',
          style: TextStyle(color: AppTheme.white),
        ),
        backgroundColor: AppTheme.skyBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Donor Service Methods',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView(
                children: [
                  ListTile(
                    title: const Text('Get All Donors'),
                    subtitle: Text('Count: ${_donors.length}'),
                    trailing: IconButton(
                      icon: const Icon(Icons.refresh),
                      onPressed: _loadDonors,
                    ),
                  ),
                  if (_profile != null)
                    ListTile(
                      title: const Text('Donor Profile'),
                      subtitle: Text('Name: ${_profile!['name']}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.visibility),
                        onPressed: () {
                          // Show profile details
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Profile Details'),
                              content: Text(_profile.toString()),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Close'),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  const SizedBox(height: 20),
                  Text(
                    'Add Product',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 10),
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _productNameController,
                          decoration: const InputDecoration(
                            labelText: 'Product Name',
                            border: OutlineInputBorder(),
                          ),
                          validator: (value) =>
                              value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: _productDescriptionController,
                          decoration: const InputDecoration(
                            labelText: 'Description',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 3,
                          validator: (value) =>
                              value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: _productPriceController,
                          decoration: const InputDecoration(
                            labelText: 'Price',
                            border: OutlineInputBorder(),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) =>
                              value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: _productCategoryController,
                          decoration: const InputDecoration(
                            labelText: 'Category',
                            border: OutlineInputBorder(),
                          ),
                          validator: (value) =>
                              value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: _pickProductImage,
                                icon: const Icon(Icons.image),
                                label: const Text('Pick Image'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: _pickProductDocuments,
                                icon: const Icon(Icons.attach_file),
                                label: const Text('Pick Documents'),
                              ),
                            ),
                          ],
                        ),
                        if (_productImage != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 10),
                            child: Text('Image: ${_productImage!.name}'),
                          ),
                        if (_productDocuments.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 10),
                            child: Text(
                              'Documents: ${_productDocuments.length} selected',
                            ),
                          ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _isLoading ? null : _addProduct,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.skyBlue,
                            minimumSize: const Size(double.infinity, 50),
                          ),
                          child: _isLoading
                              ? const CircularProgressIndicator()
                              : const Text('Add Product'),
                        ),
                      ],
                    ),
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
