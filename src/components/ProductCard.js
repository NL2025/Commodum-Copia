import React from 'react';
import styled from 'styled-components';

const ProductCard = ({ product }) => {
  return (
    <Card>
      <img src={product.afbeelding} alt={product.naam} />
      <h3>{product.naam}</h3>
      <p>Prijs: €{product.prijs}</p>
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;

export default ProductCard;
