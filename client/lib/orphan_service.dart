import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class OrphanService {
  final String baseUrl =
      'http://localhost:5000/api'; // Adjust if backend is on different port

  Future<Map<String, dynamic>> registerOrphan({
    required String userId,
    required String name,
    required int age,
    required String gender,
    required String location,
    File? profilePic,
    File? supportingDocs,
  }) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/upload/register'),
    );

    request.fields['userId'] = userId;
    request.fields['name'] = name;
    request.fields['age'] = age.toString();
    request.fields['gender'] = gender;
    request.fields['location'] = location;

    if (profilePic != null) {
      request.files.add(
        await http.MultipartFile.fromPath('profilePic', profilePic.path),
      );
    }
    if (supportingDocs != null) {
      request.files.add(
        await http.MultipartFile.fromPath(
          'supportingDocs',
          supportingDocs.path,
        ),
      );
    }

    var response = await request.send();
    var responseBody = await response.stream.bytesToString();

    if (response.statusCode == 201) {
      return jsonDecode(responseBody);
    } else {
      throw Exception(
        jsonDecode(responseBody)['message'] ?? 'Orphan registration failed',
      );
    }
  }

  Future<Map<String, dynamic>> submitRequest({
    required String orphanId,
    required String orphanageId,
    required String type,
    required int amount,
    required String description,
    required String school,
    String? classLevel,
    List<File>? documents,
  }) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/requests/submit'),
    );

    request.fields['orphanId'] = orphanId;
    request.fields['orphanageId'] = orphanageId;
    request.fields['type'] = type;
    request.fields['amount'] = amount.toString();
    request.fields['description'] = description;
    request.fields['school'] = school;
    if (classLevel != null) request.fields['class'] = classLevel;

    if (documents != null) {
      for (int i = 0; i < documents.length; i++) {
        request.files.add(
          await http.MultipartFile.fromPath('documents', documents[i].path),
        );
      }
    }

    var response = await request.send();
    var responseBody = await response.stream.bytesToString();

    if (response.statusCode == 201) {
      return jsonDecode(responseBody);
    } else {
      throw Exception(
        jsonDecode(responseBody)['message'] ?? 'Request submission failed',
      );
    }
  }

  Future<List<dynamic>> getRequestsByOrphan(String orphanId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/requests/orphan/$orphanId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['requests'];
    } else {
      throw Exception('Failed to fetch requests');
    }
  }

  Future<Map<String, dynamic>> getOrphanProfile(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/orphan/profile/$userId'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch orphan profile');
    }
  }
}
