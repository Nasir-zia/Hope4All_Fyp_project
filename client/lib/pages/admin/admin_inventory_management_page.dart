import 'package:flutter/material.dart';
import '../../../admin_service.dart';
import '../../../widgets/common_app_bar.dart';

class AdminInventoryManagementPage extends StatefulWidget {
  const AdminInventoryManagementPage({super.key});

  @override
  State<AdminInventoryManagementPage> createState() =>
      _AdminInventoryManagementPageState();
}

class _AdminInventoryManagementPageState
    extends State<AdminInventoryManagementPage> {
  final AdminService _adminService = AdminService();
  List<Map<String, dynamic>> _inventory = [];
  bool _isLoading = true;
  String _selectedCategory = 'all';

  @override
  void initState() {
    super.initState();
    _loadInventory();
  }

  Future<void> _loadInventory() async {
    try {
      final inventory = await _adminService.getInventory();
      if (mounted) {
        setState(() {
          _inventory = List<Map<String, dynamic>>.from(
            inventory.map((e) => Map<String, dynamic>.from(e)),
          );
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading inventory: $e')));
      }
    }
  }

  List<Map<String, dynamic>> get _filteredInventory {
    if (_selectedCategory == 'all') return _inventory;
    return _inventory
        .where((item) => item['category'] == _selectedCategory)
        .toList();
  }

  Future<void> _updateQuantity(String itemId, int newQuantity) async {
    try {
      await _adminService.updateInventory(itemId, newQuantity);
      if (mounted) {
        setState(() {
          final itemIndex = _inventory.indexWhere(
            (item) => item['id'].toString() == itemId,
          );
          if (itemIndex != -1) {
            _inventory[itemIndex]['quantity'] = newQuantity;
          }
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Inventory updated successfully')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error updating inventory: $e')));
      }
    }
  }

  void _showUpdateQuantityDialog(Map<String, dynamic> item) {
    final quantityController = TextEditingController(
      text: item['quantity'].toString(),
    );

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Update ${item['item']} Quantity'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: quantityController,
              decoration: const InputDecoration(
                labelText: 'New Quantity',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            Text(
              'Current: ${item['quantity']} | Min Threshold: ${item['minThreshold']}',
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              final newQuantity = int.tryParse(quantityController.text);
              if (newQuantity != null && newQuantity >= 0) {
                _updateQuantity(item['id'].toString(), newQuantity);
                Navigator.of(context).pop();
              }
            },
            child: const Text('Update'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonAppBar(title: 'Inventory Management'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Category Filter
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildCategoryChip('all', 'All Items'),
                        const SizedBox(width: 8),
                        _buildCategoryChip('Clothing', 'Clothing'),
                        const SizedBox(width: 8),
                        _buildCategoryChip('Stationery', 'Stationery'),
                        const SizedBox(width: 8),
                        _buildCategoryChip('Accessories', 'Accessories'),
                      ],
                    ),
                  ),
                ),
                // Inventory List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadInventory,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _filteredInventory.length,
                      itemBuilder: (context, index) {
                        final item = _filteredInventory[index];
                        final isLowStock =
                            item['quantity'] <= item['minThreshold'];
                        return Card(
                          elevation: 2,
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: _getCategoryColor(
                                item['category'],
                              ),
                              child: Icon(
                                _getCategoryIcon(item['category']),
                                color: Colors.white,
                              ),
                            ),
                            title: Text(
                              item['item'],
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Category: ${item['category']}'),
                                Text('Supplier: ${item['supplier']}'),
                                Text(
                                  'Last Updated: ${item['lastUpdated']}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                            trailing: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  '${item['quantity']}',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: isLowStock
                                        ? Colors.red
                                        : Colors.green,
                                  ),
                                ),
                                Text(
                                  'Min: ${item['minThreshold']}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                            onTap: () => _showUpdateQuantityDialog(item),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddItemDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildCategoryChip(String category, String label) {
    final isSelected = _selectedCategory == category;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() => _selectedCategory = category);
      },
      backgroundColor: isSelected ? Colors.blue[100] : Colors.grey[100],
      selectedColor: Colors.blue[200],
      checkmarkColor: Colors.blue,
    );
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Clothing':
        return Colors.blue;
      case 'Stationery':
        return Colors.green;
      case 'Accessories':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Clothing':
        return Icons.checkroom;
      case 'Stationery':
        return Icons.edit;
      case 'Accessories':
        return Icons.shopping_bag;
      default:
        return Icons.inventory;
    }
  }

  void _showAddItemDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add New Item'),
        content: const Text(
          'Item addition would integrate with procurement system. This feature would allow adding new inventory items with suppliers and categories.',
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
