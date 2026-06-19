import { FaceShape } from "../types";

export interface StyleItem {
  id: string;
  name: string;
  description: string;
  suits: FaceShape[];
  tip: string;
  intensity: string;
}

export const HAIR_STYLES: StyleItem[] = [
  {
    id: "fade",
    name: "Fade",
    description: "Short sides with gradual blending up to the top, providing a clean and sharp contour.",
    suits: ["Round", "Oval", "Square", "Heart"],
    tip: "Perfect for elongating rounder faces by adding height on top and trimming the sides.",
    intensity: "Low Maintenance"
  },
  {
    id: "textured_crop",
    name: "Textured Crop",
    description: "A short, forward-swept style with textured pieces and a blunt crop fringe.",
    suits: ["Oval", "Square", "Oblong", "Heart"],
    tip: "A blunt fringe reduces the visual length of oblong or heart face shapes beautifully.",
    intensity: "Medium Maintenance"
  },
  {
    id: "quiff",
    name: "Quiff",
    description: "Volume-focused style brushed forwards and up at the front of the head.",
    suits: ["Round", "Square", "Oval", "Diamond"],
    tip: "Creates a strong focal point and lengthens round or square jaws visually.",
    intensity: "High Maintenance"
  },
  {
    id: "pompadour",
    name: "Pompadour",
    description: "Slicked back hair with dramatic height and dramatic volume at the front crest.",
    suits: ["Oval", "Round", "Square"],
    tip: "Provides high-class elegance. Best suited for faces with structured jawlines.",
    intensity: "High Maintenance"
  },
  {
    id: "side_part",
    name: "Side Part",
    description: "Classically elegant division with hair combed flat and styled to opposite sides.",
    suits: ["Oval", "Square", "Oblong", "Diamond"],
    tip: "Adds symmetry and structures soft-angled square or diamond structures.",
    intensity: "Low Maintenance"
  },
  {
    id: "undercut",
    name: "Undercut",
    description: "High-contrast style where side hair is disconnectedly trimmed with long top pieces.",
    suits: ["Square", "Round", "Oval", "Heart"],
    tip: "Accentuates cheekbones and provides an edgy, adventurous look.",
    intensity: "Medium Maintenance"
  },
  {
    id: "buzz_cut",
    name: "Buzz Cut",
    description: "Ultra-short uniform crop shaved close to the skull with clippers.",
    suits: ["Oval", "Square", "Diamond"],
    tip: "Extremely clean, highlighting bone structure. Avoid if you have high forehead lines.",
    intensity: "Zero Effort"
  },
  {
    id: "curly_styles",
    name: "Curly Styles",
    description: "Accentuating and defining natural waves or tight ringlet patterns for natural volume.",
    suits: ["Oval", "Square", "Heart", "Diamond"],
    tip: "Adds warmth and motion, offsetting hard edges of square and diamond jaws.",
    intensity: "Medium Maintenance"
  },
  {
    id: "medium_styles",
    name: "Medium Styles",
    description: "Flowing mid-length cuts that touch the ears or collar, such as shags or sweeps.",
    suits: ["Oval", "Oblong", "Heart", "Diamond"],
    tip: "Excellent for softening sharp profiles and adding proportional balance.",
    intensity: "High Maintenance"
  },
  {
    id: "long_styles",
    name: "Long Styles",
    description: "Shoulder-length hair, man buns, or naturally flowing locks with loose styling.",
    suits: ["Oval", "Square", "Diamond"],
    tip: "Conveys high creativity and filters hard jaw lines into soft, fluid shapes.",
    intensity: "Medium Maintenance"
  }
];

