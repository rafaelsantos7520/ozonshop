'use client';

import React, { useState } from 'react';
import { IProduct, IReview } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Award, Shield, Star, Package, Palette, Ruler, Weight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductLandingProps {
  product: IProduct;
}

export default function ProductLanding({ product }: ProductLandingProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product as IProduct, quantity);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative w-full h-96 lg:h-[500px]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-contain bg-white rounded-2xl shadow-2xl"
              />
              {product.is_featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">
                  <Award className="w-3 h-3 mr-1" />
                  Destaque
                </Badge>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.secondary_image && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === product.image ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} - Imagem 1`}
                    fill
                    className="object-cover"
                  />
                </button>
                <button
                  onClick={() => setSelectedImage(product.secondary_image!)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === product.secondary_image ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={product.secondary_image}
                    alt={`${product.name} - Imagem 2`}
                    fill
                    className="object-cover"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>
              
              {/* Rating */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(Math.round(averageRating))}</div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({product.reviews.length} avaliações)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">
                R$ {Number(product.price).toFixed(2).replace('.', ',')}
              </span>
              {product.old_price && (
                <span className="text-xl text-gray-500 line-through">
                  R$ {Number(product.old_price).toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            {/* Stock Info */}
            <div className="text-sm text-gray-600">
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
              </span>
              <span className="ml-4">SKU: {product.sku}</span>
            </div>

            {/* Quantity and Buy Button */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={product.stock === 0}
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-6 text-lg font-semibold disabled:opacity-50"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
              </Button>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Produto Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Especificações Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Peso</p>
                    <p className="font-medium">{product.weight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Dimensões</p>
                    <p className="font-medium">{product.dimensions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Cores</p>
                    <p className="font-medium">{product.color}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{product.material}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avaliações dos Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user.name}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                  {product.reviews.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      E mais {product.reviews.length - 3} avaliações...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}