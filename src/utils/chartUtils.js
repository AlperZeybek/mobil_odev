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
 * Get color for category based on index
 */
const getColorForCategory = (category, totalCategories) => {
  const colors = [
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
  ];
  
  const index = category.charCodeAt(0) % colors.length;
  return colors[index];
};

