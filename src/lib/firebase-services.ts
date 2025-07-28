import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Collection names
const COLLECTIONS = {
  HOUSES: 'houses',
  EVENTS: 'events',
  WINNERS: 'winners',
  EVENT_TEMPLATES: 'eventTemplates'
} as const;

// Types
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

// Houses Services
export const housesService = {
  // Get all houses
  async getHouses(): Promise<House[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.HOUSES));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as House));
  },

  // Listen to houses changes in real-time
  subscribeToHouses(callback: (houses: House[]) => void) {
    const q = query(collection(db, COLLECTIONS.HOUSES), orderBy('rank'));
    return onSnapshot(q, (querySnapshot) => {
      const houses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as House));
      callback(houses);
    });
  },

  // Add new house
  async addHouse(house: Omit<House, 'id'>): Promise<string> {
    const cleanHouse = Object.fromEntries(
      Object.entries(house).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    const docRef = await addDoc(collection(db, COLLECTIONS.HOUSES), {
      ...cleanHouse,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update house score
  async updateHouseScore(houseId: string, newScore: number) {
    const houseRef = doc(db, COLLECTIONS.HOUSES, houseId);
    await updateDoc(houseRef, { score: newScore });
  },

  // Update house rank
  async updateHouseRank(houseId: string, newRank: number) {
    const houseRef = doc(db, COLLECTIONS.HOUSES, houseId);
    await updateDoc(houseRef, { rank: newRank });
  }
};

// Events Services
export const eventsService = {
  // Get all events
  async getEvents(): Promise<Event[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.EVENTS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  },

  // Listen to events changes in real-time
  subscribeToEvents(callback: (events: Event[]) => void) {
    const q = query(collection(db, COLLECTIONS.EVENTS), orderBy('date', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      callback(events);
    });
  },

  // Add new event
  async addEvent(event: Omit<Event, 'id'>): Promise<string> {
    const cleanEvent = Object.fromEntries(
      Object.entries(event).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...cleanEvent,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update event
  async updateEvent(eventId: string, updates: Partial<Event>) {
    const eventRef = doc(db, COLLECTIONS.EVENTS, eventId);
    await updateDoc(eventRef, updates);
  },

  // Delete event
  async deleteEvent(eventId: string) {
    const eventRef = doc(db, COLLECTIONS.EVENTS, eventId);
    await deleteDoc(eventRef);
  }
};

// Winners Services
export const winnersService = {
  // Get all winners
  async getWinners(): Promise<Winner[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.WINNERS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Winner));
  },

  // Listen to winners changes in real-time
  subscribeToWinners(callback: (winners: Winner[]) => void) {
    const q = query(collection(db, COLLECTIONS.WINNERS), orderBy('position'));
    return onSnapshot(q, (querySnapshot) => {
      const winners = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Winner));
      callback(winners);
    });
  },

  // Add new winner
  async addWinner(winner: Omit<Winner, 'id'>): Promise<string> {
    const cleanWinner = Object.fromEntries(
      Object.entries(winner).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    const docRef = await addDoc(collection(db, COLLECTIONS.WINNERS), {
      ...cleanWinner,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update winner photo
  async updateWinnerPhoto(winnerId: string, imageUrl: string) {
    const winnerRef = doc(db, COLLECTIONS.WINNERS, winnerId);
    await updateDoc(winnerRef, { image: imageUrl });
  },

  // Upload winner photo to storage
  async uploadWinnerPhoto(file: File, winnerId: string): Promise<string> {
    const storageRef = ref(storage, `winners/${winnerId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
};

// Event Templates Services
export const eventTemplatesService = {
  // Get all event templates
  async getEventTemplates(): Promise<EventTemplate[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.EVENT_TEMPLATES));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventTemplate));
  },

  // Listen to event templates changes in real-time
  subscribeToEventTemplates(callback: (templates: EventTemplate[]) => void) {
    const q = query(collection(db, COLLECTIONS.EVENT_TEMPLATES), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const templates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventTemplate));
      callback(templates);
    });
  },

  // Add new event template
  async addEventTemplate(template: Omit<EventTemplate, 'id'>): Promise<string> {
    const cleanTemplate = Object.fromEntries(
      Object.entries(template).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENT_TEMPLATES), {
      ...cleanTemplate,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update event template
  async updateEventTemplate(templateId: string, updates: Partial<EventTemplate>) {
    const templateRef = doc(db, COLLECTIONS.EVENT_TEMPLATES, templateId);
    await updateDoc(templateRef, updates);
  },

  // Delete event template
  async deleteEventTemplate(templateId: string) {
    const templateRef = doc(db, COLLECTIONS.EVENT_TEMPLATES, templateId);
    await deleteDoc(templateRef);
  }
}; 