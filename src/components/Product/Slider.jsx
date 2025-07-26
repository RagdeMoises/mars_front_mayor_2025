// ui/slider.jsx
import * as React from 'react';
import { Slider as SliderPrimitive } from '@radix-ui/react-slider';

const Slider = React.forwardRef(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <SliderPrimitive
        ref={ref}
        className={`relative flex w-full touch-none select-none items-center ${className}`}
        value={value}
        onValueChange={onValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive>
    );
  }
);
Slider.displayName = SliderPrimitive.displayName;

export { Slider };