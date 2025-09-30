import React, {useEffect, useState} from 'react'
import FilterLine from '../components/ProductsPage/FilterLine'
import ProductsList from '../components/ProductsPage/ProductsList'
import Breadcrumb from '../components/Breadcrumb'
import BrandsFilter from '../components/ProductsPage/BrandsFilter'
import { useBrands } from '../hooks/useBrands'
import {useParams, useSearchParams} from "react-router-dom";
import type {SortOption} from "../types/byPrice.ts";
import {useProducts} from "../hooks/useProducts.ts";
import ProductsResult from "../components/ProductsPage/ProductsResult.tsx";
import ByPrice from "../components/ProductsPage/ByPrice.tsx";

const ProductsPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams] = useSearchParams();
  const initialBrands = searchParams.get('brands')?.split(',') || [];
  const {brands} = useBrands(categoryName)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands)
  const [order, setOrder] = useState<SortOption>("highToLow");
  const [page, setPage] = useState(1);
  const { products, totalPages, totalProducts, loading, error } = useProducts(
    page,
    order,
    categoryName,
    selectedBrands,
  );

  useEffect(() => {
    setSelectedBrands([]);
    setPage(1);
  }, [categoryName]);
  
  useEffect(() => {
    setPage(1);
  }, [selectedBrands]);

  useEffect(() => {
    const brandsFromURL = searchParams.get('brands')?.split(',') || [];
    setSelectedBrands(brandsFromURL);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className=''>
      <div className="hidden lg:block lg:w-19/20 lg:mx-auto lg:px-40 lg:py-10">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/home" },
            { label: "Catalog", href: "/" },
            { label: categoryName || 'All Products', href: `/products_page/${categoryName || ''}` },
          ]}
        />
      </div>

      <div className=' lg:flex lg:w-17/22 lg:m-auto lg:relative lg:gap-8 xl:gap-35'>
        <div className=" hidden lg:flex lg:flex-col lg:flex-1 ">
          <BrandsFilter
            brands={brands}
            selectedBrands={selectedBrands}
            onChange={setSelectedBrands}
          />
        </div>
        <FilterLine
          categoryName={categoryName}
          selectedBrands={selectedBrands}
          onFiltersApply={setSelectedBrands}
          order={order}
          setOrder={setOrder}
        />
        <div className=' lg:flex-5'>
          <div className="hidden lg:flex lg:w-full lg:justify-between mb-4">
            <ProductsResult totalProducts={totalProducts} />
            <ByPrice order={order} setOrder={setOrder} />
          </div>
          <ProductsList
            products={products}
            totalPages={totalPages}
            loading={loading}
            error={error}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
