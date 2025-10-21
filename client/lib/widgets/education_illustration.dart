import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class EducationIllustration extends StatelessWidget {
  final double size;
  final Color? color;

  const EducationIllustration({super.key, this.size = 100, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: (color ?? AppTheme.skyBlue).withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background pattern
          Positioned.fill(
            child: CustomPaint(
              painter: EducationPatternPainter(
                color: color ?? AppTheme.skyBlue,
              ),
            ),
          ),
          // Central icon
          Icon(
            AppTheme.bookIcon,
            size: size * 0.4,
            color: color ?? AppTheme.skyBlue,
          ),
          // Decorative elements
          Positioned(
            top: size * 0.1,
            right: size * 0.1,
            child: Icon(
              AppTheme.pencilIcon,
              size: size * 0.15,
              color: AppTheme.lightGreen,
            ),
          ),
          Positioned(
            bottom: size * 0.1,
            left: size * 0.1,
            child: Icon(
              AppTheme.heartIcon,
              size: size * 0.12,
              color: Colors.red.shade300,
            ),
          ),
        ],
      ),
    );
  }
}

class EducationPatternPainter extends CustomPainter {
  final Color color;

  EducationPatternPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color.withOpacity(0.1)
      ..style = PaintingStyle.fill;

    // Draw simple geometric patterns
    final path = Path();
    path.moveTo(0, size.height * 0.3);
    path.lineTo(size.width * 0.3, 0);
    path.lineTo(size.width * 0.6, size.height * 0.4);
    path.lineTo(size.width, size.height * 0.1);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
