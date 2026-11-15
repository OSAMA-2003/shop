// Static data for Kyandr E-Commerce: Collection products and Mockups
// Images are served directly from the frontend public directory

export const products = [
  {
    _id: "col_1",
    name: "Fresh casual outfit",
    name_en: "Fresh casual outfit",
    name_ar: "مظهر كاجوال عصري",
    description: "Fresh casual outfit featuring an orange buttoned shirt with a slightly fitted look and top buttons open for a laid-back style paired with cream straight-fit pants and clean white Nike Air Jordan sneakers. The vibrant orange tone adds energy to the outfit while the neutral pants keep the look balanced and stylish. Perfect inspiration for men’s casual outfits with buttoned shirts and modern sneaker styling",
    description_en: "Fresh casual outfit featuring an orange buttoned shirt with a slightly fitted look and top buttons open for a laid-back style paired with cream straight-fit pants and clean white Nike Air Jordan sneakers. The vibrant orange tone adds energy to the outfit while the neutral pants keep the look balanced and stylish. Perfect inspiration for men’s casual outfits with buttoned shirts and modern sneaker styling",
    description_ar: "مظهر كاجوال عصري يجمع بين قميص برتقالي بأزرار وقصة مريحة مع بنطال كريمي مستقيم وحذاء Nike Air Jordan أبيض نظيف. يضفي اللون البرتقالي لمسة حيوية على المظهر مع الحفاظ على توازن مثالي بفضل البنطال المحايد. تجربة مثالية لتنسيق القمصان الرجالية مع الأحذية العصرية.",
    price: 650,
    image: "/collection/c1.jpg",
    category: "Collection",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    _id: "col_2",
    name: "Burgundy Shirt with White Sneakers Combo",
    name_en: "Burgundy Shirt with White Sneakers Combo",
    name_ar: "إطلالة أنيقة بقميص نبيتي وحذاء رياضي أبيض",
    description: "Heavyweight French terry cotton crewneck sweatshirt. Designed for effortless streetwear layering with reinforced seams and brutalist aesthetics.",
    description_en: "Heavyweight French terry cotton crewneck sweatshirt. Designed for effortless streetwear layering with reinforced seams and brutalist aesthetics.",
    description_ar: "سويت شيرت مصنوع من قطن الميلتون الفرنسي الفاخر. مصمم لتنسيق طبقات الستريت وير العصرية مع درزات معززة وطابع بروتاليست مميز.",
    price: 850,
    image: "/collection/c2.jpg",
    category: "Collection",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    _id: "col_3",
    name: "Fresh formal outfit",
    name_en: "Fresh formal outfit",
    name_ar: "ستايل فورمال أنيق ومريح",
    description: "500 GSM ultra-dense fleece-lined brutalist hoodie. Double-layered structured hood, kangaroo pouch pocket, and premium rib-knit cuffs.",
    description_en: "500 GSM ultra-dense fleece-lined brutalist hoodie. Double-layered structured hood, kangaroo pouch pocket, and premium rib-knit cuffs.",
    description_ar: "هودي بروتاليست بوزن 500 جرام مبطن بالفليس فائق النعومة. غطاء رأس مزدوج الطبقات وجيب أمامي متسع مع أساور مضلعة عالية الجودة.",
    price: 950,
    image: "/collection/c3.jpg",
    category: "Collection",
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

export const mockups = [
  {
    _id: "mockup_black_hoodie",
    name: "Black Heavyweight Hoodie",
    name_en: "Black Heavyweight Hoodie",
    name_ar: "هودي أسود فاخر",
    description: "Premium black heavyweight hoodie blank for custom graphics. Features full front and back printable canvases.",
    description_en: "Premium black heavyweight hoodie blank for custom graphics. Features full front and back printable canvases.",
    description_ar: "نموذج هودي أسود فاخر قابل للتخصيص الكامل من الأمام والخلف بجودة طباعة فائقة.",
    price: 950,
    color: "Black",
    image: "/mockups/blackhoodie-front.png",
    imageFront: "/mockups/blackhoodie-front.png",
    imageBack: "/mockups/black-hoodie-back.png",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    printable: { x: 150, y: 150, width: 300, height: 400 }
  },
  {
    _id: "mockup_white_hoodie",
    name: "White Heavyweight Hoodie",
    name_en: "White Heavyweight Hoodie",
    name_ar: "هودي أبيض فاخر",
    description: "Clean optic white hoodie blank. Ultra-comfortable fleece fabric ready for your front and back custom artwork.",
    description_en: "Clean optic white hoodie blank. Ultra-comfortable fleece fabric ready for your front and back custom artwork.",
    description_ar: "نموذج هودي أبيض ناصع عالي الجودة. قماش مبطن مريح وجاهز لإضافة تصاميمك المميزة في الأمام والخلف.",
    price: 950,
    color: "White",
    image: "/mockups/white-hoodie-front.png",
    imageFront: "/mockups/white-hoodie-front.png",
    imageBack: "/mockups/white-hoodie-back.png",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    printable: { x: 150, y: 150, width: 300, height: 400 }
  },
  {
    _id: "mockup_black_shirt",
    name: "Black Oversized T-Shirt",
    name_en: "Black Oversized T-Shirt",
    name_ar: "تيشيرت أسود أوفرسايز",
    description: "Street-inspired black oversized boxy t-shirt with front and back customizable canvas areas. 240 GSM organic cotton.",
    description_en: "Street-inspired black oversized boxy t-shirt with front and back customizable canvas areas. 240 GSM organic cotton.",
    description_ar: "تيشيرت أسود أوفرسايز بتصميم عصري مسطح مع مساحات قابلة للتخصيص والطباعة من الأمام والخلف.",
    price: 650,
    color: "Black",
    image: "/mockups/black-shirt-front.png",
    imageFront: "/mockups/black-shirt-front.png",
    imageBack: "/mockups/black-shirt-back.png",
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    printable: { x: 150, y: 150, width: 300, height: 400 }
  },
  {
    _id: "mockup_white_shirt",
    name: "White Oversized T-Shirt",
    name_en: "White Oversized T-Shirt",
    name_ar: "تيشيرت أبيض أوفرسايز",
    description: "Heavyweight combed cotton white t-shirt mockup with wide printable chest and back areas. Clean silhouette.",
    description_en: "Heavyweight combed cotton white t-shirt mockup with wide printable chest and back areas. Clean silhouette.",
    description_ar: "تيشيرت أبيض أوفرسايز قطني ناعم وفاخر مع مساحة طباعة واسعة في الصدر والظهر.",
    price: 650,
    color: "White",
    image: "/mockups/white-shirt-front.png",
    imageFront: "/mockups/white-shirt-front.png",
    imageBack: "/mockups/white-shirt-back.png",
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    printable: { x: 150, y: 150, width: 300, height: 400 }
  }
];

export const all_products = products;
export const all_mockups = mockups;

export default {
  products,
  mockups,
  all_products,
  all_mockups
};

