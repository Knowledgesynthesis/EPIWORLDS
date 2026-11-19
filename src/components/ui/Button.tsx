import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, type = 'button', ...props }, ref) => (
  <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />
));
Button.displayName = 'Button';

export { Button };
