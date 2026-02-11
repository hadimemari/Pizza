
export interface Ingredient {
  name: string;
  icon: string;
}

export interface Pizza {
  id: string;
  name: string;
  price: string;
  cheesiness: number;
  ingredients: string[];
  description: string;
  image: string;
  category: string;
}

export const PIZZAS: Pizza[] = [
  {
    id: "1",
    name: "Classic Margherita",
    price: "$14.99",
    cheesiness: 85,
    ingredients: ["Fresh Basil", "Mozzarella", "Tomato Sauce", "Olive Oil"],
    description: "The timeless Italian classic with fresh mozzarella and aromatic basil leaves.",
    image: "/pizzas/margherita.png",
    category: "pizzas"
  },
  {
    id: "2",
    name: "Double Pepperoni",
    price: "$16.99",
    cheesiness: 92,
    ingredients: ["Spicy Salami", "Extra Cheese", "Italian Herbs", "Oregano"],
    description: "A meat lover's dream packed with crispy pepperoni and melting double cheese.",
    image: "/pizzas/pepperoni.png",
    category: "pizzas"
  },
  {
    id: "3",
    name: "Roasted Veggie",
    price: "$15.49",
    cheesiness: 70,
    ingredients: ["Bell Peppers", "Olives", "Mushrooms", "Red Onion"],
    description: "A colorful garden blend of roasted vegetables on a crispy golden crust.",
    image: "/pizzas/veggie.png",
    category: "pizzas"
  },
  {
    id: "4",
    name: "BBQ Chicken",
    price: "$17.99",
    cheesiness: 80,
    ingredients: ["Grilled Chicken", "BBQ Sauce", "Corn", "Cilantro"],
    description: "Smoky BBQ sauce paired with tender grilled chicken for a rustic flavor profile.",
    image: "/pizzas/bbq.png",
    category: "pizzas"
  },
  {
    id: "5",
    name: "Hawaiian Tropical",
    price: "$15.99",
    cheesiness: 75,
    ingredients: ["Pineapple", "Ham", "Caramelized Onion", "Honey"],
    description: "Sweet pineapple and salty ham create a perfect tropical balance.",
    image: "/pizzas/hawaiian.png",
    category: "pizzas"
  }
];

export const CATEGORIES = [
  { id: "pizzas", label: "Pizza Slices", icon: "Pizza" },
  { id: "calzones", label: "Calzones", icon: "ChefHat" },
  { id: "sides", label: "Salads", icon: "Salad" },
  { id: "beverages", label: "Beverages", icon: "CupSoda" }
];
