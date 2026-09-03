import { NextResponse } from "next/server";

let initialMenu = [
  { id: "pb-sandwich", name: "Peanut Butter Banana Sandwich", price: 50, category: "Sandwich", badge: "Protein Rich", description: "Creamy peanut butter and fresh, sweet banana slices layered for a classic, protein-packed energy boost.", image: "/images/menu_poster.jpeg", inStock: true },
  { id: "chia-pudding", name: "Superfood Chia Pudding", price: 55, category: "Pudding", badge: "Energy Boost", description: "A velvety, nutrient-rich delight with a perfectly creamy texture and a hint of natural sweetness.", image: "/images/hero_poster.jpeg", inStock: true },
  { id: "rice-cakes", name: "Crispy Rice Cakes", price: 50, category: "Snack", badge: "Light Crunch", description: "Light, airy, and crisp—the perfect satisfying crunch to keep you fueled and focused.", image: "/images/menu_poster.jpeg", inStock: true },
  { id: "oats", name: "Whole Grain Oats", price: 65, category: "Bowl", badge: "Hearty Fiber", description: "A warm, comforting bowl of whole-grain oats, rich in fiber and simmered to a perfect, hearty texture.", image: "/images/hero_poster.jpeg", inStock: true },
  { id: "muesli", name: "Toasted Nut Muesli", price: 70, category: "Bowl", badge: "Wholesome Crunch", description: "A wholesome, satisfying crunch of toasted oats, premium nuts, and vibrant dried fruits.", image: "/images/menu_poster.jpeg", inStock: true },
  { id: "fruit-bowl", name: "Fresh Fruit Bowl", price: 50, category: "Bowl", badge: "100% Natural", description: "A vibrant, refreshing medley of freshly chopped fruits bursting with natural sweetness.", image: "/images/hero_poster.jpeg", inStock: true },
];

export async function GET() {
  return NextResponse.json({ success: true, menu: initialMenu });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.action === "update_price") {
      const item = initialMenu.find((i) => i.id === body.id);
      if (item) item.price = body.price;
    } else if (body.action === "add_item") {
      initialMenu.push(body.item);
    }
    return NextResponse.json({ success: true, menu: initialMenu });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
