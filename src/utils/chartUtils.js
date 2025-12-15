// Chart utility functions

/**
 * Prepare data for bar chart (last 7 days)
 */
export const prepareBarChartData = (sessions, last7Days) => {
  const dataMap = {};
  
  // Initialize all days with 0
  last7Days.forEach(day => {
    dataMap[day] = 0;
  });
  
  // Sum duration for each day
  sessions.forEach(session => {
    const sessionDate = session.start_time.split('T')[0];
    if (dataMap.hasOwnProperty(sessionDate)) {
      dataMap[sessionDate] += session.duration_minutes || 0;
    }
  });
  
  return {
    labels: last7Days.map(day => {
      const date = new Date(day + 'T00:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        data: last7Days.map(day => dataMap[day]),
      },
    ],
  };
};

/**
 * Prepare data for pie chart (category distribution)
 */
export const preparePieChartData = (sessions) => {
  const categoryMap = {};
  
  // Sum duration by category
  sessions.forEach(session => {
    const category = session.category || 'Other';
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    categoryMap[category] += session.duration_minutes || 0;
  });
  
  // Convert to array format
  const data = Object.keys(categoryMap).map(category => ({
    name: category,
    duration: categoryMap[category],
    color: getColorForCategory(category, Object.keys(categoryMap).length),
    legendFontColor: '#1e293b',
    legendFontSize: 12,
  }));
  
  return data;
};

/**
 * Get color for category
 * Uses distinct, mid-contrast colors that work in both light and dark themes.
 */
const getColorForCategory = (category, totalCategories) => {
  const normalized = (category || '').toLowerCase();

  // Fixed colors for known categories so they are easy to distinguish
  switch (normalized) {
    case 'studying':
      return '#4F46E5'; // indigo
    case 'coding':
      return '#7C3AED'; // purple
    case 'project':
      return '#10B981'; // emerald
    case 'reading':
      return '#F59E0B'; // amber
    case 'revision':
      return '#EC4899'; // pink
    case 'break':
      return '#06B6D4'; // cyan
    default: {
      const fallbackColors = [
        '#6366F1', // indigo
        '#8B5CF6', // purple
        '#F97316', // orange
        '#22C55E', // green
        '#0EA5E9', // sky
        '#E11D48', // rose
        '#A855F7', // violet
        '#14B8A6', // teal
      ];

      const index =
        normalized && normalized.length > 0
          ? normalized.charCodeAt(0) % fallbackColors.length
          : 0;
      return fallbackColors[index];
    }
  }
};