export const BEARD_STYLES: StyleItem[] = [
  {
    id: "clean_shave",
    name: "Clean Shave",
    description: "Completely bare skin, highlighting the natural structure and line of the jaw.",
    suits: ["Oval", "Oblong", "Round"],
    tip: "Keeps things clean and formal. Showcases your natural skin and jaw contour.",
    intensity: "Daily Shaving Required"
  },
  {
    id: "stubble",
    name: "Stubble",
    description: "Rough short growth that mimics a few days of shaving pause, conveying casual ruggedness.",
    suits: ["Round", "Square", "Heart", "Oval", "Diamond", "Oblong"],
    tip: "Universally flattering. Adds direct texture and shadows to softer angles.",
    intensity: "Low Maintenance"
  },
  {
    id: "short_beard",
    name: "Short Beard",
    description: "A neatly trimmed full beard with short-cropped sides conforming to the face.",
    suits: ["Oval", "Oblong", "Square", "Diamond"],
    tip: "Offers professional structure without overwhelming narrow or soft chins.",
    intensity: "Weekly Trim Recommended"
  },
  {
    id: "full_beard",
    name: "Full Beard",
    description: "Magnificent thick classic growth that covers cheeks, upper lip, chin, and jaw.",
    suits: ["Round", "Oval", "Heart", "Diamond"],
    tip: "Adds massive masculinity. Elongates round and heart faces by expanding the chin.",
    intensity: "High Maintenance"
  },
  {
    id: "boxed_beard",
    name: "Boxed Beard",
    description: "A stylized beard with clean sharp lines along cheeks and neckline defining a box.",
    suits: ["Round", "Oval", "Heart"],
    tip: "Creates a strong faux look of a square jawline for circular/round face types.",
    intensity: "High Detail Grooming"
  },
  {
    id: "goatee",
    name: "Goatee",
    description: "Facial hair restricted solely around the circle of the mouth and chin.",
    suits: ["Round", "Square", "Oval", "Oblong"],
    tip: "Draws focus inwards, elongating rounder profiles cleanly.",
    intensity: "Medium Maintenance"
  },
  {
    id: "van_dyke",
    name: "Van Dyke",
    description: "A disconnected sharp goatee paired with a stylized floating mustache.",
    suits: ["Round", "Square", "Oval", "Oblong"],
    tip: "A highly artistic, vintage look that lengthens the lower face visually.",
    intensity: "High Detail Grooming"
  }
];

export const FACE_SHAPE_METADATA: Record<FaceShape, {
  name: string;
  description: string;
  bestHair: string[];
  bestBeard: string[];
  stylingTips: string;
}> = {
  Oval: {
    name: "Oval",
    description: "Lengths are slightly greater than the width with slightly rounded side profiles.",
    bestHair: ["Quiff", "Side Part", "Pompadour", "Fade", "Textured Crop"],
    bestBeard: ["Clean Shave", "Stubble", "Short Beard"],
    stylingTips: "You have a highly versatile shape! Avoid covering up your forehead completely to preserve facial proportions."
  },
  Round: {
    name: "Round",
    description: "Equal length and width with soft angles and a circular aesthetic.",
    bestHair: ["Quiff", "Pompadour", "Undercut", "Fade"],
    bestBeard: ["Full Beard", "Boxed Beard", "Goatee", "Van Dyke"],
    stylingTips: "Aim for styles with height on top and close-cut sides. Avoid heavy buzz cuts or round fringes."
  },
  Square: {
    name: "Square",
    description: "Wide cheekbones, wide forehead, and strong prominently flat sharp jaw contours.",
    bestHair: ["Undercut", "Buzz Cut", "Side Part", "Curly Styles", "Fade"],
    bestBeard: ["Stubble", "Short Beard", "Goatee"],
    stylingTips: "Perfect for showing off strong jaw lines! Soft curls or a neat side part soften aggressive angles."
  },
  Heart: {
    name: "Heart",
    description: "Wider forehead tapering down into soft cheekbones and a narrow pointed chin.",
    bestHair: ["Textured Crop", "Medium Styles", "Curly Styles", "Undercut"],
    bestBeard: ["Full Beard", "Short Beard", "Stubble"],
    stylingTips: "Build volume on the lower face with a nice full beard or stubble to balance your wider forehead."
  },
  Diamond: {
    name: "Diamond",
    description: "Strong prominent high cheekbones with narrow hairline and narrow jaw.",
    bestHair: ["Quiff", "Medium Styles", "Curly Styles", "Side Part", "Long Styles"],
    bestBeard: ["Full Beard", "Stubble", "Short Beard"],
    stylingTips: "Keep hair voluminous at the front to offset wide cheekbones. Avoid cutting the sides too tight."
  },
  Oblong: {
    name: "Oblong",
    description: "Face length is significantly greater than width, with flat side contours.",
    bestHair: ["Textured Crop", "Side Part", "Medium Styles"],
    bestBeard: ["Stubble", "Short Beard", "Goatee"],
    stylingTips: "Avoid vertical height styles like pompadours. Choose forward fringed cuts or crops to shorten the appearance."
  }
};
