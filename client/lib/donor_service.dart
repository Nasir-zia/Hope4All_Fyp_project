// Import required Dart and Flutter packages
import 'dart:convert';
import 'package:http/http.dart'
    as http; // Used for HTTP requests (GET, POST, PUT, DELETE)
import 'package:http_parser/http_parser.dart'; // Used for setting file content types
import 'package:file_picker/file_picker.dart'; // Used for selecting files (like PDFs, docs)
import 'package:image_picker/image_picker.dart'; // Used for selecting images (camera/gallery)

// ✅ DonorService handles all API calls related to donors
class DonorService {
  // Base URL of your Node.js backend API
  // Make sure to replace localhost with your PC IP when running on a real device
  final String baseUrl = 'http://localhost:5000/api/donors';

  // ─────────────────────────────
  // 1️⃣ Register a new donor
  // ─────────────────────────────
  Future<Map<String, dynamic>> registerDonor({
    required String userId,
    required String name,
    required String email,
    required String phone,
    String? city,
    int? totalDonated,
    int? childrenHelped,
    DateTime? memberSince,
    Map<String, dynamic>? preferences,
    Map<String, dynamic>? notificationSettings,
    List<String>? matchedOrphans,
    String? profilePic,
    List<Map<String, dynamic>>? documents,
    DateTime? createdAt,
  }) async {
    // Make POST request to /api/donors/register
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'userId': userId,
        'name': name,
        'email': email,
        'phone': phone,
        'city': city ?? '',
        'totalDonated': totalDonated ?? 0,
        'childrenHelped': childrenHelped ?? 0,
        'memberSince':
            memberSince?.toIso8601String() ?? DateTime.now().toIso8601String(),
        'preferences': preferences ?? {},
        'notificationSettings':
            notificationSettings ??
            {
              'donationUpdates': true,
              'impactReports': true,
              'newOpportunities': true,
            },
        'matchedOrphans': matchedOrphans ?? [],
        'profilePic': profilePic ?? '',
        'documents': documents ?? [],
        'createdAt':
            createdAt?.toIso8601String() ?? DateTime.now().toIso8601String(),
      }),
    );

    // If request is successful (status 201), return response data
    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      // Otherwise, throw an error message
      throw Exception(
        jsonDecode(response.body)['message'] ?? 'Donor registration failed',
      );
    }
  }

  // ─────────────────────────────
  // 2️⃣ Get all donors list
  // ─────────────────────────────
  Future<List<dynamic>> getDonors() async {
    final response = await http.get(Uri.parse('$baseUrl/'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['donors'];
    } else {
      throw Exception('Failed to fetch donors');
    }
  }

  // ─────────────────────────────
  // 3️⃣ Get single donor profile by ID
  // ─────────────────────────────
  Future<Map<String, dynamic>> getDonorProfile(String donorId) async {
    final response = await http.get(Uri.parse('$baseUrl/profile/$donorId'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch donor profile');
    }
  }

  // ─────────────────────────────
  // 4️⃣ Update donor profile (basic info)
  // ─────────────────────────────
  Future<Map<String, dynamic>> updateDonorProfile(
    String donorId,
    Map<String, dynamic> profileData,
  ) async {
    final response = await http.put(
      Uri.parse('$baseUrl/profile/$donorId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(profileData),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update profile');
    }
  }

  // ─────────────────────────────
  // 5️⃣ Get all approved donation requests (from requests API)
  // ─────────────────────────────
  Future<List<dynamic>> getApprovedRequests() async {
    final response = await http.get(
      Uri.parse('http://localhost:5000/api/requests/approved'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['requests'];
    } else {
      throw Exception('Failed to fetch approved requests');
    }
  }

  // ─────────────────────────────
  // 6️⃣ Make a donation to a request
  // ─────────────────────────────
  Future<Map<String, dynamic>> makeDonation({
    required String donorId,
    required String requestId,
    required int units,
    required String recipientName,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/donate'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'donorId': donorId,
        'requestId': requestId,
        'units': units,
        'recipientName': recipientName,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
        jsonDecode(response.body)['message'] ?? 'Donation failed',
      );
    }
  }

  // ─────────────────────────────
  // 7️⃣ Get donor’s donation history
  // ─────────────────────────────
  Future<List<dynamic>> getDonationHistory(String donorId) async {
    final response = await http.get(Uri.parse('$baseUrl/history/$donorId'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['donations'];
    } else {
      throw Exception('Failed to fetch donation history');
    }
  }

  // ─────────────────────────────
  // 8️⃣ Get notifications for donor
  // ─────────────────────────────
  Future<List<dynamic>> getNotifications(String donorId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications/$donorId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['notifications'];
    } else {
      throw Exception('Failed to fetch notifications');
    }
  }

  // ─────────────────────────────
  // 9️⃣ Mark notification as read
  // ─────────────────────────────
  Future<void> markNotificationRead(String notificationId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/notifications/$notificationId/read'),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to mark notification as read');
    }
  }

  // ─────────────────────────────
  // 🔟 Get list of orphans that donor has donated to
  // ─────────────────────────────
  Future<List<dynamic>> getDonorOrphans(String donorId) async {
    final response = await http.get(Uri.parse('$baseUrl/orphans/$donorId'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['orphans'];
    } else {
      throw Exception('Failed to fetch donor orphans');
    }
  }

  // ─────────────────────────────
  // 1️⃣1️⃣ Update a specific donation record
  // ─────────────────────────────
  Future<Map<String, dynamic>> updateDonation(
    String donationId,
    Map<String, dynamic> updateData,
  ) async {
    final response = await http.put(
      Uri.parse('$baseUrl/donation/$donationId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(updateData),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update donation');
    }
  }

  // ─────────────────────────────
  // 1️⃣2️⃣ Delete a donation record
  // ─────────────────────────────
  Future<void> deleteDonation(String donationId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/donation/$donationId'),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete donation');
    }
  }

  // ─────────────────────────────
  // 1️⃣3️⃣ Get matched orphans for a donor
  // (based on donor preferences or donation history)
  // ─────────────────────────────
  Future<List<dynamic>> getMatchedOrphans(String donorId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/matched-orphans/$donorId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['orphans']; // Orphans that match donor’s criteria
    } else {
      throw Exception('Failed to fetch matched orphans');
    }
  }

  // ─────────────────────────────
  // 1️⃣4️⃣ Update donor profile with file uploads
  // (profile picture + documents)
  // ─────────────────────────────
  Future<Map<String, dynamic>> updateDonorProfileWithFiles(
    String donorId,
    Map<String, dynamic> profileData,
    XFile? profilePic,
    List<PlatformFile>? documents,
  ) async {
    // Create multipart request for sending text + files
    var request = http.MultipartRequest(
      'PUT',
      Uri.parse('$baseUrl/profile/$donorId'),
    );

    // Add normal text fields
    profileData.forEach((key, value) {
      if (value != null) {
        request.fields[key] = value.toString();
      }
    });

    // Add profile picture if selected
    if (profilePic != null) {
      request.files.add(
        await http.MultipartFile.fromPath(
          'profilePic',
          profilePic.path,
          filename: profilePic.name,
          contentType: MediaType('image', profilePic.name.split('.').last),
        ),
      );
    }

    // Add multiple supporting documents
    if (documents != null && documents.isNotEmpty) {
      for (var doc in documents) {
        if (doc.path != null) {
          request.files.add(
            await http.MultipartFile.fromPath(
              'documents',
              doc.path!,
              filename: doc.name,
              contentType: MediaType(
                'application',
                doc.extension ?? 'octet-stream',
              ),
            ),
          );
        }
      }
    }

    // Send request to backend
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update profile');
    }
  }

  // ─────────────────────────────
  // 1️⃣5️⃣ Get preference options
  // ─────────────────────────────
  Future<Map<String, dynamic>> getPreferenceOptions() async {
    final response = await http.get(Uri.parse('$baseUrl/preferences/options'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch preference options');
    }
  }

  // ─────────────────────────────
  // 1️⃣6️⃣ Delete donor
  // ─────────────────────────────
  Future<void> deleteDonor(String donorId) async {
    final response = await http.delete(Uri.parse('$baseUrl/$donorId'));

    if (response.statusCode != 200) {
      throw Exception('Failed to delete donor');
    }
  }
}
