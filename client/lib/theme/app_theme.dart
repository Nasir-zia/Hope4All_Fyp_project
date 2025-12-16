import 'package:flutter/material.dart';

class AppTheme {
  static const Color skyBlue = Color(0xFF87CEEB);
  static const Color lightGreen = Color(0xFF90EE90);
  static const Color white = Colors.white;

  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: skyBlue,
      scaffoldBackgroundColor: white,
      fontFamily: 'Poppins',
      colorScheme: ColorScheme.fromSeed(
        seedColor: skyBlue,
        primary: skyBlue,
        secondary: lightGreen,
        surface: white,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: skyBlue,
        foregroundColor: white,
        elevation: 0,
        titleTextStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: white,
        ),
      ),
      cardTheme: CardThemeData(
        color: white,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: skyBlue,
          foregroundColor: white,
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          textStyle: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textTheme: TextTheme(
        headlineLarge: TextStyle(
          fontFamily: 'Poppins',
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
        headlineMedium: TextStyle(
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w600,
          color: Colors.black87,
        ),
        bodyLarge: TextStyle(fontFamily: 'Poppins', color: Colors.black87),
        bodyMedium: TextStyle(fontFamily: 'Poppins', color: Colors.black87),
      ),
      iconTheme: IconThemeData(color: skyBlue),
      progressIndicatorTheme: ProgressIndicatorThemeData(color: lightGreen),
    );
  }

  // Education-themed icons
  static const IconData bookIcon = Icons.book;
  static const IconData pencilIcon = Icons.edit;
  static const IconData schoolBagIcon = Icons.school;
  static const IconData heartIcon = Icons.favorite;
  static const IconData educationIcon = Icons.school_outlined;
  static const IconData volunteerIcon = Icons.volunteer_activism;
  static const IconData childIcon = Icons.child_care;
  static const IconData adminIcon = Icons.admin_panel_settings;
}
