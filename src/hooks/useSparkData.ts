import { useState, useEffect } from 'react';
import { housesService, eventsService, winnersService, eventTemplatesService } from '@/lib/firebase-services';

export interface House {
  id?: string;
  name: string;
  score: number;
  rank: number;
  color: 'tagore' | 'delany' | 'gandhi' | 'nehru';
}

export interface Event {
  id?: string;
  name: string;
  category: 'Junior' | 'Middle' | 'Senior';
  type: 'Individual' | 'Group';
  house: string;
  position: number;
  points: number;
  date: string;
}

export interface EventTemplate {
  id?: string;
  name: string;
  category: string;
  type: 'Individual' | 'Group';
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
}

export interface Winner {
  id?: string;
  name: string;
  event: string;
  house: string;
  position: number;
  image?: string;
}

export const useSparkData = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [eventTemplates, setEventTemplates] = useState<EventTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate scoring based on position and type
  const calculatePoints = (position: number, type: 'Individual' | 'Group'): number => {
    const individualScoring = { 1: 10, 2: 7, 3: 5, 4: 3, 5: 2, 6: 1 };
    const groupScoring = { 1: 20, 2: 14, 3: 10, 4: 6 };
    
    if (type === 'Individual') {
      return individualScoring[position as keyof typeof individualScoring] || 0;
    } else {
      return groupScoring[position as keyof typeof groupScoring] || 0;
    }
  };

  // Set up real-time listeners
  useEffect(() => {
    setLoading(true);

    // Subscribe to houses changes
    const unsubscribeHouses = housesService.subscribeToHouses((houses) => {
      setHouses(houses);
    });

    // Subscribe to events changes
    const unsubscribeEvents = eventsService.subscribeToEvents((events) => {
      setEvents(events);
    });

    // Subscribe to winners changes
    const unsubscribeWinners = winnersService.subscribeToWinners((winners) => {
      setWinners(winners);
    });

    // Subscribe to event templates changes
    const unsubscribeTemplates = eventTemplatesService.subscribeToEventTemplates((templates) => {
      setEventTemplates(templates);
    });

    // Set loading to false after initial load
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      unsubscribeHouses();
      unsubscribeEvents();
      unsubscribeWinners();
      unsubscribeTemplates();
      clearTimeout(timer);
    };
  }, []);

  // Add new event (for admin)
  const addEvent = async (newEvent: Omit<Event, 'id' | 'points'>) => {
    try {
      const points = calculatePoints(newEvent.position, newEvent.type);
      const event: Omit<Event, 'id'> = {
        ...newEvent,
        points
      };
      
      await eventsService.addEvent(event);
      
      // Update house scores
      const updatedHouses = houses.map(house => 
        house.name === newEvent.house 
          ? { ...house, score: house.score + points }
          : house
      );
      
      // Recalculate ranks
      const sortedHouses = updatedHouses
        .sort((a, b) => b.score - a.score)
        .map((house, index) => ({ ...house, rank: index + 1 }));
      
      // Update each house in Firebase
      for (const house of sortedHouses) {
        if (house.id) {
          await housesService.updateHouseScore(house.id, house.score);
          await housesService.updateHouseRank(house.id, house.rank);
        }
      }
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  // Add new event template
  const addEventTemplate = async (newEventTemplate: Omit<EventTemplate, 'id'>) => {
    try {
      await eventTemplatesService.addEventTemplate(newEventTemplate);
    } catch (error) {
      console.error('Error adding event template:', error);
      throw error;
    }
  };

  // Add winner photo
  const addWinnerPhoto = async (winnerId: string, imageUrl: string) => {
    try {
      await winnersService.updateWinnerPhoto(winnerId, imageUrl);
    } catch (error) {
      console.error('Error updating winner photo:', error);
      throw error;
    }
  };

  // Upload winner photo
  const uploadWinnerPhoto = async (file: File, winnerId: string): Promise<string> => {
    try {
      return await winnersService.uploadWinnerPhoto(file, winnerId);
    } catch (error) {
      console.error('Error uploading winner photo:', error);
      throw error;
    }
  };

  return {
    houses,
    events,
    winners,
    eventTemplates,
    loading,
    addEvent,
    addEventTemplate,
    addWinnerPhoto,
    uploadWinnerPhoto,
    calculatePoints
  };
};