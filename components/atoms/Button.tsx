import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  textClassName = '',
  ...props
}) => {
  const baseButtonStyles = 'py-3 px-6 rounded-xl flex items-center justify-center';
  const baseTextStyles = 'font-semibold text-center text-base';
  
  const variantStyles = {
    primary: {
      button: 'bg-primary',
      text: 'text-white'
    },
    secondary: {
      button: 'bg-lightGray',
      text: 'text-textDark'
    },
    outline: {
      button: 'bg-transparent border-2 border-primary',
      text: 'text-primary'
    }
  };
  
  const buttonStyles = twMerge(
    baseButtonStyles,
    variantStyles[variant].button,
    className
  );
  
  const textStyles = twMerge(
    baseTextStyles,
    variantStyles[variant].text,
    textClassName
  );
  
  return (
    <TouchableOpacity
      className={buttonStyles}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button; 