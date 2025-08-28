'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/product?search=${encodeURIComponent(query.trim())}`);
      if (onSearch) {
        onSearch(query.trim());
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Buscar produtos... (Enter ou aguarde 2s)"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}
