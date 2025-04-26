import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface TextProps extends RNTextProps {
  className?: string;
  children: React.ReactNode;
}

export const H1: React.FC<TextProps> = ({ className = '', children, ...props }) => {
  const baseStyles = 'text-2xl font-bold text-textDark';
  const mergedStyles = twMerge(baseStyles, className);
  
  return (
    <RNText className={mergedStyles} {...props}>
      {children}
    </RNText>
  );
};

export const H2: React.FC<TextProps> = ({ className = '', children, ...props }) => {
  const baseStyles = 'text-xl font-semibold text-textDark';
  const mergedStyles = twMerge(baseStyles, className);
  
  return (
    <RNText className={mergedStyles} {...props}>
      {children}
    </RNText>
  );
};

export const H3: React.FC<TextProps> = ({ className = '', children, ...props }) => {
  const baseStyles = 'text-lg font-medium text-textDark';
  const mergedStyles = twMerge(baseStyles, className);
  
  return (
    <RNText className={mergedStyles} {...props}>
      {children}
    </RNText>
  );
};

export const Body: React.FC<TextProps> = ({ className = '', children, ...props }) => {
  const baseStyles = 'text-base font-normal text-textDark';
  const mergedStyles = twMerge(baseStyles, className);
  
  return (
    <RNText className={mergedStyles} {...props}>
      {children}
    </RNText>
  );
};

export const Caption: React.FC<TextProps> = ({ className = '', children, ...props }) => {
  const baseStyles = 'text-xs font-normal text-textLight';
  const mergedStyles = twMerge(baseStyles, className);
  
  return (
    <RNText className={mergedStyles} {...props}>
      {children}
    </RNText>
  );
}; 