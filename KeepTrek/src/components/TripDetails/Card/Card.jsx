import * as React from "react";
import styles from './Card.module.css';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.card} ${className}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.cardHeader} ${className}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={`${styles.cardContent} ${className}`} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardContent }