import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users } from "lucide-react";
import Header from "@/components/Header";

const Events = () => {
  // Mock data
  const events = [
    { id: '1', name: 'Poetry Recitation', category: 'Junior', type: 'Individual', house: 'Tagore', position: 1, points: 10, date: '2024-01-15' },
    { id: '2', name: 'Group Dance', category: 'Senior', type: 'Group', house: 'Gandhi', position: 1, points: 20, date: '2024-01-16' },
    { id: '3', name: 'Science Quiz', category: 'Middle', type: 'Individual', house: 'Nehru', position: 2, points: 7, date: '2024-01-17' },
    { id: '4', name: 'Drama Competition', category: 'Senior', type: 'Group', house: 'Delany', position: 1, points: 20, date: '2024-01-18' },
    { id: '5', name: 'Art Exhibition', category: 'All', type: 'Individual', house: 'Tagore', position: 3, points: 5, date: '2024-01-19' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Events</h1>
          <p className="text-muted-foreground">Complete list of SPARK events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{event.name}</span>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary text-primary">
                    {event.category}
                  </Badge>
                  <Badge variant={event.type === 'Individual' ? 'secondary' : 'default'}>
                    {event.type === 'Individual' ? <Users className="h-3 w-3 mr-1" /> : <Trophy className="h-3 w-3 mr-1" />}
                    {event.type}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Date: {new Date(event.date).toLocaleDateString()}
                </div>
                
                <div className="text-sm">
                  Points: <span className="font-semibold text-primary">{event.points}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;