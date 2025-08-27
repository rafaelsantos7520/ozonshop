'use client';

import { getAllCategories } from '@/data/products';
import { Button } from '@/components/ui/button';
import React from 'react';

interface CategoryFilterProps {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

export function CategoryFilter({ onSelectCategory, selectedCategory }: CategoryFilterProps) {
  const categories = getAllCategories();

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        onClick={() => onSelectCategory(null)}
        className="rounded-full"
      >
        Todas as Categorias
      </Button>
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
