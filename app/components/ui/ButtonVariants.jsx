// components/ui/ButtonVariants.jsx
// Quick button variants for different situations 💕

import { PrimaryButton, HeartIcon, StarIcon } from "./PrimaryButton";

const CTAButton = ({ children, ...props }) => (
  <PrimaryButton size="lg" className="shadow-xl hover:shadow-2xl" {...props}>
    {children}
  </PrimaryButton>
);

const ActionButton = ({ children, ...props }) => (
  <PrimaryButton size="md" variant="outline" {...props}>
    {children}
  </PrimaryButton>
);

const LoveButton = ({ children, ...props }) => (
  <PrimaryButton
    size="sm"
    icon={HeartIcon}
    className="text-pink-600 border-pink-300 hover:bg-pink-50"
    {...props}
  >
    {children}
  </PrimaryButton>
);

const MagicButton = ({ children, ...props }) => (
  <PrimaryButton
    size="sm"
    icon={SparkleIcon}
    variant="ghost"
    className="text-purple-600"
    {...props}
  >
    {children}
  </PrimaryButton>
);

export { CTAButton, ActionButton, LoveButton, MagicButton };
