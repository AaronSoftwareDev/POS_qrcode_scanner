// CategoryMenu.js
import React from "react";
import { Nav } from "react-bootstrap";

const CategoryMenu = ({ categories, onSelectCategory }) => {
  return (
    <Nav className="flex-column">
      {categories.map((category, index) => (
        <Nav.Link key={index} onClick={() => onSelectCategory(category)}>
          {category}
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default CategoryMenu;
