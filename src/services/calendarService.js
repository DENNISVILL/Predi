import apiClient from './apiClient';

/**
 * Synchronize a scheduled post to Google Calendar
 * @param {Object} eventData - The event details
 * @param {string} eventData.summary - Title of the event (e.g., "Publicar en TikTok: Receta Viral")
 * @param {string} eventData.description - Content of the event (e.g., The copy and hashtags)
 * @param {string} eventData.startDateTime - ISO string format of the publish time
 * @param {string} eventData.endDateTime - ISO string format of the end time (usually 30 mins after publish time)
 */
export const syncEventToGoogleCalendar = async (eventData) => {
  try {
    const response = await apiClient.post('/calendar/events', eventData);
    return response.data; // Expected output: { status: 'success', eventLink: 'https://...' }
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    throw error;
  }
};
