import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import Header from "@/components/Header";

const Winners = () => {
  // Mock data
  const winners = [
    { id: '1', name: 'Arjun Sharma', event: 'Poetry Recitation', house: 'Tagore', position: 1, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '2', name: 'Priya Patel', event: 'Group Dance', house: 'Gandhi', position: 1, image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d4?w=150&h=150&fit=crop&crop=face' },
    { id: '3', name: 'Rahul Singh', event: 'Science Quiz', house: 'Nehru', position: 2, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }
  ];
  
  const houses = [
    { name: 'Tagore', color: 'tagore' },
    { name: 'Gandhi', color: 'gandhi' },
    { name: 'Nehru', color: 'nehru' },
    { name: 'Delany', color: 'delany' }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getPositionText = (position: number) => {
    switch (position) {
      case 1: return 'First Place';
      case 2: return 'Second Place';
      case 3: return 'Third Place';
      default: return `Position ${position}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Winners</h1>
          <p className="text-muted-foreground">Celebrating our SPARK champions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner, index) => (
            <Card key={winner.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                {/* Winner Photo Placeholder */}
                <div className="w-24 h-24 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                  {winner.image ? (
                    <img 
                      src={winner.image} 
                      alt={winner.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Trophy className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                {/* Winner Details */}
                <div className="text-center space-y-3">
                  <div className="text-4xl">{getPositionIcon(winner.position)}</div>
                  
                  <h3 className="text-xl font-bold text-foreground">{winner.name}</h3>
                  
                  <p className="text-muted-foreground font-medium">{winner.event}</p>
                  
                  <Badge 
                    variant="outline" 
                    className={`border-${houses.find(h => h.name === winner.house)?.color} text-${houses.find(h => h.name === winner.house)?.color}-foreground bg-${houses.find(h => h.name === winner.house)?.color}/10`}
                  >
                    {winner.house} House
                  </Badge>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Medal className="h-4 w-4" />
                    <span>{getPositionText(winner.position)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Winners;