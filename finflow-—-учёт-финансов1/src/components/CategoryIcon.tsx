import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  HeartPulse,
  Coffee,
  Home,
  Plane,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Sparkles,
  Gift,
  Coins,
  CircleDot,
  Palmtree,
  ShieldCheck,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Gamepad2':
      return <Gamepad2 {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Plane':
      return <Plane {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'Palmtree':
      return <Palmtree {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    default:
      return <CircleDot {...props} />;
  }
};
