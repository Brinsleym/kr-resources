import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // A simple way to handle a user ID without full authentication
  const userId = "default_user"; 

  if (req.method === 'GET') {
    try {
      const lessons = await prisma.lesson.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
      });
      res.status(200).json(lessons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  } else if (req.method === 'POST') {
    try {
      const { date } = req.body;
      const newLesson = await prisma.lesson.create({
        data: {
          date: new Date(date),
          userId,
        },
      });
      res.status(201).json(newLesson);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}