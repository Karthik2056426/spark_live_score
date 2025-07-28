import { useState, useEffect } from 'react';
import { housesService, eventsService, winnersService, eventTemplatesService } from '@/lib/firebase-services';
import type { House, Event, Winner, EventTemplate } from '@/lib/firebase-services';

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

  // Set up real-time listeners and initialize if needed
  useEffect(() => {
    setLoading(true);

    const initializeIfNeeded = async () => {
      try {
        // Check if houses exist, if not create initial structure
        const existingHouses = await housesService.getHouses();
        if (existingHouses.length === 0) {
          // Initialize houses with zero scores
          const initialHouses = [
            { name: 'Tagore', score: 0, rank: 1, color: 'tagore' as const },
            { name: 'Gandhi', score: 0, rank: 2, color: 'gandhi' as const },
            { name: 'Nehru', score: 0, rank: 3, color: 'nehru' as const },
            { name: 'Delany', score: 0, rank: 4, color: 'delany' as const }
          ];

          for (const house of initialHouses) {
            await housesService.addHouse(house);
          }
        }
      } catch (error) {
        console.error('Error initializing houses:', error);
      }
    };

    // Initialize and set up listeners
    initializeIfNeeded().then(() => {
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
    });
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