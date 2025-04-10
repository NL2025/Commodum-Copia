import React from 'react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';

const Producten = () => {
  const producten = [
    { id: 1, naam: 'Appels', prijs: 2.99, afbeelding: 'apple.jpg' },
    { id: 2, naam: 'Bananen', prijs: 1.49, afbeelding: 'banana.jpg' },
    { id: 3, naam: 'Melk', prijs: 0.99, afbeelding: 'milk.jpg' },
  ];

  return (
    <ProductGrid>
      {producten.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
};

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
`;

export default Producten;
