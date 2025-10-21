import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class OrphanageService {
  final String baseUrl = 'http://localhost:5000/api/orphanages'; // Adjust if backend is on different port

  Future<Map<String, dynamic>> createOrphanage({
    required String name,
    required String registrationNumber,
    int? establishedYear,
    required String address,
    required String city,
    required String state,
    required String zipCode,
    required String phone,
    required String email,
    required int currentCapacity,
    required int maxCapacity,
    List<String>? facilities,
    String? managerName,
    int? staffCount,
    File? registrationCert,
    List<File>? buildingImages,
  }) async {
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/create'));

    request.fields['name'] = name;
    request.fields['registrationNumber'] = registrationNumber;
    if (establishedYear != null) request.fields['establishedYear'] = establishedYear.toString();
    request.fields['location[address]'] = address;
    request.fields['location[city]'] = city;
    request.fields['location[state]'] = state;
    request.fields['location[zipCode]'] = zipCode;
    request.fields['contactInfo[phone]'] = phone;
    request.fields['contactInfo[email]'] = email;
    request.fields['capacity[current]'] = currentCapacity.toString();
    request.fields['capacity[max]'] = maxCapacity.toString();
    if (facilities != null) {
      for (int i = 0; i < facilities.length; i++) {
        request.fields['facilities[$i]'] = facilities[i];
      }
    }
    if (managerName != null) request.fields['managerName'] = managerName;
    if (staffCount != null) request.fields['staffCount'] = staffCount.toString();

    if (registrationCert != null) {
      request.files.add(await http.MultipartFile.fromPath('registrationCert', registrationCert.path));
    }
    if (buildingImages != null) {
      for (var image in buildingImages) {
        request.files.add(await http.MultipartFile.fromPath('buildingImages', image.path));
      }
    }

    var response = await request.send();
    var responseBody = await response.stream.bytesToString();

    if (response.statusCode == 201) {
      return jsonDecode(responseBody);
    } else {
      throw Exception(jsonDecode(responseBody)['message'] ?? 'Orphanage creation failed');
    }
  }
}
