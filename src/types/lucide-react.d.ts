declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export const Check: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const MapPin: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const Tag: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Users: FC<IconProps>;
  export const Filter: FC<IconProps>;
  export const SortAsc: FC<IconProps>;
  export const SlidersHorizontal: FC<IconProps>;
  export const X: FC<IconProps>;
  export const PlusCircle: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const BarChart: FC<IconProps>;
  export const Heart: FC<IconProps>;
  export const Shield: FC<IconProps>;
  export const Sparkle: FC<IconProps>;
  export const Facebook: FC<IconProps>;
  export const Twitter: FC<IconProps>;
  export const Instagram: FC<IconProps>;
  export const Youtube: FC<IconProps>;
  export const Mail: FC<IconProps>;
} 