import 'package:flutter/material.dart';

class OrphanLearningResourcesPage extends StatefulWidget {
  const OrphanLearningResourcesPage({super.key});

  @override
  State<OrphanLearningResourcesPage> createState() =>
      _OrphanLearningResourcesPageState();
}

class _OrphanLearningResourcesPageState
    extends State<OrphanLearningResourcesPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Learning Resources'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Urdu'),
            Tab(text: 'English'),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [_buildResourcesList('Urdu'), _buildResourcesList('English')],
      ),
    );
  }

  Widget _buildResourcesList(String language) {
    // Placeholder data - in real implementation, fetch from orphan_service.dart
    final List<Map<String, String>> resources = [
      {
        'type': 'e-book',
        'title': 'Mathematics Basics ($language)',
        'author': 'Author Name',
      },
      {
        'type': 'video',
        'title': 'Science Experiments ($language)',
        'duration': '15 min',
      },
      {'type': 'quiz', 'title': 'History Quiz ($language)', 'questions': '10'},
      {
        'type': 'e-book',
        'title': 'English Grammar ($language)',
        'author': 'Author Name',
      },
      {
        'type': 'video',
        'title': 'Geography Lesson ($language)',
        'duration': '20 min',
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: resources.length,
      itemBuilder: (context, index) {
        final resource = resources[index];
        return Card(
          elevation: 2,
          margin: const EdgeInsets.only(bottom: 12.0),
          child: ListTile(
            leading: Icon(
              resource['type'] == 'e-book'
                  ? Icons.book
                  : resource['type'] == 'video'
                  ? Icons.play_circle_fill
                  : Icons.quiz,
              color: Colors.blue,
              size: 40,
            ),
            title: Text(resource['title']!),
            subtitle: Text(
              resource['type'] == 'e-book'
                  ? 'Author: ${resource['author']}'
                  : resource['type'] == 'video'
                  ? 'Duration: ${resource['duration']}'
                  : 'Questions: ${resource['questions']}',
            ),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {
              // Placeholder: Open resource
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Opening ${resource['title'] ?? 'Resource'}'),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
