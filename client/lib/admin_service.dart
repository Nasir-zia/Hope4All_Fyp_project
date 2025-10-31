import 'dart:convert';
import 'package:http/http.dart' as http;

class AdminService {
  final String baseUrl = 'http://localhost:5000/api';

  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/stats'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load dashboard stats');
    }
  }

  Future<List<dynamic>> getUsers() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/users'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['users'];
    } else {
      throw Exception('Failed to load users');
    }
  }

  Future<List<dynamic>> getPendingRequests() async {
    final response = await http.get(
      Uri.parse('$baseUrl/requests?status=pending'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['requests'];
    } else {
      throw Exception('Failed to load pending requests');
    }
  }

  Future<List<dynamic>> getInventory() async {
    final response = await http.get(Uri.parse('$baseUrl/inventory'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['inventory'];
    } else {
      throw Exception('Failed to load inventory');
    }
  }

  Future<Map<String, dynamic>> getReportsData() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/reports'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load reports data');
    }
  }

  Future<List<dynamic>> getNotifications() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/notifications'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['notifications'];
    } else {
      throw Exception('Failed to load notifications');
    }
  }

  Future<Map<String, dynamic>> approveRequest(String requestId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/requests/$requestId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': 'approved'}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to approve request');
    }
  }

  Future<Map<String, dynamic>> rejectRequest(
    String requestId,
    String reason,
  ) async {
    final response = await http.put(
      Uri.parse('$baseUrl/requests/$requestId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': 'rejected', 'adminComments': reason}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to reject request');
    }
  }

  Future<Map<String, dynamic>> updateUserStatus(
    String userId,
    String status,
  ) async {
    final response = await http.put(
      Uri.parse('$baseUrl/admin/users/$userId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': status}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update user status');
    }
  }

  Future<Map<String, dynamic>> updateInventory(
    String itemId,
    int quantity,
  ) async {
    final response = await http.put(
      Uri.parse('$baseUrl/inventory/$itemId'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'quantity': quantity}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update inventory');
    }
  }

  Future<Map<String, dynamic>> addInventoryItem(
    Map<String, dynamic> itemData,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/inventory'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(itemData),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to add inventory item');
    }
  }

  Future<void> deleteInventoryItem(String itemId) async {
    final response = await http.delete(Uri.parse('$baseUrl/inventory/$itemId'));

    if (response.statusCode != 200) {
      throw Exception('Failed to delete inventory item');
    }
  }

  Future<List<dynamic>> getLowStockItems() async {
    final response = await http.get(Uri.parse('$baseUrl/inventory/low-stock'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['lowStockItems'];
    } else {
      throw Exception('Failed to load low stock items');
    }
  }

  Future<void> markNotificationAsRead(String notificationId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/admin/notifications/$notificationId/read'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to mark notification as read');
    }
  }

  Future<Map<String, dynamic>> createTask(Map<String, dynamic> taskData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/tasks'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(taskData),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create task');
    }
  }

  Future<List<dynamic>> getAllOrphans() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/orphans'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['orphans'];
    } else {
      throw Exception('Failed to load orphans');
    }
  }

  Future<List<dynamic>> getAllDonors() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/donors'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['donors'];
    } else {
      throw Exception('Failed to load donors');
    }
  }

  Future<List<dynamic>> getAllOrphanages() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/orphanages'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['orphanages'];
    } else {
      throw Exception('Failed to load orphanages');
    }
  }

  Future<List<dynamic>> getAllVolunteers() async {
    final response = await http.get(Uri.parse('$baseUrl/admin/volunteers'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['volunteers'];
    } else {
      throw Exception('Failed to load volunteers');
    }
  }

  Future<Map<String, dynamic>> getOrphanById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/admin/orphans/$id'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['orphan'];
    } else {
      throw Exception('Failed to load orphan');
    }
  }

  Future<Map<String, dynamic>> getDonorById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/admin/donors/$id'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['donor'];
    } else {
      throw Exception('Failed to load donor');
    }
  }

  Future<Map<String, dynamic>> getOrphanageById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/admin/orphanages/$id'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['orphanage'];
    } else {
      throw Exception('Failed to load orphanage');
    }
  }

  Future<Map<String, dynamic>> getVolunteerById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/admin/volunteers/$id'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['volunteer'];
    } else {
      throw Exception('Failed to load volunteer');
    }
  }

  Future<Map<String, dynamic>> getUserById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/admin/users/$id'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['user'];
    } else {
      throw Exception('Failed to load user');
    }
  }
}
