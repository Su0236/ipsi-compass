import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
const styles=cva('btn',{variants:{variant:{default:'primary',outline:'outline',ghost:'ghost'}},defaultVariants:{variant:'default'}});
export function Button({className,variant,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&VariantProps<typeof styles>){return <button className={twMerge(clsx(styles({variant}),className))} {...props}/>;}
