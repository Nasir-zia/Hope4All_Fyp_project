import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../auth_service.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _userRole;
  String? _userId;
  String? _userName;
  String? _token;

  bool get isAuthenticated => _isAuthenticated;
  String? get userRole => _userRole;
  String? get userId => _userId;
  String? get userName => _userName;
  String? get token => _token;

  final AuthService _authService = AuthService();

  AuthProvider() {
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _userRole = prefs.getString('userRole');
    _userId = prefs.getString('userId');
    _userName = prefs.getString('userName');
    _isAuthenticated = _token != null && _userRole != null;
    notifyListeners();
  }

  Future<void> _saveAuthData(
    String token,
    String role,
    String id,
    String name,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('userRole', role);
    await prefs.setString('userId', id);
    await prefs.setString('userName', name);
    _token = token;
    _userRole = role;
    _userId = id;
    _userName = name;
    _isAuthenticated = true;
    notifyListeners();
  }

  Future<void> _clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userRole');
    await prefs.remove('userId');
    await prefs.remove('userName');
    _token = null;
    _userRole = null;
    _userId = null;
    _userName = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      final response = await _authService.login(
        email: email,
        password: password,
      );
      if (response['success'] == true) {
        final user = response['user'];
        await _saveAuthData(
          response['token'],
          user['role'],
          user['id'].toString(),
          user['username'] ?? user['name'] ?? 'User',
        );
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> register(
    String name,
    String email,
    String password,
    String role,
  ) async {
    try {
      final response = await _authService.signup(
        username: name,
        email: email,
        password: password,
        role: role,
      );
      if (response['success'] == true) {
        // Do not save auth data after registration, just return success
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    await _clearAuthData();
  }

  Future<bool> checkAuthStatus() async {
    // For now, just check if token exists. In a real app, you'd verify with backend.
    // Since AuthService doesn't have verifyToken, we'll assume token is valid if present.
    return _token != null && _userRole != null;
  }
}
