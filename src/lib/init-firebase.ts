import { housesService, eventsService, winnersService, eventTemplatesService } from './firebase-services';
import { House, Event, Winner, EventTemplate } from '@/hooks/useSparkData';

// Initial data for houses
const initialHouses: Omit<House, 'id'>[] = [
  { name: 'Tagore', score: 285, rank: 1, color: 'tagore' },
  { name: 'Gandhi', score: 240, rank: 2, color: 'gandhi' },
  { name: 'Nehru', score: 195, rank: 3, color: 'nehru' },
  { name: 'Delany', score: 180, rank: 4, color: 'delany' },
];

// Initial event templates
const initialEventTemplates: Omit<EventTemplate, 'id'>[] = [
  {
    name: 'Poetry Recitation',
    category: 'Junior',
    type: 'Individual',
    description: 'Express creativity through verse',
    time: '10:00 AM',
    venue: 'Main Auditorium'
  },
  {
    name: 'Group Dance',
    category: 'Senior',
    type: 'Group',
    description: 'Showcase traditional and modern dance forms',
    time: '2:00 PM',
    venue: 'School Ground'
  },
  {
    name: 'Science Quiz',
    category: 'Middle',
    type: 'Individual',
    description: 'Test your scientific knowledge',
    time: '11:00 AM',
    venue: 'Science Laboratory'
  },
  {
    name: 'Drama Competition',
    category: 'Senior',
    type: 'Group',
    description: 'Theatrical performances',
    time: '3:00 PM',
    venue: 'Main Auditorium'
  },
  {
    name: 'Art Exhibition',
    category: 'All',
    type: 'Individual',
    description: 'Display of creative artwork',
    time: '9:00 AM',
    venue: 'Art Gallery'
  }
];

// Initial events
const initialEvents: Omit<Event, 'id'>[] = [
  {
    name: 'Poetry Recitation',
    category: 'Junior',
    type: 'Individual',
    house: 'Tagore',
    position: 1,
    points: 10,
    date: '2024-01-15'
  },
  {
    name: 'Group Dance',
    category: 'Senior',
    type: 'Group',
    house: 'Gandhi',
    position: 1,
    points: 20,
    date: '2024-01-16'
  },
  {
    name: 'Science Quiz',
    category: 'Middle',
    type: 'Individual',
    house: 'Nehru',
    position: 2,
    points: 7,
    date: '2024-01-17'
  }
];

// Initial winners
const initialWinners: Omit<Winner, 'id'>[] = [
  {
    name: 'Arjun Sharma',
    event: 'Poetry Recitation',
    house: 'Tagore',
    position: 1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Priya Patel',
    event: 'Group Dance',
    house: 'Gandhi',
    position: 1,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d4?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Rahul Singh',
    event: 'Science Quiz',
    house: 'Nehru',
    position: 2,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Ananya Reddy',
    event: 'Drama Competition',
    house: 'Delany',
    position: 1,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Vikram Kumar',
    event: 'Art Exhibition',
    house: 'Tagore',
    position: 3,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

export const initializeFirebase = async () => {
  try {
    console.log('Initializing Firebase database...');

    // Initialize houses
    console.log('Adding houses...');
    for (const house of initialHouses) {
      await housesService.addHouse(house);
    }

    // Initialize event templates
    console.log('Adding event templates...');
    for (const template of initialEventTemplates) {
      await eventTemplatesService.addEventTemplate(template);
    }

    // Initialize events
    console.log('Adding events...');
    for (const event of initialEvents) {
      await eventsService.addEvent(event);
    }

    // Initialize winners
    console.log('Adding winners...');
    for (const winner of initialWinners) {
      await winnersService.addWinner(winner);
    }

    console.log('Firebase database initialized successfully!');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Function to add a house (for manual initialization)
export const addHouse = async (house: Omit<House, 'id'>) => {
  try {
    await housesService.addHouse(house);
    console.log(`House ${house.name} added successfully`);
  } catch (error) {
    console.error('Error adding house:', error);
    throw error;
  }
}; 