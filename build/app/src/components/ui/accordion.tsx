import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...p }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-rule', className)} {...p} />
))
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...p }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref} data-drill-trigger
      className={cn('flex flex-1 items-baseline gap-5 py-7 text-left transition-all [&[data-state=open]>.plus]:rotate-45', className)} {...p}>
      {children}
      <span className="plus ml-auto text-2xl text-cenere transition-transform duration-300">+</span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...p }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm acc-anim acc-content" {...p}>
    <div className={cn('pb-12 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
