'use client';

import { Badge } from '@/components/ui/badge';
import { Droplets } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">OZONTECK</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Ozônio e Tecnologia
          </Badge>
        </div>
      </div>
    </header>
  );
}