import 'dart:convert';
import 'package:http/http.dart' as http;

class VolunteerService {
  final String baseUrl = 'http://localhost:5000/api'; // Adjust as needed

  Future<List<dynamic>> getAssignedTasks(String volunteerId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/tasks/volunteer/$volunteerId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['tasks'];
    } else {
      throw Exception('Failed to fetch assigned tasks');
    }
  }

  Future<List<dynamic>> getTaskList() async {
    final response = await http.get(Uri.parse('$baseUrl/tasks'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['tasks'];
    } else {
      throw Exception('Failed to fetch task list');
    }
  }

  Future<Map<String, dynamic>> updateTaskStatus(
    String taskId,
    String status, {
    String? notes,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/tasks/$taskId/status'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'status': status, 'notes': notes}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update task status');
    }
  }

  Future<Map<String, dynamic>> getVolunteerStats(String volunteerId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/tasks/stats/$volunteerId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['stats'];
    } else {
      throw Exception('Failed to fetch volunteer stats');
    }
  }

  Future<List<dynamic>> getChatMessages(String otherUserId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/messages/$otherUserId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['messages'];
    } else {
      throw Exception('Failed to fetch chat messages');
    }
  }

  Future<List<dynamic>> getConversations() async {
    final response = await http.get(Uri.parse('$baseUrl/messages'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['conversations'];
    } else {
      throw Exception('Failed to fetch conversations');
    }
  }

  Future<Map<String, dynamic>> sendMessage(
    String receiverId,
    String message, {
    String type = 'text',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/messages'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'receiverId': receiverId,
        'message': message,
        'type': type,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to send message');
    }
  }

  Future<void> markMessagesRead(String otherUserId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/messages/$otherUserId/read'),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to mark messages as read');
    }
  }
}
