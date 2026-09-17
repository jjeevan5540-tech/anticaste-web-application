const MockData = {
  users: [
    { id: 1, name: 'Justice Seeker', role: 'user', status: 'active', created: '2024-02-20' },
    { id: 2, name: 'Equality Voice', role: 'user', status: 'active', created: '2024-03-10' },
    { id: 3, name: 'Dalit Scholar', role: 'user', status: 'active', created: '2024-04-05' },
  ],

  posts: [
    { id: 1, userId: 1, anonymous: false, type: 'post', title: 'Understanding Caste Discrimination in Modern India', body: 'Caste discrimination continues to affect millions of people in India despite constitutional protections. This post explores the structural nature of caste inequality and its impact on education, employment, and daily life.', tags: ['Education', 'Awareness'], status: 'published', created: '2025-09-06T10:30:00', comments: 4, saved: false },
    { id: 2, userId: 2, anonymous: true, type: 'post', title: 'My Experience With Caste-Based Discrimination at Work', body: 'I want to share my experience facing subtle but persistent discrimination in the workplace. Despite having the same qualifications as my colleagues, I was consistently overlooked for promotions.', tags: ['Workplace', 'Personal'], status: 'published', created: '2025-09-05T14:15:00', comments: 7, saved: true },
    { id: 3, userId: 1, anonymous: false, type: 'video', title: 'The History of Anti-Caste Movements in India', body: 'A comprehensive overview of anti-caste resistance from Jyotirao Phule to Dr. B.R. Ambedkar and contemporary Dalit movements.', videoUrl: 'https://www.youtube.com/watch?v=P6AxMCzEYtE', tags: ['History', 'Movements'], status: 'published', created: '2025-09-04T09:00:00', comments: 3, saved: false },
    { id: 4, userId: 3, anonymous: false, type: 'post', title: 'Constitutional Protections Against Untouchability', body: 'Article 17 of the Indian Constitution abolishes untouchability in all forms. Article 15 prohibits discrimination on grounds of religion, race, caste, sex, or place of birth.', tags: ['Constitution', 'Rights'], status: 'published', created: '2025-09-03T11:45:00', comments: 2, saved: false },
    { id: 5, userId: 1, anonymous: false, type: 'file', title: 'Caste-Based Violence Statistics 2024', body: 'A comprehensive statistical analysis of caste-based violence incidents reported in India during 2024.', fileName: 'caste_violence_2024.pdf', fileSize: '2.4 MB', tags: ['Research', 'Data'], status: 'published', created: '2025-09-02T16:20:00', comments: 1, saved: false },
    { id: 6, userId: 2, anonymous: false, type: 'post', title: 'The Role of Education in Annihilating Caste', body: 'Education remains one of the most powerful tools for challenging caste hierarchy. We must advocate for inclusive educational policies.', tags: ['Education', 'Policy'], status: 'published', created: '2025-09-01T08:30:00', comments: 5, saved: false },
    { id: 7, userId: 3, anonymous: true, type: 'post', title: 'Bridging the Digital Divide and Caste', body: 'Access to technology and digital literacy is unevenly distributed along caste lines. This digital divide reinforces existing inequalities.', tags: ['Technology', 'Digital'], status: 'published', created: '2025-08-31T13:10:00', comments: 3, saved: false },
    { id: 8, userId: 1, anonymous: false, type: 'video', title: 'Dalit Women: Facing Double Discrimination', body: 'An examination of how caste and gender intersect to create unique forms of oppression for Dalit women.', videoUrl: 'https://www.youtube.com/watch?v=yr9lMKJ6b_M', tags: ['Gender', 'Resistance'], status: 'published', created: '2025-08-30T10:00:00', comments: 6, saved: false },
    { id: 9, userId: 11, anonymous: false, type: 'post', title: 'Community Guidelines Updated', body: 'We have updated our community guidelines to better protect members and ensure respectful discourse.', tags: ['Announcement'], status: 'published', created: '2025-08-29T09:00:00', comments: 0, saved: false },
    { id: 10, userId: 1, anonymous: false, type: 'file', title: 'Know Your Rights: Legal Aid Resources', body: 'A curated list of legal aid organizations and resources available for victims of caste-based discrimination.', fileName: 'legal_aid_resources.pdf', fileSize: '1.1 MB', tags: ['Legal', 'Rights'], status: 'published', created: '2025-08-28T15:30:00', comments: 2, saved: true },
    { id: 11, userId: 2, anonymous: false, type: 'post', title: 'Pending Content Test', body: 'This is a test post that is pending moderation review.', tags: ['Test'], status: 'pending', created: '2025-09-07T12:00:00', comments: 0, saved: false },
    { id: 12, userId: 3, anonymous: false, type: 'post', title: 'Another Pending Post', body: 'Another test post awaiting moderation approval.', tags: ['Test'], status: 'pending', created: '2025-09-07T13:00:00', comments: 0, saved: false },
    { id: 13, userId: 1, anonymous: false, type: 'video', title: 'Live Discussion on Anti-Caste Movement', body: 'A live session discussing the ongoing anti-caste movement and community solidarity efforts.', videoUrl: 'https://www.youtube.com/live/hczzxzhkGxg?si=z6plzOuynQAu6exy', tags: ['Live', 'Discussion'], status: 'published', created: '2025-09-15T10:00:00', comments: 0, saved: false },
    { id: 14, userId: 2, anonymous: false, type: 'video', title: 'Has India Finally Ended the Caste System?', body: 'Truth from a Maharashtra village — examining whether caste discrimination truly persists in modern India.', videoUrl: 'https://www.youtube.com/watch?v=TCJa1ZxzXy0', tags: ['Reality', 'Modern India'], status: 'published', created: '2025-09-14T08:00:00', comments: 0, saved: false },
    { id: 15, userId: 3, anonymous: false, type: 'video', title: 'Annihilation of Caste — Dr. B.R. Ambedkar', body: 'A summary and explanation of Dr. Ambedkar\'s most powerful speech calling for the complete destruction of the caste system.', videoUrl: 'https://www.youtube.com/watch?v=vkECglHtr6Q', tags: ['Ambedkar', 'Speech'], status: 'published', created: '2025-09-13T11:00:00', comments: 0, saved: false },
    { id: 16, userId: 1, anonymous: false, type: 'video', title: 'Bhimrao Ambedkar\'s Iconic BBC Interview (1955)', body: 'Dr. Ambedkar discusses his differences with Mahatma Gandhi and the future of untouchables in India.', videoUrl: 'https://www.youtube.com/watch?v=Wf3VJCpNMqI', tags: ['Ambedkar', 'History'], status: 'published', created: '2025-09-12T09:30:00', comments: 0, saved: false },
    { id: 17, userId: 2, anonymous: false, type: 'video', title: 'Ambedkar at Columbia University (1916)', body: 'Dr. Ambedkar\'s landmark speech on the caste system at Columbia University — the origin and structure of caste in India.', videoUrl: 'https://www.youtube.com/watch?v=dhp4ruQ64lM', tags: ['Ambedkar', 'Education'], status: 'published', created: '2025-09-11T14:00:00', comments: 0, saved: false },
    { id: 18, userId: 3, anonymous: false, type: 'video', title: 'India Untouched — Documentary on Caste Discrimination', body: 'A powerful documentary exposing untouchability practices still prevalent across India today.', videoUrl: 'https://www.youtube.com/watch?v=lgDGmYdhZvU', tags: ['Documentary', 'Awareness'], status: 'published', created: '2025-09-10T16:00:00', comments: 0, saved: false },
  ],

  comments: [
    { id: 1, postId: 1, userId: 2, anonymous: false, body: 'This is an important topic. Thank you.', created: '2025-09-06T12:00:00' },
    { id: 2, postId: 1, userId: 3, anonymous: true, body: 'Very well explained.', created: '2025-09-06T13:30:00' },
    { id: 3, postId: 2, userId: 1, anonymous: false, body: 'Thank you for sharing your experience.', created: '2025-09-05T16:00:00' },
  ],

  library: [
    { id: 1, category: 'History', title: 'The Caste System: A Historical Overview', description: 'Understanding the origins and evolution of caste hierarchy.', tags: ['History', 'Origins'], readTime: '12 min' },
    { id: 2, category: 'History', title: 'Anti-Caste Movements: A Timeline', description: 'Tracing the history of resistance against caste oppression.', tags: ['Movements', 'Resistance'], readTime: '15 min' },
    { id: 3, category: 'Law & Rights', title: 'Article 17: Abolition of Untouchability', description: 'A detailed analysis of Article 17 of the Indian Constitution.', tags: ['Constitution', 'Rights'], readTime: '8 min' },
    { id: 4, category: 'Law & Rights', title: 'SC/ST Prevention of Atrocities Act', description: 'Understanding the key provisions and impact of this legislation.', tags: ['Legislation', 'Protection'], readTime: '10 min' },
    { id: 5, category: 'Law & Rights', title: 'Reservation Policy Explained', description: 'The history and rationale of affirmative action in India.', tags: ['Reservation', 'Policy'], readTime: '11 min' },
    { id: 6, category: 'Key Figures', title: 'Dr. B.R. Ambedkar: Architect of Equality', description: 'The life and legacy of Dr. Babasaheb Ambedkar.', tags: ['Ambedkar', 'Constitution'], readTime: '18 min' },
    { id: 7, category: 'Key Figures', title: 'Jyotirao Phule: Pioneer of Social Reform', description: 'How Phule challenged caste orthodoxy.', tags: ['Phule', 'Reform'], readTime: '9 min' },
    { id: 8, category: 'Key Figures', title: 'Savitribai Phule: Champion of Education', description: 'Contributions to women\'s education and anti-caste activism.', tags: ['Savitribai', 'Education'], readTime: '8 min' },
    { id: 9, category: 'Glossary', title: 'Understanding Caste Terminology', description: 'A glossary of terms related to caste.', tags: ['Glossary', 'Terms'], readTime: '6 min' },
    { id: 10, category: 'Resources', title: 'Anti-Caste Reading List', description: 'Essential books and papers for understanding caste discrimination.', tags: ['Books', 'Reading'], readTime: '5 min' },
  ],

  discussions: [
    { id: 1, title: 'How can we address caste discrimination in tech hiring?', description: 'Exploring strategies for making the tech industry more inclusive.', author: 2, comments: 47 },
    { id: 2, title: 'What role does intersectionality play in the anti-caste movement?', description: 'Discussing how caste intersects with gender and class.', author: 3, comments: 32 },
    { id: 3, title: 'Share your experiences with reservation policy impacts', description: 'Personal stories and analysis of reservation policies.', author: 1, comments: 89 },
  ],

  events: [
    { id: 1, title: 'Anti-Caste Webinar Series', date: 'Every Saturday', time: '7:00 PM IST', location: 'Online (Zoom)', description: 'Weekly discussions on caste and resistance.' },
    { id: 2, title: 'Reading Ambedkar Book Club', date: 'First Sunday of Month', time: '5:00 PM IST', location: 'Online (Zoom)', description: 'Reading key works of Dr. B.R. Ambedkar.' },
  ],

  reports: [
    { id: 1, postId: 9, reason: 'spam', details: 'This appears to be promotional content.', reporter: 1, status: 'open', created: '2025-09-06T08:00:00' },
    { id: 2, postId: 7, reason: 'misinformation', details: 'Some claims seem unsupported.', reporter: 1, status: 'open', created: '2025-09-05T09:30:00' },
  ],

  statistics: { totalUsers: 15234, publishedContent: 1847, pendingPosts: 12, openReports: 2 },

  getUser(id) { return this.users.find(u => u.id === id); },
  getPublishedPosts() { return this.posts.filter(p => p.status === 'published'); },
  getPendingPosts() { return this.posts.filter(p => p.status === 'pending'); },
  getPostComments(postId) { return this.comments.filter(c => c.postId === postId); },
  getLibraryByCategory(cat) { return (!cat || cat === 'All') ? this.library : this.library.filter(r => r.category === cat); },
  searchLibrary(q) { q = q.toLowerCase(); return this.library.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))); },
  getOpenReports() { return this.reports.filter(r => r.status === 'open'); },
  getNextId(col) { return this[col].length === 0 ? 1 : Math.max(...this[col].map(i => i.id)) + 1; }
};
