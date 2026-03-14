export async function logToNotion(
  playerName: string,
  totalXP: number,
  quizScores: Record<number, number>,
  completedAt: string
): Promise<void> {
  try {
    const notionToken = process.env.NEXT_PUBLIC_NOTION_TOKEN;
    const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;

    if (!notionToken || !databaseId) {
      console.warn('Notion credentials not configured');
      return;
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          'Name': { title: [{ text: { content: playerName } }] },
          'Total XP': { number: totalXP },
          'Mission 1 Score': { number: quizScores[1] ?? 0 },
          'Mission 2 Score': { number: quizScores[2] ?? 0 },
          'Mission 3 Score': { number: quizScores[3] ?? 0 },
          'Mission 4 Score': { number: quizScores[4] ?? 0 },
          'Mission 5 Score': { number: quizScores[5] ?? 0 },
          'Mission 6 Score': { number: quizScores[6] ?? 0 },
          'Completed At': { date: { start: completedAt } },
          'Certificate Issued': { checkbox: true },
          'Status': { select: { name: 'Completed' } },
        },
      }),
    });

    if (!response.ok) {
      console.warn('Notion API request failed:', response.status);
    }
  } catch (error) {
    console.warn('Failed to log to Notion:', error);
  }
}
