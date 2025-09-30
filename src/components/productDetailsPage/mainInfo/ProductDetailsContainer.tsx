// Type guard para smartphone_spec
function isValidSmartphoneSpec(obj: any): obj is {
  screen_size: string;
  cpu: string;
  total_cores: string;
  main_camera: string;
  front_camera: string;
  battery: string;
} {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.screen_size === 'string' &&
    typeof obj.cpu === 'string' &&
    typeof obj.total_cores === 'string' &&
    typeof obj.main_camera === 'string' &&
    typeof obj.front_camera === 'string' &&
    typeof obj.battery === 'string'
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../../contexts/CartContext';
import { useParams } from 'react-router-dom';

import Breadcrumb from '../../Breadcrumb';
import ProductGallery from './ProductGallery';
import ProductTitle from './ProductTitle';
import ProductOptions from './ProductOptions';
import ProductSpecs from './ProductSpecs';
import ProductActions from './ProductActions';
import ProductDescription from './ProductDescription';
import ProductDeliveryInfo from './ProductDeliveryInfo';
import NotificationToast from './NotificationToast';

interface ProductData {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: string;
  discounted_price: string | null;
  stock: number;
  url_image: string;
  category: { name: string };
  colors: { name: string; hex_code: string }[];
  storage_options: { size: string }[];
  smartphone_spec: { /* ... */ } | null;
}

const ProductDetailsContainer = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch product data: ${errorText}`);
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return <div className="text-center mt-32">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center mt-32 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-32">Product not found.</div>;
  }

  const generateCrumbs = () => {
  const categoryName = product.category?.name || 'Category';
    return [
      { label: "Home", href: "/home" },
      { label: "Shop", href: "/products_page" },
      { label: categoryName, href: `/products_page/${categoryName}` },

      { label: product.brand, href: `/products_page?brands=${encodeURIComponent(product.brand)}`},

      { label: product.name },
    ];
  };

  const memoryOptions = product.storage_options?.map(option => option.size) ?? [];
  const hasMemoryOptions = memoryOptions.length > 0;

  let isSelectionComplete = false; 
  if (hasMemoryOptions) {
    isSelectionComplete = !!selectedColor && !!selectedMemory;
  } else {
    isSelectionComplete = !!selectedColor;
  }

  return (
    <>
      <Breadcrumb crumbs={generateCrumbs()} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <ProductGallery imageUrl={product.url_image} />
        <div className="flex flex-col">
          <ProductTitle 
            name={product.name}
            price={parseFloat(product.price)}
            originalPrice={product.discounted_price ? parseFloat(product.price) : null}
            discountedPrice={product.discounted_price ? parseFloat(product.discounted_price) : parseFloat(product.price)}
          />
          <ProductOptions
            colors={product.colors ?? []}
            memory={memoryOptions}
            selectedColor={selectedColor}
            selectedMemory={selectedMemory}
            onColorSelect={setSelectedColor}
            onMemorySelect={setSelectedMemory}
          />
          {isValidSmartphoneSpec(product.smartphone_spec) && (
            <ProductSpecs specs={product.smartphone_spec} />
          )}
          <ProductDescription description={product.description} />
          <div className="flex-grow" />
          <ProductActions
            isDisabled={!isSelectionComplete}
            onAddToCart={async () => {
              if (!productId) return;
              // Buscar nome da cor pelo hex_code
              const colorName = product.colors?.find(c => c.hex_code === selectedColor)?.name || selectedColor;
              await addToCart(Number(productId), {
                color: colorName || undefined,
                memory: selectedMemory || undefined,
              });
              setToastMessage('Product added to cart!');
            }}
            onAddToWishlist={() => setToastMessage('Added to Wishlist!')}
          />
          <ProductDeliveryInfo />
        </div>
      </div>
      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </>
  );
};

export default ProductDetailsContainer;